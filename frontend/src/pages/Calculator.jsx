import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";

// Base price per m² (UZS)
const SERVICES = [
  { id: "remont",  icon: "🔨", name: "Ta'mirlash",  price: 280000 },
  { id: "dizayn",  icon: "🎨", name: "Dizayn",       price: 350000 },
  { id: "montaj",  icon: "⚡", name: "Montaj",       price: 150000 },
  { id: "qurilish",icon: "🧱", name: "Qurilish",     price: 420000 },
];

const OBJECTS = [
  { id: "kvartira", icon: "🏢", name: "Kvartira",  mult: 1.0 },
  { id: "uy",       icon: "🏠", name: "Xususiy uy", mult: 1.15 },
  { id: "ofis",     icon: "🏬", name: "Ofis",       mult: 1.1 },
  { id: "dokon",    icon: "🏪", name: "Do'kon",     mult: 1.05 },
];

const QUALITY = [
  { id: "econom",   name: "Ekonom",    desc: "Arzon materiallar, asosiy ishlar", mult: 0.75 },
  { id: "standart", name: "Standart",  desc: "O'rta sifat, eng ko'p tanlov",     mult: 1.0 },
  { id: "premium",  name: "Premium",   desc: "Yuqori sifat materiallar",          mult: 1.4 },
  { id: "lux",      name: "Lyuks",     desc: "Elit materiallar, mukammal ish",   mult: 1.9 },
];

const EXTRAS = [
  { id: "plumbing",  icon: "🚿", name: "Santexnika",      price: 3500000 },
  { id: "electric",  icon: "💡", name: "Elektrika",       price: 4200000 },
  { id: "tiling",    icon: "🧩", name: "Plitka qo'yish",  price: 2800000 },
  { id: "painting",  icon: "🎨", name: "Devor bo'yash",   price: 1800000 },
  { id: "ceiling",   icon: "☁️", name: "Osma shift",      price: 2200000 },
  { id: "flooring",  icon: "🪵", name: "Pol qoplama",     price: 2600000 },
  { id: "doors",     icon: "🚪", name: "Eshik o'rnatish", price: 1500000 },
  { id: "windows",   icon: "🪟", name: "Deraza almashtirish", price: 3200000 },
];

const URGENCY = [
  { id: "normal", name: "Oddiy (30+ kun)", mult: 1.0 },
  { id: "fast",   name: "Tez (15-30 kun)", mult: 1.15 },
  { id: "urgent", name: "Shoshilinch (<15 kun)", mult: 1.35 },
];

const ROOM_PRICE = 1800000; // per extra room
const CEILING_MULT = { 2.7: 1.0, 3.0: 1.08, 3.3: 1.15, 3.6: 1.22 };

