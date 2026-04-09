import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import Tabs from "../components/Tabs";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const STATUS = {
  new:         { label: "Yangi",         color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  in_progress: { label: "Jarayonda",     color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  completed:   { label: "Tugallangan",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  cancelled:   { label: "Bekor qilingan", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

const ROLE_BADGE = {
  admin:  { label: "Admin",  bg: "#fef3c7", color: "#92400e" },
  master: { label: "Usta",   bg: "rgba(251,146,60,0.25)", color: "#c2410c" },
  client: { label: "Mijoz",  bg: "#dbeafe", color: "#1e40af" },
};

const fmt = (n) => Number(n || 0).toLocaleString("uz-UZ");

export default function AdminDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, u, o] = await Promise.all([
        api.adminStats().catch(() => null),
        api.adminUsers().catch(() => []),
        api.orders().catch(() => []),
      ]);
      setStats(s);
      setUsers(u || []);
      setOrders(o || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const verify = async (uid) => {
    try {
      await api.verifyMaster(uid);
      toast.success("Usta tasdiqlandi");
      load();
    } catch (e) { toast.error("Xatolik: " + e.message); }
  };

  const filteredUsers = users
    .filter(u => roleFilter === "all" || u.role === roleFilter)
    .filter(u => !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((s, o) => s + Number(o.final_price || o.estimated_price || 0), 0);

  return (
    <div className="container" style={{ padding: "32px clamp(16px, 3vw, 48px)" }}>
      <DashboardHeader user={user} subtitle="Administrator paneli — to'liq tizim boshqaruvi" />

      {/* STATS */}
      {stats && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }} className="grid-4">
          <StatCard icon="👥" label="Foydalanuvchilar" value={stats.users} sub={`${stats.masters} usta · ${stats.clients} mijoz`} color="#7dd3fc" />
          <StatCard icon="📋" label="Arizalar" value={stats.orders} sub="jami" color="#3b82f6" />
          <StatCard icon="💰" label="Daromad" value={fmt(totalRevenue)} sub="so'm" color="#fb923c" />
          <StatCard icon="✓" label="Faol mijozlar" value={users.filter(u => u.role === "client").length} color="#10b981" />
        </div>
      )}

      {/* TABS */}
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Umumiy" },
          { id: "users",    label: "Foydalanuvchilar", count: users.length },
          { id: "orders",   label: "Arizalar",          count: orders.length },
        ]}
      />

      {loading ? (
        <GlassCard style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yuklanmoqda...</GlassCard>
      ) : tab === "overview" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="grid-2">
          {/* Recent users */}
          <GlassCard style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, margin: 0 }}>So'nggi foydalanuvchilar</h3>
              <button onClick={() => setTab("users")} style={{
                background: "none", border: "none", fontSize: 12, color: "#c2410c",
                cursor: "pointer", fontWeight: 600,
              }}>Barchasini ko'rish →</button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {users.slice(0, 5).map(u => {
                const r = ROLE_BADGE[u.role] || ROLE_BADGE.client;
                return (
                  <div key={u.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg, #fb923c, #f97316)",
                      display: "grid", placeItems: "center",
                      fontSize: 15, fontWeight: 700, color: "#7c2d12",
                    }}>{u.full_name?.[0]?.toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{u.full_name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700,
                      background: r.bg, color: r.color,
                    }}>{r.label}</span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Recent orders */}
          <GlassCard style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, margin: 0 }}>So'nggi arizalar</h3>
              <button onClick={() => setTab("orders")} style={{
                background: "none", border: "none", fontSize: 12, color: "#c2410c",
                cursor: "pointer", fontWeight: 600,
              }}>Barchasini ko'rish →</button>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {orders.slice(0, 5).map(o => {
                const s = STATUS[o.status] || STATUS.new;
                return (
                  <div key={o.id} style={{
                    padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{o.title}</div>
                      <span style={{
                        padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700,
                        background: s.bg, color: s.color,
                      }}>{s.label}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                      <span>{o.area_sqm} m²</span>
                      <b style={{ color: "#7c2d12" }}>{fmt(o.estimated_price)} so'm</b>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Arizalar yo'q</div>
              )}
            </div>
          </GlassCard>
        </div>
      ) : tab === "users" ? (
        <>
          <GlassCard style={{ padding: 16, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              className="input"
              placeholder="Ism yoki email bo'yicha qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 240 }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "all",    label: "Hammasi" },
                { id: "client", label: "Mijozlar" },
                { id: "master", label: "Ustalar" },
                { id: "admin",  label: "Adminlar" },
              ].map(r => (
                <button key={r.id} onClick={() => setRoleFilter(r.id)} className="btn" style={{
                  padding: "8px 16px", fontSize: 12,
                  background: roleFilter === r.id ? "#fb923c" : "rgba(255,255,255,0.6)",
                  color: roleFilter === r.id ? "#7c2d12" : "#64748b",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>{r.label}</button>
              ))}
            </div>
          </GlassCard>

          <GlassCard style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.025)", textAlign: "left" }}>
                    <th style={{ padding: "16px 20px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Foydalanuvchi</th>
                    <th style={{ padding: "16px 20px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Email</th>
                    <th style={{ padding: "16px 20px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Rol</th>
                    <th style={{ padding: "16px 20px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Sana</th>
                    <th style={{ padding: "16px 20px", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const r = ROLE_BADGE[u.role] || ROLE_BADGE.client;
                    return (
                      <tr key={u.id} style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 12,
                              background: "linear-gradient(135deg, #fb923c, #f97316)",
                              display: "grid", placeItems: "center",
                              fontSize: 14, fontWeight: 700, color: "#7c2d12",
                            }}>{u.full_name?.[0]?.toUpperCase()}</div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{u.full_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{u.email}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{
                            padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700,
                            background: r.bg, color: r.color,
                          }}>{r.label}</span>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "#94a3b8" }}>
                          {u.created_at && new Date(u.created_at).toLocaleDateString("uz-UZ")}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          {u.role === "master" && (
                            <button onClick={() => verify(u.id)} className="btn" style={{
                              padding: "6px 14px", fontSize: 11,
                              background: "rgba(251,146,60,0.2)",
                              color: "#c2410c",
                              border: "1px solid rgba(251,146,60,0.4)",
                              fontWeight: 600,
                            }}>Tasdiqlash</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                      Foydalanuvchilar topilmadi
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {orders.length === 0 ? (
            <GlassCard style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <h3 style={{ fontSize: 18 }}>Arizalar yo'q</h3>
            </GlassCard>
          ) : orders.map(o => {
            const s = STATUS[o.status] || STATUS.new;
            return (
              <GlassCard key={o.id} hoverable style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <h4 style={{ fontSize: 16, margin: 0 }}>{o.title}</h4>
                      <span style={{
                        padding: "3px 10px", borderRadius: 50,
                        background: s.bg, color: s.color,
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                      }}>{s.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
                      <span>📐 {o.area_sqm} m²</span>
                      <span>📅 {new Date(o.created_at).toLocaleDateString("uz-UZ")}</span>
                      {o.master_id ? <span>👤 Usta tayinlangan</span> : <span>⏳ Usta kutmoqda</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#7c2d12", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {fmt(o.estimated_price)} <span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>so'm</span>
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
