export default function Footer() {
  return (
    <footer style={{
      position: "relative",
      zIndex: 1,
      marginTop: 80,
      backgroundColor: "#f5f3f0",
    }}>
      <style>{`
        .footer-wrap {
          position: relative;
          background-image: url('/footer.png');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          aspect-ratio: 16 / 7;
          min-height: 420px;
          width: 100%;
        }
        .footer-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(245,243,240,0.85) 0%, rgba(245,243,240,0.35) 35%, rgba(245,243,240,0) 60%);
          pointer-events: none;
        }
        .footer-content {
          position: relative; z-index: 2;
          max-width: 1300px; margin: 0 auto;
          padding: 56px clamp(16px, 3vw, 48px) 0;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 900px) {
          .footer-wrap {
            aspect-ratio: auto;
            min-height: auto;
            background-image: none;
          }
          .footer-content {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 40px 20px 20px;
          }
          .footer-mobile-img {
            display: block !important;
            width: 100%;
            height: auto;
          }
        }
      `}</style>

      <div className="footer-wrap">
        <div className="footer-overlay" />
        <div className="footer-content">
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
            <p style={{ fontSize: 14, color: "#3a3632", lineHeight: 1.7, maxWidth: 320, marginBottom: 14, fontWeight: 500 }}>
              Toshkent shahridagi ta'mirlash va dizayn xizmatlari platformasi.
            </p>
            <div style={{ fontSize: 13, color: "#6a6660", lineHeight: 1.7, fontWeight: 500 }}>
              © 2025 RemontUZ. Barcha huquqlar himoyalangan.
            </div>
          </div>

          <div>
            <div style={{
              fontSize: 13, color: "#6a6660", marginBottom: 16,
              fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2,
            }}>Sahifalar</div>
            {["Bosh sahifa", "Xizmatlar", "Ustalar", "Portfolio", "Materiallar", "Kalkulyator"].map(item => (
              <div key={item} style={{ fontSize: 14, color: "#2a2a28", marginBottom: 10, fontWeight: 500 }}>{item}</div>
            ))}
          </div>

          <div>
            <div style={{
              fontSize: 13, color: "#6a6660", marginBottom: 16,
              fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2,
            }}>Aloqa</div>
            {["Telegram", "Instagram", "+998 (90) 000-00-00", "info@remontuz.uz"].map(item => (
              <div key={item} style={{ fontSize: 14, color: "#2a2a28", marginBottom: 10, fontWeight: 500 }}>{item}</div>
            ))}
          </div>
        </div>

        {/* Mobile-only: image shown separately at bottom */}
        <img
          src="/footer.png"
          alt=""
          className="footer-mobile-img"
          style={{ display: "none" }}
        />
      </div>
    </footer>
  );
}
