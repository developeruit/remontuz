import { useEffect, useState } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";

export default function ReviewModal({ order, onClose, onSaved }) {
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!order) return;
    api.getOrderReview(order.id).then(r => {
      if (r) {
        setExisting(r);
        setRating(r.rating);
        setComment(r.comment || "");
      }
    });
  }, [order]);

  if (!order) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (existing) { onClose(); return; }
    if (!order.master_id) {
      toast.error("Bu arizaga usta tayinlanmagan");
      return;
    }
    setSaving(true);
    try {
      await api.addReview({
        master_id: order.master_id,
        order_id: order.id,
        rating,
        comment,
      });
      toast.success("Sharhingiz uchun rahmat!");
      onSaved?.();
      onClose();
    } catch (e) {
      toast.error("Xatolik: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)",
      display: "grid", placeItems: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: 20,
        padding: 32,
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>
            {existing ? "Sizning sharhingiz" : "Sharh qoldiring"}
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8",
          }}>✕</button>
        </div>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>{order.title}</p>

        <form onSubmit={submit}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>Baho bering</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button"
                  disabled={!!existing}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  style={{
                    background: "none", border: "none",
                    cursor: existing ? "default" : "pointer",
                    fontSize: 40,
                    color: (hover || rating) >= n ? "#f59e0b" : "#e2e8f0",
                    transition: "color 0.15s, transform 0.15s",
                    transform: hover === n ? "scale(1.15)" : "scale(1)",
                    padding: 0,
                  }}>★</button>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 8, fontWeight: 500 }}>
              {["", "Yomon", "Qoniqarli", "Yaxshi", "Juda yaxshi", "Ajoyib"][rating]}
            </div>
          </div>

          <label>Izoh (ixtiyoriy)</label>
          <textarea
            className="input"
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Xizmat haqida fikringizni yozing..."
            disabled={!!existing}
            style={{ marginBottom: 20, resize: "vertical" }}
          />

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">
              {existing ? "Yopish" : "Bekor qilish"}
            </button>
            {!existing && (
              <button type="submit" className="btn btn-accent" disabled={saving}>
                {saving ? "Yuborilmoqda..." : "Sharhni yuborish"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
