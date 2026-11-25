import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";

function Guard({ session, isAdmin, onLogout, children }: { session: Session | null; isAdmin: boolean | null; onLogout: () => void; children: JSX.Element }) {
  if (!session) return <Navigate to="/login" replace />;
  if (isAdmin === null) return <p style={{ padding: 24 }}>Checking access...</p>;
  if (!isAdmin) return (
    <div style={{ padding: 24 }}>
      <h2>Access denied</h2>
      <p>This account is not an admin. Ask the owner to grant admin access.</p>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
  return children;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle()
      .then(({ data }) => setIsAdmin(data?.role === "admin"));
  }, [session]);

  const logout = async () => { await supabase.auth.signOut(); navigate("/login"); };

  if (!ready) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#202938" }}>
      {session && isAdmin && (
        <nav style={{ background: "#101827", color: "#fff", padding: "12px 20px", display: "flex", gap: 16, alignItems: "center" }}>
          <strong>Admin</strong>
          <Link to="/" style={{ color: "#fff" }}>Products</Link>
          <Link to="/products/new" style={{ color: "#FF922E" }}>+ New product</Link>
          <button onClick={logout} style={{ marginLeft: "auto" }}>Log out</button>
        </nav>
      )}
      <main style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<Guard session={session} isAdmin={isAdmin} onLogout={logout}><Products /></Guard>} />
          <Route path="/products/:id" element={<Guard session={session} isAdmin={isAdmin} onLogout={logout}><ProductForm /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
