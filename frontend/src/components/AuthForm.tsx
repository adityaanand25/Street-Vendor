import { FormEvent, useState } from "react";
import { signIn, signUp } from "../lib/api";

type Mode = "sign-in" | "sign-up";

type Props = {
  mode: Mode;
  copy: {
    eyebrowSignIn: string;
    eyebrowSignUp: string;
    headerSignIn: string;
    headerSignUp: string;
    subSignIn: string;
    subSignUp: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitSignIn: string;
    submitSignUp: string;
    loading: string;
    signedIn: (email: string) => string;
    signedUp: (email: string) => string;
    error: string;
  };
  onSignedIn?: (email: string) => void;
  onSignedUp?: (email: string) => void;
};

export function AuthForm({ mode, copy, onSignedIn, onSignedUp }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setMessageType(null);
    setLoading(true);

    try {
      if (mode === "sign-in") {
        const res = await signIn({ email, password });
        setMessage(copy.signedIn(res.user.email));
        setMessageType("success");
        onSignedIn?.(res.user.email);
      } else {
        const res = await signUp({ email, password });
        setMessage(copy.signedUp(res.user.email));
        setMessageType("success");
        onSignedUp?.(res.user.email);
      }
    } catch (error) {
      const err = error as Error;
      setMessage(err.message || copy.error);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="eyebrow">{mode === "sign-in" ? copy.eyebrowSignIn : copy.eyebrowSignUp}</div>
        <h3>{mode === "sign-in" ? copy.headerSignIn : copy.headerSignUp}</h3>
        <p>{mode === "sign-in" ? copy.subSignIn : copy.subSignUp}</p>
      </div>

      <label>
        {copy.emailLabel}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.emailPlaceholder}
          required
        />
      </label>
      <label>
        {copy.passwordLabel}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={copy.passwordPlaceholder}
          minLength={8}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? copy.loading : mode === "sign-in" ? copy.submitSignIn : copy.submitSignUp}
      </button>
      {message && (
        <p className={`message ${messageType === "error" ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
