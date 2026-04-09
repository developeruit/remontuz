import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import DashboardHeader from "../components/DashboardHeader";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "", email: "" });
  const [masterForm, setMasterForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      full_name: user.full_name || "",
      phone: user.phone || "",
      city: user.city || "",
      email: user.email || "",
    });
    if (user.role === "master") {
      api.getMyMasterProfile().then(mp => {
        if (mp) setMasterForm({
          specializations: mp.specializations || "",
          experience_years: mp.experience_years || 0,
          bio: mp.bio || "",
          hourly_rate: mp.hourly_rate || 0,
          city: mp.city || "Toshkent",
        });
      });
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setErr(""); setMsg(""); setSaving(true);
    try {
      await api.updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
      });
      if (user.role === "master" && masterForm) {
        await api.updateMasterProfile(masterForm);
      }
      setMsg("Ma'lumotlar saqlandi ✓");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: "40px 48px", maxWidth: 900 }}>
      <DashboardHeader user={user} subtitle="Profil ma'lumotlarini tahrirlash" />

      {msg && (
        <div style={{
          padding: "12px 18px", borderRadius: 12, marginBottom: 20,
          background: "rgba(251,146,60,0.2)", color: "#c2410c",
          border: "1px solid rgba(251,146,60,0.35)",
          fontSize: 14, fontWeight: 500,
        }}>{msg}</div>
      )}

      <form onSubmit={save} style={{ display: "grid", gap: 20 }}>
        <GlassCard style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Asosiy ma'lumotlar</h3>
          <div style={{ display: "grid", gap: 14 }}>
            <div><label>To'liq ism</label>
              <input className="input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div><label>Email</label>
              <input className="input" value={form.email} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="grid-2">
              <div><label>Telefon</label>
                <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998..." />
              </div>
              <div><label>Shahar</label>
                <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>
          </div>
        </GlassCard>

        {user.role === "master" && masterForm && (
          <GlassCard style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, marginBottom: 18 }}>Usta ma'lumotlari</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div><label>Mutaxassislik</label>
                <input className="input" value={masterForm.specializations}
                  onChange={e => setMasterForm({ ...masterForm, specializations: e.target.value })}
                  placeholder="Masalan: Santexnik, Elektrik" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="grid-2">
                <div><label>Tajriba (yil)</label>
                  <input className="input" type="number" value={masterForm.experience_years}
                    onChange={e => setMasterForm({ ...masterForm, experience_years: +e.target.value })} />
                </div>
                <div><label>Soatlik narx (so'm)</label>
                  <input className="input" type="number" value={masterForm.hourly_rate}
                    onChange={e => setMasterForm({ ...masterForm, hourly_rate: +e.target.value })} />
                </div>
              </div>
              <div><label>O'zi haqida (bio)</label>
                <textarea className="input" rows={4} value={masterForm.bio}
                  onChange={e => setMasterForm({ ...masterForm, bio: e.target.value })}
                  placeholder="Qisqacha ma'lumot va tajribangiz..." />
              </div>
            </div>
          </GlassCard>
        )}

        {err && <div style={{ color: "#dc2626", fontSize: 14 }}>{err}</div>}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <button type="submit" className="btn btn-accent" disabled={saving}>
            {saving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm("Hisobdan chiqishni tasdiqlaysizmi?")) {
                logout();
                navigate("/");
              }
            }}
            style={{
              padding: "12px 22px",
              borderRadius: 50,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)",
              color: "#dc2626",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            }}
          >
            <IconLogout /> Hisobdan chiqish
          </button>
        </div>
      </form>
    </div>
  );
}
