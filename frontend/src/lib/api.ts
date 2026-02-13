import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

const authHeaders = () => {
	try {
		const raw = localStorage.getItem("auth");
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		const token = parsed?.session?.access_token;
		return token ? { Authorization: `Bearer ${token}` } : {};
	} catch {
		return {};
	}
};

export type AuthResponse = {
	user: { id: string; email: string };
	session?: { access_token: string; refresh_token?: string; token_type?: string } | null;
};

export async function signIn(payload: { email: string; password: string }): Promise<AuthResponse> {
	const { data } = await api.post<AuthResponse>("/auth/sign-in", payload);
	return data;
}

export async function signUp(payload: { email: string; password: string }): Promise<AuthResponse> {
	const { data } = await api.post<AuthResponse>("/auth/sign-up", payload);
	return data;
}

export type SalesEntry = { amount: number; date?: string };
export type SalesSummary = { month_total: number; entries: { date: string; amount: number }[] };

export async function addSale(payload: SalesEntry): Promise<void> {
	await api.post("/sales", payload, { headers: authHeaders() });
}

export async function getSalesSummary(): Promise<SalesSummary> {
	const { data } = await api.get<SalesSummary>("/sales/summary", { headers: authHeaders() });
	return data;
}

export type ComplaintPayload = {
	subject: string;
	description: string;
	preferred_contact?: string;
	evidence_url?: string;
};

export type Policy = {
	title: string;
	summary: string;
	source: string;
	region: string;
};

export async function submitComplaint(payload: ComplaintPayload): Promise<void> {
	await api.post("/complaints", payload, { headers: authHeaders() });
}

export async function fetchPolicies(region?: string): Promise<Policy[]> {
	const params = region ? { region } : undefined;
	const { data } = await api.get<Policy[]>("/policies/street-vendors", { params });
	return data;
}

export async function health(): Promise<boolean> {
	try {
		await api.get("/health");
		return true;
	} catch {
		return false;
	}
}

export const apiClient = api;