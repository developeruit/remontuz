import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { api } from "../api";

const stats = [
  { value: "2,400+", label: "Bajarilgan loyihalar" },
  { value: "850+", label: "Professional ustalar" },
  { value: "98%", label: "Mijozlar mamnuniyati" },
  { value: "50+", label: "Xizmat turlari" },
];

const FALLBACK_SERVICES = [
  { id: 1, icon: "🔨", name: "Ta'mirlash", description: "Kvartira va uy ta'mirlash", base_price_per_sqm: 280000 },
  { id: 2, icon: "🎨", name: "Dizayn", description: "Interer dizayn loyihalari", base_price_per_sqm: 350000 },
  { id: 3, icon: "⚡", name: "Montaj", description: "Elektr va santexnika ishlari", base_price_per_sqm: 150000 },
  { id: 4, icon: "🧱", name: "Qurilish", description: "Qurilish va rekonstruksiya", base_price_per_sqm: 420000 },
];

const FALLBACK_MASTERS = [
  { user_id: "demo-1", full_name: "Sardor Usmonov", specializations: "Interer dizayner", rating: 4.9, total_reviews: 128, _demo: true },
  { user_id: "demo-2", full_name: "Bobur Karimov", specializations: "Santexnik usta", rating: 4.8, total_reviews: 95, _demo: true },
  { user_id: "demo-3", full_name: "Aziz Rahmatov", specializations: "Elektrik usta", rating: 4.7, total_reviews: 73, _demo: true },
];

