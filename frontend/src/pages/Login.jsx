import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

import { api } from "../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      const u = await login(email, password);
      navigate(u.role === "admin" ? "/admin" : u.role === "master" ? "/master" : "/client");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const forgot = async () => {
    if (!email) { setErr("Avval email kiriting"); return; }
    setErr(""); setMsg("");
    try {
      await api.forgotPassword(email);
      setMsg("Parolni tiklash uchun havola emailingizga yuborildi ✓");
      setShowForgot(false);
    } catch (e) { setErr(e.message); }
  };

  return (
    <div className="container" style={{ padding: "64px 48px", maxWidth: 480 }}>
      <GlassCard style={{ padding: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Kirish</h1>
        <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: 14 }}>RemontUZ hisobingizga kiring</p>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label>Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Parol</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {err && <div style={{ color: "#dc2626", fontSize: 13 }}>{err}</div>}
          {msg && <div style={{ color: "#c2410c", fontSize: 13, fontWeight: 500 }}>{msg}</div>}
          <button type="submit" className="btn btn-accent" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish →"}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: "center" }}>
          <button type="button" onClick={forgot} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: "#c2410c", fontWeight: 500, textDecoration: "underline",
          }}>Parolni unutdingizmi?</button>
        </div>

        <div style={{ marginTop: 14, fontSize: 13, color: "#64748b", textAlign: "center" }}>
          Hisobingiz yo'qmi? <Link to="/register" style={{ color: "#c2410c", fontWeight: 600 }}>Ro'yxatdan o'tish</Link>
        </div>
      </GlassCard>
    </div>
  );
}
