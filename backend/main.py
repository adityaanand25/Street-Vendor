"""FastAPI server with Supabase-backed auth."""

from functools import lru_cache
from datetime import date, timedelta
from fastapi import Header
from pathlib import Path
from typing import Any, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from supabase import Client, create_client


class Settings(BaseSettings):
	"""Application settings loaded from environment variables or .env."""

	supabase_url: str
	supabase_key: str
	api_host: str = "0.0.0.0"
	api_port: int = 8000
	frontend_origin: str = "http://localhost:5174"

	model_config = SettingsConfigDict(
		env_file=str(Path(__file__).resolve().parent / ".env"),
		env_file_encoding="utf-8",
		env_prefix="",  # use exact variable names like SUPABASE_URL and SUPABASE_KEY
		extra="ignore",
	)


@lru_cache
def get_settings() -> Settings:
	return Settings()


def get_supabase_client(settings: Settings = Depends(get_settings)) -> Client:
	return create_client(settings.supabase_url, settings.supabase_key)


class SignUpRequest(BaseModel):
	email: str
	password: str = Field(min_length=8, max_length=128)


class SignInRequest(BaseModel):
	email: str
	password: str


class AuthUser(BaseModel):
	id: str
	email: str


class AuthSession(BaseModel):
	access_token: str
	refresh_token: Optional[str] = None
	token_type: str = "bearer"


class AuthResponse(BaseModel):
	user: AuthUser
	session: Optional[AuthSession] = None


class ComplaintRequest(BaseModel):
	subject: str = Field(min_length=3, max_length=200)
	description: str = Field(min_length=10, max_length=5000)
	preferred_contact: Optional[str] = Field(default=None, max_length=200)
	evidence_url: Optional[str] = Field(default=None, max_length=500)

class Policy(BaseModel):
	title: str
	summary: str
	source: str
	region: str


class IdVerificationRequest(BaseModel):
	gstin: Optional[str] = None
	fssai: Optional[str] = None


class ItemRequestPayload(BaseModel):
	item_name: str = Field(min_length=2, max_length=200)
	quantity: int = Field(gt=0, le=10000)
	notes: Optional[str] = Field(default=None, max_length=500)


POLICIES: list[Policy] = [
	Policy(
		title="Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014",
		summary=(
			"Defines rights of urban street vendors, mandates Town Vending Committees (TVCs),"
			" protects from arbitrary evictions, and outlines vending certificates."
		),
		source="https://legislative.gov.in/actsofparliamentfromtheyear/street-vendors-protection-livelihood-and-regulation-street-vending",
		region="India",
	),
	Policy(
		title="Model Street Vendor Policy (MoHUA)",
		summary=(
			"Guidelines from Ministry of Housing and Urban Affairs to operationalize the Act,"
			" including vending zones, grievance redressal, and inclusive planning."
		),
		source="https://mohua.gov.in/",
		region="India",
	),
	Policy(
		title="PM SVANidhi Micro-Credit Scheme",
		summary=(
			"Collateral-free working capital loans for street vendors with interest subsidy"
			" and digital transactions incentives."
		),
		source="https://pmsvanidhi.mohua.gov.in/",
		region="India",
	),
	Policy(
		title="Urban Street Vendors Scheme (State-specific)",
		summary=(
			"State/ULB-level implementations for vending certificates, designated vending zones,"
			" and social security linkages aligned to the 2014 Act."
		),
		source="https://mohua.gov.in/cms/street-vendors.aspx",
		region="India",
	),
]


class SalesEntryRequest(BaseModel):
	amount: float = Field(gt=0)
	date: Optional[date] = None


def _get_current_user(
	authorization: Optional[str] = Header(default=None),
	client: Client = Depends(get_supabase_client),
) -> AuthUser:
	if not authorization or not authorization.lower().startswith("bearer "):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
	token = authorization.split()[1]
	try:
		user_resp = client.auth.get_user(token)
		user_obj = getattr(user_resp, "user", None)
		if user_obj is None:
			raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
		return _to_user(user_obj, getattr(user_obj, "email", ""))
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc


def _ensure_table(client: Client, table: str) -> None:
	"""Best-effort table presence check; does not create but surfaces clear errors."""
	try:
		client.table(table).select("id").limit(1).execute()
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Table '{table}' not found. Please create it in Supabase.") from exc


def _gstin_format_is_valid(gstin: str) -> bool:
	"""Validate GSTIN format (structure only)."""
	pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
	return bool(re.fullmatch(pattern, gstin.strip().upper()))


def _fssai_format_is_valid(fssai: str) -> bool:
	"""Validate FSSAI license number format (14 digits)."""
	pattern = r"^[0-9]{14}$"
	return bool(re.fullmatch(pattern, fssai.strip()))


def _to_user(user: object, fallback_email: str) -> AuthUser:
	user_id = getattr(user, "id", None)
	email = getattr(user, "email", None) or fallback_email
	if not user_id:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Supabase did not return a user id")
	return AuthUser(id=str(user_id), email=email)


def _to_session(session: Optional[object]) -> Optional[AuthSession]:
	if session is None:
		return None
	access_token = getattr(session, "access_token", None)
	refresh_token = getattr(session, "refresh_token", None)
	token_type = getattr(session, "token_type", "bearer") or "bearer"
	if not access_token:
		return None
	return AuthSession(access_token=access_token, refresh_token=refresh_token, token_type=token_type)


