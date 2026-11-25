import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Enter email and password."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError("Login failed. Check the email and password.");
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360, display: "grid", gap: 12 }}>
      <h2>Admin login</h2>
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
      {error && <p role="alert" style={{ color: "#B42318" }}>{error}</p>}
      <button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
