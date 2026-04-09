import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

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
  const [search, setSearch] = useState("");
  const { add, items: cart } = useCart();
  const toast = useToast();

  useEffect(() => { api.materials().then(d => d?.length && setItems(d)).catch(() => {}); }, []);
  const cats = ["", ...new Set(items.map(i => i.category))];
  const filtered = items
    .filter(i => !cat || i.category === cat)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const inCart = (id) => cart.find(i => i.id === id);

  const handleAdd = (m) => {
    add(m, 1);
    toast.success(`${m.name} savatga qo'shildi`);
  };

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)" }}>
      <h1 className="page-title">Materiallar bozori</h1>
      <p className="page-sub">Narxlar va yetkazib beruvchilar — onlayn buyurtma</p>

      <GlassCard style={{ padding: 16, marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="input"
          placeholder="🔍 Material nomini qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c || "all"} onClick={() => setCat(c)} className="btn" style={{
              padding: "8px 16px", fontSize: 13,
              background: cat === c ? "#fb923c" : "rgba(255,255,255,0.6)",
              color: cat === c ? "#7c2d12" : "#64748b",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>{c || "Barchasi"}</button>
          ))}
        </div>
      </GlassCard>

      <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map(m => {
          const cartItem = inCart(m.id);
          return (
            <GlassCard key={m.id} hoverable style={{ padding: 20, display: "flex", flexDirection: "column" }}>
              <div style={{
                height: 120, borderRadius: 12, marginBottom: 14,
                background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(125,211,252,0.1))",
                display: "grid", placeItems: "center", fontSize: 42,
              }}>🧱</div>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{m.category}</div>
              <h4 style={{ fontSize: 15, marginTop: 4, marginBottom: 8, minHeight: 36 }}>{m.name}</h4>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#7c2d12", marginTop: "auto", fontFamily: "'Space Grotesk', sans-serif" }}>
                {Number(m.price).toLocaleString("uz-UZ")}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8", marginLeft: 4 }}>so'm/{m.unit}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, marginBottom: 12 }}>{m.supplier}</div>

              <button
                onClick={() => handleAdd(m)}
                className="btn btn-accent"
                style={{
                  padding: "10px 14px", fontSize: 13, width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {cartItem ? `✓ Savatda (${cartItem.qty})` : "+ Savatga qo'shish"}
              </button>
            </GlassCard>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>Material topilmadi</p>
      )}
    </div>
  );
}
