import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { api } from "../api";
import { useToast } from "../context/ToastContext";

export default function Apply() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service_id: null, title: "", description: "", area_sqm: 50, address: "",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.services().then(s => {
      setServices(s);
      if (s[0]) setForm(f => ({ ...f, service_id: s[0].id }));
    });
  }, []);

  const current = services.find(s => s.id === form.service_id);
  const estimated = current ? current.base_price_per_sqm * form.area_sqm : 0;

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles || []);
    setFiles(prev => [...prev, ...arr].slice(0, 5));
  };

  const removeFile = (idx) => setFiles(files.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Fayllarni yuklaymiz
      const attachments = [];
      for (const f of files) {
        const url = await api.uploadOrderFile(f);
        attachments.push(url);
      }
      await api.createOrder({
        ...form,
        estimated_price: estimated,
        attachments: attachments.length ? attachments : undefined,
      });
      toast.success("Ariza muvaffaqiyatli yuborildi!");
      setTimeout(() => navigate("/client"), 800);
    } catch (e) {
      toast.error("Xatolik: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)", maxWidth: 760 }}>
      <h1 className="page-title">Ariza topshirish</h1>
      <p className="page-sub">Loyihangiz haqida batafsil ma'lumot bering</p>

      <GlassCard style={{ padding: 36 }}>
        <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
          <div>
            <label>Xizmat turi</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {services.map(s => (
                <button key={s.id} type="button" onClick={() => setForm({ ...form, service_id: s.id })}
                  className="btn" style={{
                    background: form.service_id === s.id ? "#fb923c" : "rgba(0,0,0,0.04)",
                    color: form.service_id === s.id ? "#7c2d12" : "#64748b",
                  }}>
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>
          <div><label>Ariza sarlavhasi</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Masalan: 2 xonali kvartira ta'miri" required />
          </div>
          <div><label>Batafsil tavsif</label>
            <textarea className="input" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ishning tafsilotlari..." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2">
            <div><label>Maydon (m²)</label>
              <input className="input" type="number" value={form.area_sqm} onChange={e => setForm({ ...form, area_sqm: +e.target.value })} min={1} required />
            </div>
            <div><label>Manzil</label>
              <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Toshkent, ..." />
            </div>
          </div>

          {/* File attachments */}
          <div>
            <label>Rasm/fayl ilova qilish (maks 5 ta, ixtiyoriy)</label>
            <label style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, padding: 18, borderRadius: 14,
              border: "1.5px dashed rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.5)",
              cursor: "pointer", fontSize: 13, color: "#64748b",
            }}>
              <input type="file" accept="image/*" multiple style={{ display: "none" }}
                onChange={e => addFiles(e.target.files)} />
              📎 Fayl tanlash yoki shu yerga sudrab keling
            </label>
            {files.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, marginTop: 12 }}>
                {files.map((f, i) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "1" }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button type="button" onClick={() => removeFile(i)} style={{
                        position: "absolute", top: 4, right: 4,
                        width: 22, height: 22, borderRadius: "50%",
                        background: "rgba(0,0,0,0.7)", color: "#fff",
                        border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                      }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{
            padding: 18, borderRadius: 14,
            background: "rgba(251,146,60,0.12)",
            border: "1px solid rgba(251,146,60,0.25)",
          }}>
            <div style={{ fontSize: 13, color: "#64748b" }}>Taxminiy narx</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#7c2d12", fontFamily: "'Space Grotesk', sans-serif" }}>
              {estimated.toLocaleString("uz-UZ")} so'm
            </div>
          </div>

          <button type="submit" className="btn btn-accent" disabled={submitting}>
            {submitting ? "Yuborilmoqda..." : "Ariza yuborish →"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
