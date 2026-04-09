import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", role: "client", city: "Toshkent",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const u = await register(form);
      navigate(u.role === "master" ? "/master" : "/client");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "64px 48px", maxWidth: 520 }}>
      <GlassCard style={{ padding: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Ro'yxatdan o'tish</h1>
        <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: 14 }}>Yangi hisob yarating</p>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label>Kim sifatida?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { v: "client", l: "Mijoz" },
                { v: "master", l: "Usta" },
              ].map(r => (
                <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })}
                  className="btn" style={{
                    flex: 1,
                    background: form.role === r.v ? "#fb923c" : "rgba(255,255,255,0.6)",
                    color: form.role === r.v ? "#7c2d12" : "#64748b",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}>{r.l}</button>
              ))}
            </div>
          </div>
          <div><label>To'liq ism</label><input className="input" value={form.full_name} onChange={set("full_name")} required /></div>
          <div><label>Email</label><input className="input" type="email" value={form.email} onChange={set("email")} required /></div>
          <div><label>Telefon</label><input className="input" value={form.phone} onChange={set("phone")} placeholder="+998..." /></div>
          <div><label>Shahar</label><input className="input" value={form.city} onChange={set("city")} /></div>
          <div><label>Parol</label><input className="input" type="password" value={form.password} onChange={set("password")} required minLength={6} /></div>
          {err && <div style={{ color: "#dc2626", fontSize: 13 }}>{err}</div>}
          <button type="submit" className="btn btn-accent" disabled={loading}>
            {loading ? "..." : "Ro'yxatdan o'tish →"}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 13, color: "#64748b", textAlign: "center" }}>
          Hisobingiz bormi? <Link to="/login" style={{ color: "#c2410c", fontWeight: 600 }}>Kirish</Link>
        </div>
      </GlassCard>
    </div>
  );
}
