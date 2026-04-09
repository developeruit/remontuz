import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { api } from "../api";

const FALLBACK = [
  { id: 1, name: "Akril bo'yoq", category: "bo'yoq", unit: "kg", price: 45000, supplier: "Bau Market" },
  { id: 2, name: "Keramik plitka 60x60", category: "plitka", unit: "m²", price: 120000, supplier: "TileHouse" },
  { id: 3, name: "Laminat 32-klass", category: "pol", unit: "m²", price: 95000, supplier: "Floor.uz" },
  { id: 4, name: "Gipsokarton list", category: "devor", unit: "dona", price: 48000, supplier: "BuildMart" },
  { id: 5, name: "Sement M400", category: "quruq", unit: "kg", price: 1800, supplier: "StroyUz" },
  { id: 6, name: "Elektr kabel 2.5mm", category: "elektr", unit: "m", price: 8500, supplier: "ElektroShop" },
  { id: 7, name: "Dekorativ shtukaturka", category: "bo'yoq", unit: "kg", price: 62000, supplier: "Bau Market" },
  { id: 8, name: "Granit plitka", category: "plitka", unit: "m²", price: 180000, supplier: "TileHouse" },
];

export default function Materials() {
  const [items, setItems] = useState(FALLBACK);
  const [cat, setCat] = useState("");

  useEffect(() => { api.materials().then(d => d?.length && setItems(d)).catch(() => {}); }, []);
  const cats = ["", ...new Set(items.map(i => i.category))];
  const filtered = cat ? items.filter(i => i.category === cat) : items;

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)" }}>
      <h1 className="page-title">Materiallar bozori</h1>
      <p className="page-sub">Narxlar va yetkazib beruvchilar</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c || "all"} onClick={() => setCat(c)} className="btn" style={{
            padding: "8px 16px", fontSize: 13,
            background: cat === c ? "#fb923c" : "rgba(255,255,255,0.6)",
            color: cat === c ? "#7c2d12" : "#64748b",
            border: "1px solid rgba(0,0,0,0.06)",
          }}>{c || "Barchasi"}</button>
        ))}
      </div>

      <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map(m => (
          <GlassCard key={m.id} hoverable style={{ padding: 22 }}>
            <div style={{
              height: 120, borderRadius: 12, marginBottom: 12,
              background: "linear-gradient(135deg, rgba(251,146,60,0.1), rgba(125,211,252,0.1))",
              display: "grid", placeItems: "center", fontSize: 32,
            }}>🧱</div>
            <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{m.category}</div>
            <h4 style={{ fontSize: 15, marginTop: 4 }}>{m.name}</h4>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#7c2d12", marginTop: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
              {m.price.toLocaleString("uz-UZ")} <span style={{ fontSize: 12, fontWeight: 400, color: "#94a3b8" }}>so'm/{m.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{m.supplier}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
