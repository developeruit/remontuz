import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { api } from "../api";

export default function MasterProfile() {
  const { id } = useParams();
  const [master, setMaster] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    api.master(id).then(setMaster).catch(() => {});
    api.masterReviews(id).then(setReviews).catch(() => {});
    api.portfolio(id).then(setPortfolio).catch(() => {});
  }, [id]);

  if (!master) return <div className="container" style={{ padding: 48 }}>Yuklanmoqda...</div>;

  return (
    <div className="container" style={{ padding: "48px 48px" }}>
      <GlassCard style={{ padding: 40, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            width: 120, height: 120, borderRadius: 28,
            background: "linear-gradient(135deg, #fb923c, #f97316)",
            display: "grid", placeItems: "center",
            fontSize: 48, fontWeight: 700, color: "#7c2d12",
          }}>{master.full_name?.[0]}</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h1 style={{ fontSize: 32, marginBottom: 6 }}>{master.full_name}</h1>
            <p style={{ fontSize: 15, color: "#64748b", marginBottom: 12 }}>{master.specializations}</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14, color: "#475569" }}>
              <span>★ <b>{master.rating?.toFixed(1)}</b> ({master.total_reviews} sharh)</span>
              <span>{master.experience_years} yil tajriba</span>
              <span>{master.city}</span>
              {master.is_verified && <span style={{ color: "#c2410c", fontWeight: 600 }}>✓ Tasdiqlangan</span>}
            </div>
            <div style={{ marginTop: 16, fontSize: 16 }}>
              Soatlik narx: <b style={{ fontSize: 20, color: "#7c2d12" }}>{master.hourly_rate?.toLocaleString("uz-UZ")} so'm</b>
            </div>
          </div>
          <Link to="/apply" className="btn btn-accent">Ariza qoldirish</Link>
        </div>
        {master.bio && (
          <p style={{ marginTop: 24, fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{master.bio}</p>
        )}
      </GlassCard>

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Portfolio</h2>
      {portfolio.length === 0 ? (
        <GlassCard style={{ padding: 24, marginBottom: 32, color: "#94a3b8" }}>Hozircha portfolio yo'q</GlassCard>
      ) : (
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {portfolio.map(p => (
            <GlassCard key={p.id} hoverable style={{ padding: 18 }}>
              {(p.before_image_url || p.after_image_url) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 12, borderRadius: 10, overflow: "hidden" }}>
                  {p.before_image_url ? (
                    <div style={{ position: "relative" }}>
                      <img src={p.before_image_url} alt="oldin" style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                      <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.65)", color: "#fff", padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 600 }}>OLDIN</span>
                    </div>
                  ) : <div style={{ height: 120, background: "rgba(0,0,0,0.05)" }} />}
                  {p.after_image_url ? (
                    <div style={{ position: "relative" }}>
                      <img src={p.after_image_url} alt="keyin" style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                      <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(251,146,60,0.95)", color: "#7c2d12", padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>KEYIN</span>
                    </div>
                  ) : <div style={{ height: 120, background: "rgba(0,0,0,0.05)" }} />}
                </div>
              )}
              <h4 style={{ fontSize: 16 }}>{p.title}</h4>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{p.description}</p>
            </GlassCard>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Sharhlar</h2>
      {reviews.length === 0 ? (
        <GlassCard style={{ padding: 24, color: "#94a3b8" }}>Hozircha sharhlar yo'q</GlassCard>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {reviews.map(r => (
            <GlassCard key={r.id} style={{ padding: 20 }}>
              <div style={{ color: "#f59e0b", marginBottom: 6 }}>{"★".repeat(r.rating)}</div>
              <p style={{ fontSize: 14, color: "#475569" }}>{r.comment}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
