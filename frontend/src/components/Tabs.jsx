export default function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "inline-flex",
      gap: 4,
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(20px)",
      borderRadius: 50,
      padding: 5,
      border: "1px solid rgba(255,255,255,0.6)",
      marginBottom: 24,
      flexWrap: "wrap",
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            padding: "9px 20px",
            borderRadius: 50,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: isActive ? "#fb923c" : "transparent",
            color: isActive ? "#7c2d12" : "#64748b",
            boxShadow: isActive ? "0 2px 8px rgba(251,146,60,0.35)" : "none",
            transition: "all 0.2s",
          }}>
            {t.label}
            {typeof t.count === "number" && (
              <span style={{
                padding: "1px 8px",
                borderRadius: 50,
                background: isActive ? "rgba(26,46,5,0.15)" : "rgba(100,116,139,0.15)",
                fontSize: 11,
                fontWeight: 700,
              }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
