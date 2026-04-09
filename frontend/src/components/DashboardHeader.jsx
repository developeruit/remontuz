import GlassCard from "./GlassCard";

const ROLE_META = {
  client: { label: "Mijoz", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  master: { label: "Usta", color: "#c2410c", bg: "rgba(251,146,60,0.25)" },
  admin:  { label: "Administrator", color: "#92400e", bg: "#fef3c7" },
};

export default function DashboardHeader({ user, subtitle, actions }) {
  const role = ROLE_META[user?.role] || ROLE_META.client;
  const initial = user?.full_name?.[0]?.toUpperCase() || "?";

  return (
    <GlassCard style={{
      padding: 32,
      marginBottom: 24,
      display: "flex",
      alignItems: "center",
      gap: 24,
      flexWrap: "wrap",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, flexShrink: 0,
        background: "linear-gradient(135deg, #fb923c, #f97316)",
        display: "grid", placeItems: "center",
        fontSize: 30, fontWeight: 700, color: "#7c2d12",
        boxShadow: "0 4px 16px rgba(251,146,60,0.35)",
      }}>{initial}</div>

      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Salom, {user?.full_name?.split(" ")[0]} 👋
          </h1>
          <span style={{
            padding: "4px 12px", borderRadius: 50,
            background: role.bg, color: role.color,
            fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
          }}>{role.label}</span>
        </div>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          {subtitle || user?.email}
        </p>
      </div>

      {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>}
    </GlassCard>
  );
}
