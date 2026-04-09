import GlassCard from "./GlassCard";

export default function StatCard({ icon, label, value, sub, color = "#fb923c" }) {
  return (
    <GlassCard style={{ padding: 24 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `linear-gradient(135deg, ${color}40, ${color}15)`,
        display: "grid", placeItems: "center",
        fontSize: 20, marginBottom: 14,
        border: `1px solid ${color}50`,
      }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: "#0f172a",
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: -1, marginTop: 4,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
    </GlassCard>
  );
}