def _upsert_profile(client: Client, user: AuthUser) -> None:
	"""Ensure a profile row exists for the auth user."""
	client.table("profiles").upsert({"id": user.id, "email": user.email}).execute()


app = FastAPI(title="FastAPI Supabase Auth")

settings = get_settings()
app.add_middleware(
	CORSMiddleware,
	allow_origins=[settings.frontend_origin],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
	"""Default landing route so platform health checks don't 404."""
	return {"message": "Street API is up"}


@app.get("/health")
async def health() -> dict[str, str]:
	return {"status": "ok"}


@app.post("/auth/sign-up", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(payload: SignUpRequest, client: Client = Depends(get_supabase_client)) -> AuthResponse:
	try:
		result = client.auth.sign_up({"email": payload.email, "password": payload.password})
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

	user = result.user
	if user is None:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sign up failed")

	try:
		_upsert_profile(client, _to_user(user, payload.email))
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Profile sync failed: {exc}") from exc

	return AuthResponse(user=_to_user(user, payload.email), session=_to_session(result.session))


@app.post("/auth/sign-in", response_model=AuthResponse)
async def sign_in(payload: SignInRequest, client: Client = Depends(get_supabase_client)) -> AuthResponse:
	try:
		result = client.auth.sign_in_with_password({"email": payload.email, "password": payload.password})
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

	user = result.user
	if user is None:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

	return AuthResponse(user=_to_user(user, payload.email), session=_to_session(result.session))


@app.post("/sales", status_code=status.HTTP_201_CREATED)
async def add_sale(
	payload: SalesEntryRequest,
	client: Client = Depends(get_supabase_client),
	user: AuthUser = Depends(_get_current_user),
):
	entry_date = payload.date or date.today()
	try:
		client.table("sales_entries").insert(
			{
				"vendor_id": user.id,
				"amount": payload.amount,
				"entry_date": entry_date.isoformat(),
			}
		).execute()
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to store sale: {exc}") from exc
	return {"status": "ok"}


@app.get("/sales/summary")
async def sales_summary(
	client: Client = Depends(get_supabase_client),
	user: AuthUser = Depends(_get_current_user),
):
	try:
		since = date.today() - timedelta(days=180)
		res = (
			client.table("sales_entries")
			.select("amount, entry_date")
			.eq("vendor_id", user.id)
			.gte("entry_date", since.isoformat())
			.order("entry_date")
			.execute()
		)
		rows = getattr(res, "data", []) or []
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to load sales: {exc}") from exc

	entries = []
	month_total = 0.0
	for row in rows:
		amt = float(row.get("amount", 0) or 0)
		entry_date = row.get("entry_date") or date.today().isoformat()
		entries.append({"date": entry_date, "amount": amt})
		# sum for current month
		try:
			d_obj = date.fromisoformat(entry_date)
			today = date.today()
			if d_obj.year == today.year and d_obj.month == today.month:
				month_total += amt
		except Exception:
			month_total += amt

	return {"month_total": month_total, "entries": entries}


@app.post("/complaints", status_code=status.HTTP_201_CREATED)
async def file_complaint(
	payload: ComplaintRequest,
	client: Client = Depends(get_supabase_client),
	user: AuthUser = Depends(_get_current_user),
):
	# Ensure table exists (raises clear error if missing)
	_ensure_table(client, "complaints")
	try:
		client.table("complaints").insert(
			{
				"user_id": user.id,
				"subject": payload.subject,
				"description": payload.description,
				"preferred_contact": payload.preferred_contact,
				"evidence_url": payload.evidence_url,
			}
		).execute()
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to file complaint: {exc}") from exc
	return {"status": "ok"}


@app.get("/policies/street-vendors", response_model=list[Policy])
async def list_street_vendor_policies(region: Optional[str] = None) -> list[Policy]:
	"""Return curated government policies relevant to street vendors. Optionally filter by region."""
	if region:
		region_lower = region.lower()
		return [p for p in POLICIES if p.region.lower() == region_lower]
	return POLICIES


@app.post("/verify/ids")
async def verify_ids(payload: IdVerificationRequest) -> dict[str, Any]:
	"""Verify GSTIN and FSSAI IDs by format. Replace with live govt lookup when available."""
	if not payload.gstin and not payload.fssai:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide gstin and/or fssai to verify")

	result: dict[str, Any] = {"source": "format_only"}

	if payload.gstin:
		result["gstin"] = payload.gstin.strip()
		result["gstin_valid_format"] = _gstin_format_is_valid(payload.gstin)

	if payload.fssai:
		result["fssai"] = payload.fssai.strip()
		result["fssai_valid_format"] = _fssai_format_is_valid(payload.fssai)

	return result


@app.post("/items/requests", status_code=status.HTTP_201_CREATED)
async def request_item(
	payload: ItemRequestPayload,
	client: Client = Depends(get_supabase_client),
	user: AuthUser = Depends(_get_current_user),
):
	"""Allow vendors to submit item requests (e.g., inventory or supplies)."""
	_ensure_table(client, "item_requests")
	try:
		client.table("item_requests").insert(
			{
				"user_id": user.id,
				"item_name": payload.item_name,
				"quantity": payload.quantity,
				"notes": payload.notes,
			}
		).execute()
	except Exception as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to submit item request: {exc}") from exc
	return {"status": "ok"}



def _run_server() -> None:
	settings = get_settings()
	uvicorn.run(
		"main:app",
		host=settings.api_host,
		port=settings.api_port,
		reload=True,
	)

if __name__ == "__main__":
	_run_server()
