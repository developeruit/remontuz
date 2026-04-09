import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { api } from "../api";

const FALLBACK = [
  { id: 1, icon: "🔨", name: "Ta'mirlash", description: "Kvartira va uy ta'mirlash ishlari — devorlar, shiftlar, pol qoplamalari.", base_price_per_sqm: 280000 },
  { id: 2, icon: "🎨", name: "Dizayn", description: "Interer dizayn loyihalari, 3D vizualizatsiya, rang palitrasi.", base_price_per_sqm: 350000 },
  { id: 3, icon: "⚡", name: "Montaj", description: "Elektr va santexnika ishlari, kabel tortish, plitka qo'yish.", base_price_per_sqm: 150000 },
  { id: 4, icon: "🧱", name: "Qurilish", description: "Qurilish va rekonstruksiya, kengaytirish ishlari.", base_price_per_sqm: 420000 },
  { id: 5, icon: "🪟", name: "Deraza/Eshik", description: "Plastik va alumin deraza, eshik o'rnatish.", base_price_per_sqm: 180000 },
  { id: 6, icon: "🛋️", name: "Mebel", description: "Buyurtma asosida mebel tayyorlash va yig'ish.", base_price_per_sqm: 320000 },
];

export default function Services() {
  const [items, setItems] = useState(FALLBACK);
  useEffect(() => {
    api.services().then(real => {
      if (!real?.length) return;
      // Real + fallback'ni birlashtiramiz, nom bo'yicha takrorlanishni olib tashlaymiz
      const names = new Set(real.map(s => s.name));
      const merged = [...real, ...FALLBACK.filter(s => !names.has(s.name))];
      setItems(merged);
    }).catch(() => {});
  }, []);

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)" }}>
      <h1 className="page-title">Xizmatlar katalogi</h1>
      <p className="page-sub">Barcha ta'mirlash, dizayn va montaj ish turlari</p>
      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {items.map(s => (
          <GlassCard key={s.id} hoverable style={{ padding: 32 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 16,
              background: "linear-gradient(135deg, rgba(251,146,60,0.25), rgba(251,146,60,0.05))",
              display: "grid", placeItems: "center", fontSize: 28, marginBottom: 20,
            }}>{s.icon}</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.name}</h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 18 }}>{s.description}</p>
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "rgba(251,146,60,0.12)",
              border: "1px solid rgba(251,146,60,0.25)",
            }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>1 m² uchun boshlang'ich narx</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#7c2d12", fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.base_price_per_sqm.toLocaleString("uz-UZ")} so'm
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
