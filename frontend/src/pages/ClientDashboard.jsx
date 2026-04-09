import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import Tabs from "../components/Tabs";
import ReviewModal from "../components/ReviewModal";
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

export default function ClientDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [reviewFor, setReviewFor] = useState(null);
  const ordersRef = useRef([]);

  const load = () => {
    return api.orders().then(d => {
      setOrders(d || []);
      ordersRef.current = d || [];
    });
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  // Real-time: ariza statusi o'zgarganda toast
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`client-orders-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `client_id=eq.${user.id}` },
        (payload) => {
          const oldO = ordersRef.current.find(o => o.id === payload.new.id);
          const newO = payload.new;
          if (oldO && oldO.status !== newO.status) {
            const labels = {
              in_progress: "🔧 Ustangiz ishga kirishdi",
              completed:   "✅ Ishingiz tugallandi!",
              cancelled:   "❌ Ariza bekor qilindi",
            };
            toast.success(labels[newO.status] || "Ariza yangilandi");
          } else if (oldO && !oldO.master_id && newO.master_id) {
            toast.info("👤 Arizangizga usta tayinlandi");
          }
          load();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line
  }, [user]);

  const stats = {
    total: orders.length,
    active: orders.filter(o => ["new", "in_progress"].includes(o.status)).length,
    completed: orders.filter(o => o.status === "completed").length,
    totalSpent: orders
      .filter(o => o.status === "completed")
      .reduce((s, o) => s + Number(o.final_price || o.estimated_price || 0), 0),
  };

  const filtered = orders.filter(o => {
    if (tab === "all") return true;
    if (tab === "active") return ["new", "in_progress"].includes(o.status);
    if (tab === "completed") return o.status === "completed";
    return true;
  });

  return (
    <div className="container" style={{ padding: "32px clamp(16px, 3vw, 48px)" }}>
      <DashboardHeader
        user={user}
        subtitle="Mijoz kabineti — arizalaringizni boshqaring"
        actions={<Link to="/apply" className="btn btn-accent">+ Yangi ariza</Link>}
      />

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 28,
      }} className="grid-4">
        <StatCard icon="📋" label="Jami arizalar" value={stats.total} color="#fb923c" />
        <StatCard icon="⏳" label="Faol" value={stats.active} sub="jarayonda" color="#f59e0b" />
        <StatCard icon="✅" label="Tugallangan" value={stats.completed} color="#10b981" />
        <StatCard icon="💰" label="Jami sarflangan" value={fmt(stats.totalSpent)} sub="so'm" color="#7dd3fc" />
      </div>

      {/* TABS */}
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "all",       label: "Barchasi",    count: stats.total },
          { id: "active",    label: "Faol",        count: stats.active },
          { id: "completed", label: "Tugallangan", count: stats.completed },
        ]}
      />

      {/* ORDERS LIST */}
      {loading ? (
        <GlassCard style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yuklanmoqda...</GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>Arizalar yo'q</h3>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20 }}>
            Hozircha bu bo'limda arizalar topilmadi
          </p>
          <Link to="/apply" className="btn btn-accent">Birinchi arizani yaratish →</Link>
        </GlassCard>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {filtered.map(o => {
            const s = STATUS[o.status] || STATUS.new;
            return (
              <GlassCard key={o.id} hoverable style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>{o.title}</h3>
                      <span style={{
                        padding: "4px 12px", borderRadius: 50,
                        background: s.bg, color: s.color,
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                      }}>{s.label}</span>
                    </div>
                    {o.description && (
                      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>
                        {o.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 18, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
                      <span>📐 {o.area_sqm} m²</span>
                      <span>📍 {o.address || "Manzil kiritilmagan"}</span>
                      <span>📅 {new Date(o.created_at).toLocaleDateString("uz-UZ")}</span>
                      {o.master_id && <span>👤 Usta tayinlangan</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 180, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {o.final_price ? "Yakuniy narx" : "Taxminiy narx"}
                      </div>
                      <div style={{
                        fontSize: 22, fontWeight: 700, color: "#7c2d12",
                        fontFamily: "'Space Grotesk', sans-serif", marginTop: 2,
                      }}>
                        {fmt(o.final_price || o.estimated_price)}
                        <span style={{ fontSize: 12, fontWeight: 400, color: "#94a3b8", marginLeft: 4 }}>so'm</span>
                      </div>
                    </div>
                    {o.status === "completed" && o.master_id && (
                      <button
                        onClick={() => setReviewFor(o)}
                        className="btn"
                        style={{
                          padding: "8px 16px", fontSize: 12,
                          background: "rgba(251,146,60,0.15)",
                          color: "#c2410c",
                          border: "1px solid rgba(251,146,60,0.35)",
                          fontWeight: 600,
                        }}
                      >★ Sharh qoldirish</button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <ReviewModal order={reviewFor} onClose={() => setReviewFor(null)} onSaved={load} />
    </div>
  );
}