const STEPS = ["Xizmat turi", "Obyekt", "O'lchamlar", "Sifat darajasi", "Qo'shimcha ishlar", "Muddat", "Natija"];

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    service: "remont",
    object: "kvartira",
    area: 60,
    rooms: 2,
    ceiling: 2.7,
    quality: "standart",
    extras: [],
    urgency: "normal",
  });

  const set = (k, v) => setState(s => ({ ...s, [k]: v }));
  const toggleExtra = (id) =>
    setState(s => ({
      ...s,
      extras: s.extras.includes(id) ? s.extras.filter(x => x !== id) : [...s.extras, id],
    }));

  const calc = useMemo(() => {
    const svc = SERVICES.find(s => s.id === state.service);
    const obj = OBJECTS.find(o => o.id === state.object);
    const q = QUALITY.find(q => q.id === state.quality);
    const u = URGENCY.find(u => u.id === state.urgency);
    const ceilingMult = CEILING_MULT[state.ceiling] || 1.0;

    const base = svc.price * state.area * obj.mult * q.mult * ceilingMult;
    const roomsPrice = Math.max(0, state.rooms - 1) * ROOM_PRICE * q.mult;
    const extrasPrice = EXTRAS
      .filter(e => state.extras.includes(e.id))
      .reduce((sum, e) => sum + e.price * q.mult, 0);

    const subtotal = base + roomsPrice + extrasPrice;
    const total = subtotal * u.mult;
    const daysMin = Math.ceil((state.area / 10) * (state.quality === "lux" ? 3 : state.quality === "premium" ? 2.2 : 1.6));
    const daysMax = Math.ceil(daysMin * 1.4);

    return {
      svc, obj, q, u,
      base: Math.round(base),
      roomsPrice: Math.round(roomsPrice),
      extrasPrice: Math.round(extrasPrice),
      total: Math.round(total),
      daysMin, daysMax,
    };
  }, [state]);

  const fmt = (n) => n.toLocaleString("uz-UZ");

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)", maxWidth: 960 }}>
      <h1 className="page-title">Ta'mirlash kalkulyatori</h1>
      <p className="page-sub">Bir nechta savolga javob bering — taxminiy narxni oling</p>

      {/* Steps indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: "8px 14px", borderRadius: 50, cursor: "pointer",
            fontSize: 12, fontWeight: 600, fontFamily: "inherit",
            background: step === i ? "#fb923c" : i < step ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.6)",
            color: step === i ? "#7c2d12" : i < step ? "#c2410c" : "#94a3b8",
            border: "1px solid rgba(0,0,0,0.05)",
          }}>{i + 1}. {s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }} className="grid-2">
        {/* LEFT: step content */}
        <GlassCard style={{ padding: 32 }}>
          {step === 0 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Qanday xizmat kerak?</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Ish turini tanlang</p>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {SERVICES.map(s => (
                  <button key={s.id} onClick={() => set("service", s.id)} style={{
                    padding: "20px 18px", borderRadius: 14, border: "1px solid",
                    borderColor: state.service === s.id ? "#fb923c" : "rgba(0,0,0,0.08)",
                    background: state.service === s.id ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.5)",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{fmt(s.price)} so'm/m²</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Obyekt turi</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Qayerda ishlaymiz?</p>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {OBJECTS.map(o => (
                  <button key={o.id} onClick={() => set("object", o.id)} style={{
                    padding: "20px 18px", borderRadius: 14,
                    border: "1px solid", borderColor: state.object === o.id ? "#fb923c" : "rgba(0,0,0,0.08)",
                    background: state.object === o.id ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.5)",
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{o.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{o.name}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>O'lchamlar</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Maydon, xonalar soni va shift balandligi</p>

              <label>Umumiy maydon: <b>{state.area} m²</b></label>
              <input type="range" min={10} max={500} value={state.area}
                onChange={e => set("area", +e.target.value)}
                style={{
                  width: "100%", height: 8, borderRadius: 4, marginBottom: 20,
                  background: `linear-gradient(to right, #fb923c ${(state.area - 10) / 490 * 100}%, #e2e8f0 ${(state.area - 10) / 490 * 100}%)`,
                  outline: "none", cursor: "pointer",
                }}
              />

              <label>Xonalar soni: <b>{state.rooms}</b></label>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => set("rooms", n)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                    border: "1px solid", borderColor: state.rooms === n ? "#fb923c" : "rgba(0,0,0,0.08)",
                    background: state.rooms === n ? "#fb923c" : "rgba(255,255,255,0.6)",
                    color: state.rooms === n ? "#7c2d12" : "#64748b",
                    fontWeight: 600, fontSize: 14, fontFamily: "inherit",
                  }}>{n}{n === 6 ? "+" : ""}</button>
                ))}
              </div>

              <label>Shift balandligi</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[2.7, 3.0, 3.3, 3.6].map(h => (
                  <button key={h} onClick={() => set("ceiling", h)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                    border: "1px solid", borderColor: state.ceiling === h ? "#fb923c" : "rgba(0,0,0,0.08)",
                    background: state.ceiling === h ? "#fb923c" : "rgba(255,255,255,0.6)",
                    color: state.ceiling === h ? "#7c2d12" : "#64748b",
                    fontWeight: 600, fontSize: 14, fontFamily: "inherit",
                  }}>{h} m</button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Sifat darajasi</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Material va ishlarning sifati</p>
              <div style={{ display: "grid", gap: 10 }}>
                {QUALITY.map(q => (
                  <button key={q.id} onClick={() => set("quality", q.id)} style={{
                    padding: "18px 22px", borderRadius: 14, cursor: "pointer",
                    border: "1px solid", borderColor: state.quality === q.id ? "#fb923c" : "rgba(0,0,0,0.08)",
                    background: state.quality === q.id ? "rgba(251,146,60,0.18)" : "rgba(255,255,255,0.5)",
                    textAlign: "left", fontFamily: "inherit",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                  }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{q.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{q.desc}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#c2410c" }}>
                      {q.mult > 1 ? `+${Math.round((q.mult - 1) * 100)}%` : q.mult < 1 ? `-${Math.round((1 - q.mult) * 100)}%` : "baza"}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Qo'shimcha ishlar</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Bir nechtasini tanlashingiz mumkin</p>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {EXTRAS.map(e => {
                  const active = state.extras.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleExtra(e.id)} style={{
                      padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                      border: "1px solid", borderColor: active ? "#fb923c" : "rgba(0,0,0,0.08)",
                      background: active ? "rgba(251,146,60,0.18)" : "rgba(255,255,255,0.5)",
                      textAlign: "left", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: 22 }}>{e.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>+{fmt(e.price)} so'm</div>
                      </div>
                      {active && <span style={{ color: "#c2410c", fontSize: 16 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Bajarish muddati</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Qancha tez kerak?</p>
              <div style={{ display: "grid", gap: 10 }}>
                {URGENCY.map(u => (
                  <button key={u.id} onClick={() => set("urgency", u.id)} style={{
                    padding: "18px 22px", borderRadius: 14, cursor: "pointer",
                    border: "1px solid", borderColor: state.urgency === u.id ? "#fb923c" : "rgba(0,0,0,0.08)",
                    background: state.urgency === u.id ? "rgba(251,146,60,0.18)" : "rgba(255,255,255,0.5)",
                    textAlign: "left", fontFamily: "inherit",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{u.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#c2410c" }}>
                      {u.mult > 1 ? `+${Math.round((u.mult - 1) * 100)}%` : "baza"}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Yakuniy taxmin</h3>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Kiritilgan ma'lumotlar asosida hisoblangan</p>

              <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                {[
                  ["Xizmat", calc.svc.name],
                  ["Obyekt", calc.obj.name],
                  ["Maydon", `${state.area} m²`],
                  ["Xonalar", state.rooms],
                  ["Shift", `${state.ceiling} m`],
                  ["Sifat", calc.q.name],
                  ["Muddat", calc.u.name],
                  ["Qo'shimcha", state.extras.length ? `${state.extras.length} ta ish` : "yo'q"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px dashed rgba(0,0,0,0.06)" }}>
                    <span style={{ color: "#64748b" }}>{k}</span>
                    <b style={{ color: "#0f172a" }}>{v}</b>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Tahminiy bajarish muddati</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>
                {calc.daysMin}–{calc.daysMax} kun
              </div>

              <Link to="/apply" className="btn btn-accent" style={{ display: "inline-block" }}>
                Ariza topshirish →
              </Link>
            </>
          )}

          {/* Nav buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 }}>
            <button
              className="btn btn-ghost"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{ opacity: step === 0 ? 0.4 : 1 }}
            >← Orqaga</button>
            {step < STEPS.length - 1 && (
              <button className="btn btn-accent" onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}>
                Keyingi →
              </button>
            )}
          </div>
        </GlassCard>

        {/* RIGHT: live price */}
        <GlassCard style={{
          padding: 28,
          position: "sticky", top: 100, height: "fit-content",
          background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(255,255,255,0.6))",
          border: "1px solid rgba(251,146,60,0.3)",
        }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
            Jonli narx
          </div>
          <div style={{
            fontSize: 32, fontWeight: 700, color: "#7c2d12",
            fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, marginBottom: 6,
          }}>
            {fmt(calc.total)}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>so'm (taxminiy)</div>

          <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
            <Row k="Asosiy ish" v={`${fmt(calc.base)} so'm`} />
            {calc.roomsPrice > 0 && <Row k="Qo'shimcha xonalar" v={`+${fmt(calc.roomsPrice)}`} />}
            {calc.extrasPrice > 0 && <Row k="Qo'shimcha ishlar" v={`+${fmt(calc.extrasPrice)}`} />}
            <Row k="Muddat koeffitsienti" v={`×${calc.u.mult}`} />
          </div>

          <div style={{
            marginTop: 20, padding: 14, borderRadius: 12,
            background: "rgba(255,255,255,0.6)",
            fontSize: 11, color: "#64748b", lineHeight: 1.5,
          }}>
            ⚠️ Bu dastlabki taxmin. Aniq narx usta bilan uchrashgandan so'ng belgilanadi.
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "#64748b" }}>{k}</span>
      <b style={{ color: "#0f172a" }}>{v}</b>
    </div>
  );
}
