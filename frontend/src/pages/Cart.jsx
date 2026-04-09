import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api";

const fmt = (n) => Number(n || 0).toLocaleString("uz-UZ");

export default function Cart() {
  const { items, setQty, remove, clear, total, count } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const checkout = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Avval tizimga kiring");
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Savat bo'sh");
      return;
    }
    setSubmitting(true);
    try {
      await api.createMaterialOrder({
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          unit: i.unit,
          qty: i.qty,
          supplier: i.supplier,
        })),
        total_price: total,
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
      });
      clear();
      toast.success("Buyurtma qabul qilindi! Tez orada bog'lanamiz");
      setTimeout(() => navigate("/client"), 1200);
    } catch (e) {
      toast.error("Xatolik: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "60px clamp(16px, 3vw, 48px)", maxWidth: 700 }}>
        <GlassCard style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Savat bo'sh</h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
            Materiallar bozoridan sizga kerakli mahsulotlarni tanlang
          </p>
          <Link to="/materials" className="btn btn-accent">Materiallarni ko'rish →</Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)" }}>
      <h1 className="page-title">Savat</h1>
      <p className="page-sub">{count} ta mahsulot • Umumiy: {fmt(total)} so'm</p>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }} className="grid-2">
        {/* LEFT: items list */}
        <div style={{ display: "grid", gap: 12 }}>
          {items.map(item => (
            <GlassCard key={item.id} style={{ padding: 18 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(125,211,252,0.1))",
                  display: "grid", placeItems: "center", fontSize: 28,
                }}>🧱</div>

                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>{item.category}</div>
                  <h4 style={{ fontSize: 15, marginTop: 2 }}>{item.name}</h4>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {fmt(item.price)} so'm/{item.unit} · {item.supplier}
                  </div>
                </div>

                {/* Quantity */}
                <div style={{ display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.6)", borderRadius: 50, padding: 4,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <button onClick={() => setQty(item.id, item.qty - 1)} style={{
                    width: 30, height: 30, borderRadius: "50%", border: "none",
                    background: "rgba(0,0,0,0.04)", cursor: "pointer", fontSize: 16, fontWeight: 700,
                  }}>−</button>
                  <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{item.qty}</span>
                  <button onClick={() => setQty(item.id, item.qty + 1)} style={{
                    width: 30, height: 30, borderRadius: "50%", border: "none",
                    background: "#fb923c", color: "#7c2d12", cursor: "pointer", fontSize: 16, fontWeight: 700,
                  }}>+</button>
                </div>

                <div style={{ textAlign: "right", minWidth: 110 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#7c2d12", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {fmt(item.price * item.qty)}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>so'm</div>
                  <button onClick={() => remove(item.id)} style={{
                    marginTop: 4, background: "none", border: "none", color: "#dc2626",
                    fontSize: 11, cursor: "pointer", padding: 0,
                  }}>✕ O'chirish</button>
                </div>
              </div>
            </GlassCard>
          ))}

          <button onClick={clear} className="btn btn-ghost" style={{ justifySelf: "start", fontSize: 12 }}>
            Savatni tozalash
          </button>
        </div>

        {/* RIGHT: checkout form */}
        <GlassCard style={{
          padding: 24, position: "sticky", top: 100, height: "fit-content",
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Buyurtma berish</h3>

          <form onSubmit={checkout} style={{ display: "grid", gap: 12 }}>
            <div><label>To'liq ism</label>
              <input className="input" required value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div><label>Telefon</label>
              <input className="input" required value={form.phone} placeholder="+998..."
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div><label>Yetkazish manzili</label>
              <textarea className="input" rows={2} required value={form.address}
                placeholder="Toshkent sh., Chilonzor tumani..."
                onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div style={{
              marginTop: 6, padding: "14px 18px", borderRadius: 14,
              background: "linear-gradient(135deg, rgba(251,146,60,0.18), rgba(251,146,60,0.06))",
              border: "1px solid rgba(251,146,60,0.3)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 4 }}>
                <span>Mahsulotlar ({count})</span>
                <span>{fmt(total)} so'm</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 10 }}>
                <span>Yetkazish</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>Bepul</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: "1px dashed rgba(0,0,0,0.12)" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Jami</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#7c2d12", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {fmt(total)} <span style={{ fontSize: 11, fontWeight: 400 }}>so'm</span>
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-accent" disabled={submitting}>
              {submitting ? "Yuborilmoqda..." : "Buyurtma berish →"}
            </button>

            {!user && (
              <div style={{ fontSize: 12, color: "#dc2626", textAlign: "center" }}>
                Buyurtma berish uchun <Link to="/login" style={{ color: "#c2410c", fontWeight: 600 }}>tizimga kiring</Link>
              </div>
            )}
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