export default function Home() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [masters, setMasters] = useState(FALLBACK_MASTERS);
  const [area, setArea] = useState(45);
  const [serviceIdx, setServiceIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api.services().then(d => d?.length && setServices(d)).catch(() => {});
    api.masters().then(d => {
      const merged = [...(d || []), ...FALLBACK_MASTERS].slice(0, 3);
      setMasters(merged);
    }).catch(() => {});
  }, []);

  const current = services[serviceIdx];
  const total = current ? (area * current.base_price_per_sqm).toLocaleString("uz-UZ") : "0";

  return (
    <>
      {/* Single hero.png background covering HERO + STATS */}
      <div style={{
        position: "relative",
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(232,236,241,0.78) 0%, rgba(220,228,216,0.55) 50%, rgba(226,232,238,0.72) 100%)",
          pointerEvents: "none",
        }} />

      <section className="container grid-2" style={{
        position: "relative",
        padding: "48px 48px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(251,146,60,0.2)", borderRadius: 50,
            padding: "6px 16px", marginBottom: 24,
            border: "1px solid rgba(251,146,60,0.3)",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#c2410c" }}>Toshkent shahrida ishlaymiz</span>
          </div>

          <h1 style={{
            fontSize: 56, fontWeight: 700, lineHeight: 1.08, color: "#0f172a",
            letterSpacing: -2, margin: "0 0 20px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Uyingiz<br />
            <span style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>rejasi</span> bizda
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#64748b", maxWidth: 440, margin: "0 0 36px" }}>
            Kvartira va ofislarni ta'mirlash, dizayn qilish xizmatlarini bitta platformada jamlagan qulay veb-ilova. Ustani toping, narxni hisoblang.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/calculator" className="btn btn-accent">Narxni hisoblash →</Link>
            <Link to="/masters" className="btn btn-ghost">Ustalarni ko'rish</Link>
          </div>
        </div>

        {/* Calculator card */}
        <GlassCard style={{ padding: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>
            Ta'mirlash kalkulyatori
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
            {services.map((s, i) => (
              <button key={s.id} onClick={() => setServiceIdx(i)} style={{
                padding: "8px 16px", borderRadius: 50, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 6,
                background: serviceIdx === i ? "#fb923c" : "rgba(0,0,0,0.04)",
                color: serviceIdx === i ? "#7c2d12" : "#64748b",
                boxShadow: serviceIdx === i ? "0 2px 8px rgba(251,146,60,0.3)" : "none",
              }}>
                <span>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Maydon</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{area} m²</span>
            </div>
            <input type="range" min={10} max={200} value={area} onChange={e => setArea(+e.target.value)}
              style={{
                width: "100%", height: 6, borderRadius: 3,
                background: `linear-gradient(to right, #fb923c ${(area - 10) / 190 * 100}%, #e2e8f0 ${(area - 10) / 190 * 100}%)`,
                outline: "none", cursor: "pointer",
              }}
            />
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(249,115,22,0.08))",
            borderRadius: 14, padding: "18px 22px",
            border: "1px solid rgba(251,146,60,0.25)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Taxminiy narx</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#7c2d12", fontFamily: "'Space Grotesk', sans-serif" }}>
                {total} <span style={{ fontSize: 13, fontWeight: 400, color: "#64748b" }}>so'm</span>
              </div>
            </div>
            <Link to="/apply" className="btn btn-accent">Ariza topshirish</Link>
          </div>
        </GlassCard>
      </section>

      {/* STATS — same hero.png background continues */}
      <section className="container grid-4" style={{
        position: "relative",
        padding: "24px 48px 80px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
      }}>
        {stats.map((s, i) => (
          <GlassCard key={i} style={{ padding: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 6 }}>{s.label}</div>
          </GlassCard>
        ))}
      </section>
      </div>

      {/* SERVICES */}
      <section className="container" style={{ margin: "80px auto 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 className="page-title">Xizmatlar</h2>
            <p className="page-sub" style={{ marginBottom: 0 }}>Ta'mirlash, dizayn va montaj xizmatlari</p>
          </div>
          <Link to="/services" className="btn btn-ghost">Barchasini ko'rish →</Link>
        </div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {services.map((s) => (
            <GlassCard key={s.id} hoverable style={{ padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, rgba(251,146,60,0.2), rgba(251,146,60,0.05))",
                display: "grid", placeItems: "center", fontSize: 24, marginBottom: 18,
                border: "1px solid rgba(251,146,60,0.2)",
              }}>{s.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{s.description}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* TOP MASTERS */}
      <section className="container" style={{ margin: "0 auto 72px" }}>
        <h2 className="page-title">Top ustalar</h2>
        <p className="page-sub">Eng yuqori reytingli mutaxassislar</p>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {masters.map((m) => {
            const Wrap = m._demo
              ? ({ children }) => <div>{children}</div>
              : ({ children }) => <Link to={`/masters/${m.user_id}`} style={{ textDecoration: "none" }}>{children}</Link>;
            return (
            <Wrap key={m.user_id}>
              <GlassCard hoverable={!m._demo} style={{ padding: 28, display: "flex", gap: 18 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                  background: "linear-gradient(135deg, #fb923c, #f97316)",
                  display: "grid", placeItems: "center",
                  fontSize: 20, fontWeight: 700, color: "#7c2d12",
                }}>{m.full_name?.[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{m.full_name}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 8px" }}>{m.specializations}</div>
                  <span style={{ color: "#f59e0b", fontSize: 13 }}>★ {m.rating?.toFixed(1)}</span>
                  <span style={{ fontSize: 12, color: "#cbd5e1", marginLeft: 8 }}>({m.total_reviews} sharh)</span>
                </div>
              </GlassCard>
            </Wrap>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ margin: "0 auto 72px" }}>
        <GlassCard style={{
          padding: "56px 48px", textAlign: "center",
          background: "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(255,255,255,0.5))",
          border: "1px solid rgba(251,146,60,0.2)",
        }}>
          <h2 style={{ fontSize: 38, fontWeight: 700, color: "#0f172a", margin: "0 0 14px" }}>
            Loyihangizni hoziroq boshlang
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 500, margin: "0 auto 28px" }}>
            Bepul konsultatsiya oling va eng yaxshi ustalar bilan bog'laning
          </p>
          <Link to="/apply" className="btn btn-accent">Ariza qoldirish →</Link>
        </GlassCard>
      </section>
    </>
  );
}
