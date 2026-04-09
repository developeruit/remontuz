export default function Footer() {
  return (
    <footer style={{
      position: "relative",
      zIndex: 1,
      marginTop: 80,
      backgroundColor: "#f5f3f0",
      backgroundImage: "url('/footer.png')",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      aspectRatio: "16 / 7",
      minHeight: 420,
      width: "100%",
    }}>
      {/* Soft overlay for text readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(245,243,240,0.85) 0%, rgba(245,243,240,0.35) 35%, rgba(245,243,240,0) 60%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1300,
        margin: "0 auto",
        padding: "56px 48px 0",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr 1fr",
        gap: 48,
      }} className="grid-3">
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "12px 22px", border: "1.5px solid #c8c4be",
            borderRadius: 6, marginBottom: 20,
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{
              fontSize: 18, fontWeight: 700, letterSpacing: 3,
              color: "#2a2a28", fontFamily: "'Space Grotesk', sans-serif",
            }}>REMONTUZ</span>
          </div>
          <p style={{ fontSize: 14, color: "#3a3632", lineHeight: 1.7, maxWidth: 280, marginBottom: 14, fontWeight: 500 }}>
            Toshkent shahridagi ta'mirlash va dizayn xizmatlari platformasi.
          </p>
          <div style={{ fontSize: 13, color: "#6a6660", lineHeight: 1.7, fontWeight: 500 }}>
            © 2025 RemontUZ. Barcha huquqlar himoyalangan.
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, color: "#6a6660", marginBottom: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>Sahifalar</div>
          {["Bosh sahifa", "Xizmatlar", "Ustalar", "Portfolio", "Materiallar", "Kalkulyator"].map(item => (
            <div key={item} style={{ fontSize: 14, color: "#2a2a28", marginBottom: 10, fontWeight: 500 }}>{item}</div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 13, color: "#6a6660", marginBottom: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>Aloqa</div>
          {["Telegram", "Instagram", "+998 (90) 000-00-00", "info@remontuz.uz"].map(item => (
            <div key={item} style={{ fontSize: 14, color: "#2a2a28", marginBottom: 10, fontWeight: 500 }}>{item}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}
