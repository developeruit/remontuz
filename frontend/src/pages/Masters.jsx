import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { api } from "../api";

const FALLBACK = [
  { user_id: "demo-1", full_name: "Sardor Usmonov", specializations: "Interer dizayner", rating: 4.9, total_reviews: 128, experience_years: 8, hourly_rate: 120000, is_verified: true, city: "Toshkent", _demo: true },
  { user_id: "demo-2", full_name: "Bobur Karimov", specializations: "Santexnik usta", rating: 4.8, total_reviews: 95, experience_years: 10, hourly_rate: 90000, is_verified: true, city: "Toshkent", _demo: true },
  { user_id: "demo-3", full_name: "Aziz Rahmatov", specializations: "Elektrik usta", rating: 4.7, total_reviews: 73, experience_years: 6, hourly_rate: 85000, is_verified: true, city: "Samarqand", _demo: true },
  { user_id: "demo-4", full_name: "Jasur Olimov", specializations: "Qurilish ustasi", rating: 4.6, total_reviews: 54, experience_years: 12, hourly_rate: 110000, is_verified: true, city: "Toshkent", _demo: true },
  { user_id: "demo-5", full_name: "Davron Qodirov", specializations: "Plitka ustasi", rating: 4.5, total_reviews: 41, experience_years: 7, hourly_rate: 95000, is_verified: false, city: "Buxoro", _demo: true },
  { user_id: "demo-6", full_name: "Rustam Yoqubov", specializations: "Malyarlik", rating: 4.4, total_reviews: 32, experience_years: 5, hourly_rate: 70000, is_verified: true, city: "Toshkent", _demo: true },
];

export default function Masters() {
  const [masters, setMasters] = useState(FALLBACK);
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [specFilter, setSpecFilter] = useState("");

  useEffect(() => {
    api.masters()
      .then(real => {
        const merged = [...(real || []), ...FALLBACK];
        setMasters(merged);
      })
      .catch(() => {});
  }, []);

  // unique cities + spec categories for filter dropdowns
  const cities = [...new Set(masters.map(m => m.city).filter(Boolean))];
  const specs = [
    { id: "", label: "Barchasi" },
    { id: "dizayn", label: "Dizayn" },
    { id: "santex", label: "Santexnik" },
    { id: "elektr", label: "Elektrik" },
    { id: "qurilish", label: "Qurilish" },
    { id: "plitka", label: "Plitka" },
    { id: "malyar", label: "Malyarlik" },
  ];

  const filtered = masters
    .filter(m => m.rating >= minRating)
    .filter(m => !cityFilter || m.city === cityFilter)
    .filter(m => !specFilter || m.specializations?.toLowerCase().includes(specFilter.toLowerCase()))
    .filter(m =>
      !search ||
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.specializations?.toLowerCase().includes(search.toLowerCase())
    );

  const hasActiveFilters = minRating > 0 || cityFilter || specFilter || search;

  return (
    <div className="container" style={{ padding: "40px clamp(16px, 3vw, 48px)" }}>
      <h1 className="page-title">Ustalar katalogi</h1>
      <p className="page-sub">Professional mutaxassislar ro'yxati</p>

      <GlassCard style={{ padding: 20, marginBottom: 28 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <input
            className="input"
            placeholder="🔍 Ism yoki mutaxassislik bo'yicha qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {/* City filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Shahar:</span>
              <select className="input" value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                style={{ width: "auto", padding: "8px 14px", fontSize: 13 }}>
                <option value="">Barchasi</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Spec filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Mutaxassislik:</span>
              <select className="input" value={specFilter}
                onChange={e => setSpecFilter(e.target.value)}
                style={{ width: "auto", padding: "8px 14px", fontSize: 13 }}>
                {specs.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Reyting:</span>
              {[0, 4, 4.5, 4.8].map(r => (
                <button key={r} onClick={() => setMinRating(r)} className="btn" style={{
                  padding: "6px 12px", fontSize: 12,
                  background: minRating === r ? "#fb923c" : "rgba(255,255,255,0.6)",
                  color: minRating === r ? "#7c2d12" : "#64748b",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>{r === 0 ? "Hammasi" : `★ ${r}+`}</button>
              ))}
            </div>

            {hasActiveFilters && (
              <button onClick={() => { setMinRating(0); setCityFilter(""); setSpecFilter(""); setSearch(""); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: "#dc2626", fontWeight: 600, padding: "6px 10px",
                }}>✕ Filterlarni tozalash</button>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            {filtered.length} ta usta topildi
          </div>
        </div>
      </GlassCard>

      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {filtered.map(m => {
          const Wrapper = m._demo
            ? ({ children }) => <div style={{ cursor: "default" }}>{children}</div>
            : ({ children }) => <Link to={`/masters/${m.user_id}`} style={{ textDecoration: "none" }}>{children}</Link>;
          return (
          <Wrapper key={m.user_id}>
            <GlassCard hoverable={!m._demo} style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18, flexShrink: 0,
                  background: "linear-gradient(135deg, #fb923c, #f97316)",
                  display: "grid", placeItems: "center",
                  fontSize: 22, fontWeight: 700, color: "#7c2d12",
                }}>{m.full_name?.[0]}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{m.full_name}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{m.specializations}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
                <span>★ <b style={{ color: "#0f172a" }}>{m.rating?.toFixed(1)}</b> ({m.total_reviews})</span>
                <span>{m.experience_years} yil tajriba</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>📍 {m.city}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#64748b" }}>
                Soatlik: <b style={{ color: "#7c2d12" }}>{m.hourly_rate?.toLocaleString("uz-UZ")} so'm</b>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                {m.is_verified && (
                  <span style={{
                    padding: "4px 10px", borderRadius: 50,
                    background: "rgba(251,146,60,0.2)", color: "#c2410c",
                    fontSize: 11, fontWeight: 600,
                  }}>✓ Tasdiqlangan</span>
                )}
                {m._demo && (
                  <span style={{
                    padding: "4px 10px", borderRadius: 50,
                    background: "rgba(148,163,184,0.18)", color: "#64748b",
                    fontSize: 11, fontWeight: 600,
                  }}>Demo</span>
                )}
              </div>
            </GlassCard>
          </Wrapper>
          );
        })}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>Filterlarga mos ustalar topilmadi</p>}
    </div>
  );
}
