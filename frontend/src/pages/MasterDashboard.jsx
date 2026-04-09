import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import Tabs from "../components/Tabs";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { supabase } from "../supabase";

const STATUS = {
  new:         { label: "Yangi",         color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  in_progress: { label: "Jarayonda",     color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  completed:   { label: "Tugallangan",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  cancelled:   { label: "Bekor qilingan", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

const fmt = (n) => Number(n || 0).toLocaleString("uz-UZ");

export default function MasterDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("available");
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [pfForm, setPfForm] = useState({ title: "", description: "", service_id: "" });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [o, p, s] = await Promise.all([
        api.orders().catch(() => []),
        api.portfolio(user?.id).catch(() => []),
        api.services().catch(() => []),
      ]);
      setOrders(o || []);
      setPortfolio(p || []);
      setServices(s || []);
      if (s[0]) setPfForm(f => ({ ...f, service_id: s[0].id }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) load(); /* eslint-disable-next-line */ }, [user]);

  // Realtime: yangi ariza kelganda toast
  useEffect(() => {
    const channel = supabase
      .channel("master-new-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if (payload.new.status === "new" && !payload.new.master_id) {
            toast.info("🆕 Yangi ariza keldi!");
            load();
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line
  }, []);

  const available = orders.filter(o => !o.master_id && o.status === "new");
  const mine = orders.filter(o => o.master_id === user?.id);
  const active = mine.filter(o => o.status === "in_progress");
  const completed = mine.filter(o => o.status === "completed");
  const earnings = completed.reduce((s, o) => s + Number(o.final_price || o.estimated_price || 0), 0);

  const take = async (id) => {
    try {
      await api.assignOrder(id);
      toast.success("Ariza qabul qilindi");
      load();
    } catch (e) { toast.error("Xatolik: " + e.message); }
  };
  const complete = async (id) => {
    try {
      await api.updateOrderStatus(id, "completed");
      toast.success("Ish tugallandi");
      load();
    } catch (e) { toast.error("Xatolik: " + e.message); }
  };

  const addPortfolio = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let before_image_url = null;
      let after_image_url = null;
      if (beforeFile) before_image_url = await api.uploadPortfolioImage(beforeFile);
      if (afterFile) after_image_url = await api.uploadPortfolioImage(afterFile);
      await api.addPortfolio({ ...pfForm, before_image_url, after_image_url });
      setPfForm({ title: "", description: "", service_id: services[0]?.id || "" });
      setBeforeFile(null);
      setAfterFile(null);
      setShowPortfolioForm(false);
      toast.success("Portfolio qo'shildi");
      load();
    } catch (e) {
      toast.error("Xatolik: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const removePortfolio = async (id) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.deletePortfolio(id);
      toast.success("O'chirildi");
      load();
    } catch (e) { toast.error("Xatolik: " + e.message); }
  };

  const showList = {
    available,
    active,
    completed,
  };

  return (
    <div className="container" style={{ padding: "32px clamp(16px, 3vw, 48px)" }}>
      <DashboardHeader user={user} subtitle="Usta kabineti — buyurtmalar va portfolio boshqaruvi" />

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 28,
      }} className="grid-4">
        <StatCard icon="🆕" label="Mavjud arizalar" value={available.length} color="#3b82f6" />
        <StatCard icon="⚙️" label="Faol ishlar" value={active.length} color="#f59e0b" />
        <StatCard icon="✅" label="Tugallangan" value={completed.length} color="#10b981" />
        <StatCard icon="💰" label="Jami daromad" value={fmt(earnings)} sub="so'm" color="#fb923c" />
      </div>

      {/* TABS */}
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "available", label: "Mavjud arizalar", count: available.length },
          { id: "active",    label: "Mening ishlarim", count: active.length },
          { id: "completed", label: "Tugallangan",     count: completed.length },
          { id: "portfolio", label: "Portfolio",        count: portfolio.length },
        ]}
      />

      {/* CONTENT */}
      {loading ? (
        <GlassCard style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yuklanmoqda...</GlassCard>
      ) : tab === "portfolio" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Ishlar namunalari</h2>
            <button className="btn btn-accent" onClick={() => setShowPortfolioForm(!showPortfolioForm)}>
              {showPortfolioForm ? "Bekor qilish" : "+ Yangi ish qo'shish"}
            </button>
          </div>

          {showPortfolioForm && (
            <GlassCard style={{ padding: 24, marginBottom: 20 }}>
              <form onSubmit={addPortfolio} style={{ display: "grid", gap: 16 }}>
                <div>
                  <label>Ish nomi</label>
                  <input className="input" value={pfForm.title}
                    onChange={e => setPfForm({ ...pfForm, title: e.target.value })} required />
                </div>
                <div>
                  <label>Tavsif</label>
                  <textarea className="input" rows={3} value={pfForm.description}
                    onChange={e => setPfForm({ ...pfForm, description: e.target.value })} />
                </div>
                <div>
                  <label>Xizmat turi</label>
                  <select className="input" value={pfForm.service_id}
                    onChange={e => setPfForm({ ...pfForm, service_id: +e.target.value })}>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="grid-2">
                  <FileField label="«Oldin» rasmi" file={beforeFile} setFile={setBeforeFile} />
                  <FileField label="«Keyin» rasmi" file={afterFile} setFile={setAfterFile} />
                </div>

                <button type="submit" className="btn btn-accent" disabled={uploading}>
                  {uploading ? "Yuklanmoqda..." : "Qo'shish"}
                </button>
              </form>
            </GlassCard>
          )}

          {portfolio.length === 0 ? (
            <GlassCard style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
              <h3 style={{ fontSize: 18 }}>Portfolio bo'sh</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
                Birinchi ishingizni qo'shing
              </p>
            </GlassCard>
          ) : (
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {portfolio.map(p => (
                <GlassCard key={p.id} hoverable style={{ padding: 18 }}>
                  {(p.before_image_url || p.after_image_url) ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 12, borderRadius: 10, overflow: "hidden" }}>
                      {p.before_image_url ? (
                        <div style={{ position: "relative" }}>
                          <img src={p.before_image_url} alt="oldin" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                          <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.65)", color: "#fff", padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 600 }}>OLDIN</span>
                        </div>
                      ) : <div style={{ height: 110, background: "rgba(0,0,0,0.05)" }} />}
                      {p.after_image_url ? (
                        <div style={{ position: "relative" }}>
                          <img src={p.after_image_url} alt="keyin" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                          <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(251,146,60,0.95)", color: "#7c2d12", padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>KEYIN</span>
                        </div>
                      ) : <div style={{ height: 110, background: "rgba(0,0,0,0.05)" }} />}
                    </div>
                  ) : (
                    <div style={{
                      height: 140, borderRadius: 10, marginBottom: 12,
                      background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(125,211,252,0.1))",
                      display: "grid", placeItems: "center", fontSize: 40,
                    }}>🏠</div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 15, marginBottom: 4 }}>{p.title}</h4>
                      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{p.description}</p>
                    </div>
                    <button onClick={() => removePortfolio(p.id)} style={{
                      background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 8,
                      padding: "6px 10px", fontSize: 12, cursor: "pointer", color: "#dc2626",
                    }}>🗑</button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </>
      ) : showList[tab]?.length === 0 ? (
        <GlassCard style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ fontSize: 18 }}>Arizalar yo'q</h3>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
            Hozircha bu bo'limda arizalar topilmadi
          </p>
        </GlassCard>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {showList[tab].map(o => {
            const s = STATUS[o.status] || STATUS.new;
            return (
              <GlassCard key={o.id} hoverable style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{o.title}</h3>
                      <span style={{
                        padding: "4px 12px", borderRadius: 50,
                        background: s.bg, color: s.color,
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                      }}>{s.label}</span>
                    </div>
                    {o.description && (
                      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>{o.description}</p>
                    )}
                    <div style={{ display: "flex", gap: 18, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
                      <span>📐 {o.area_sqm} m²</span>
                      <span>📍 {o.address || "—"}</span>
                      <span>📅 {new Date(o.created_at).toLocaleDateString("uz-UZ")}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                    <div style={{
                      fontSize: 22, fontWeight: 700, color: "#7c2d12",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {fmt(o.estimated_price)}<span style={{ fontSize: 12, fontWeight: 400, color: "#94a3b8", marginLeft: 4 }}>so'm</span>
                    </div>
                    {tab === "available" && (
                      <button onClick={() => take(o.id)} className="btn btn-accent" style={{ padding: "9px 18px", fontSize: 13 }}>
                        Qabul qilish
                      </button>
                    )}
                    {tab === "active" && (
                      <button onClick={() => complete(o.id)} className="btn btn-ghost" style={{ padding: "9px 18px", fontSize: 13 }}>
                        Tugatish
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FileField({ label, file, setFile }) {
  const preview = file ? URL.createObjectURL(file) : null;
  return (
    <div>
      <label>{label}</label>
      <label style={{
        display: "block", padding: 0, borderRadius: 12, cursor: "pointer",
        border: "1.5px dashed rgba(0,0,0,0.15)",
        background: "rgba(255,255,255,0.5)",
        overflow: "hidden",
        height: 130,
        position: "relative",
      }}>
        <input type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => setFile(e.target.files?.[0] || null)} />
        {preview ? (
          <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            display: "grid", placeItems: "center", height: "100%",
            color: "#94a3b8", fontSize: 13, gap: 4, textAlign: "center", padding: 12,
          }}>
            <div style={{ fontSize: 26 }}>📁</div>
            <div>Rasm tanlash</div>
          </div>
        )}
      </label>
      {file && (
        <button type="button" onClick={() => setFile(null)} style={{
          marginTop: 6, background: "none", border: "none", fontSize: 11,
          color: "#dc2626", cursor: "pointer", padding: 0,
        }}>✕ O'chirish</button>
      )}
    </div>
  );
}
