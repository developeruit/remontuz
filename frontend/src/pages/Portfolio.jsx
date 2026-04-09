import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { api } from "../api";

export default function Portfolio() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.portfolio().then(setItems).catch(() => setItems([])); }, []);

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)" }}>
      <h1 className="page-title">Loyihalar galereyasi</h1>
      <p className="page-sub">Bajarilgan ishlar namunalari</p>
      {items.length === 0 ? (
        <GlassCard style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
          Hozircha portfolio qo'shilmagan. Ustalar kabinetidan "oldin/keyin" rasmlarni qo'shishingiz mumkin.
        </GlassCard>
      ) : (
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {items.map(p => (
            <GlassCard key={p.id} hoverable style={{ padding: 18 }}>
              {(p.before_image_url || p.after_image_url) ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 14, borderRadius: 12, overflow: "hidden" }}>
                  {p.before_image_url ? (
                    <div style={{ position: "relative" }}>
                      <img src={p.before_image_url} alt="oldin" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                      <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.65)", color: "#fff", padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>OLDIN</span>
                    </div>
                  ) : <div style={{ height: 140, background: "rgba(0,0,0,0.05)" }} />}
                  {p.after_image_url ? (
                    <div style={{ position: "relative" }}>
                      <img src={p.after_image_url} alt="keyin" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                      <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(251,146,60,0.95)", color: "#7c2d12", padding: "3px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>KEYIN</span>
                    </div>
                  ) : <div style={{ height: 140, background: "rgba(0,0,0,0.05)" }} />}
                </div>
              ) : (
                <div style={{
                  height: 160, borderRadius: 12, marginBottom: 14,
                  background: "linear-gradient(135deg, #dce4d8, #e2e8ee)",
                  display: "grid", placeItems: "center", color: "#94a3b8", fontSize: 28,
                }}>🏠</div>
              )}
              <h4 style={{ fontSize: 16, marginBottom: 6 }}>{p.title}</h4>
              <p style={{ fontSize: 13, color: "#64748b" }}>{p.description}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
