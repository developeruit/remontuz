import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
  </svg>
);
const IconCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1.5"/>
    <circle cx="18" cy="21" r="1.5"/>
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>
  </svg>
);
const IconMenu = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </>
    ) : (
      <>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </>
    )}
  </svg>
);

const navItems = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/services", label: "Xizmatlar" },
  { to: "/masters", label: "Ustalar" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/materials", label: "Materiallar" },
  { to: "/calculator", label: "Kalkulyator" },
];

export default function Navbar() {
  const { user } = useAuth();
  const { count: cartCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashPath =
    user?.role === "admin" ? "/admin"
    : user?.role === "master" ? "/master"
    : "/client";

  const closeMenu = () => setOpen(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px clamp(16px, 4vw, 48px)",
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.5)",
      gap: 12,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #fb923c, #f97316)",
          display: "grid", placeItems: "center",
          fontSize: 16, fontWeight: 700, color: "#7c2d12",
          boxShadow: "0 2px 8px rgba(251,146,60,0.4)",
        }}>R</div>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", letterSpacing: -0.5 }}>
          Remont<span style={{ color: "#c2410c" }}>UZ</span>
        </span>
      </Link>

      <div className="nav-center" style={{
        display: "flex", gap: 4,
        background: "rgba(255,255,255,0.5)",
        borderRadius: 50, padding: 4,
        border: "1px solid rgba(255,255,255,0.6)",
      }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={closeMenu}
            style={({ isActive }) => ({
              padding: "8px 16px",
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.25s ease",
              background: isActive ? "#fb923c" : "transparent",
              color: isActive ? "#7c2d12" : "#64748b",
              boxShadow: isActive ? "0 2px 8px rgba(251,146,60,0.3)" : "none",
              whiteSpace: "nowrap",
              textAlign: "center",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-auth" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {/* Cart icon */}
        <Link to="/cart" style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 42, height: 42,
          borderRadius: 12,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid rgba(100,116,139,0.2)",
          color: "#475569",
          textDecoration: "none",
          transition: "all 0.2s",
        }}>
          <IconCart />
          {cartCount > 0 && (
            <span style={{
              position: "absolute",
              top: -4, right: -4,
              minWidth: 18, height: 18,
              borderRadius: 10,
              background: "#fb923c",
              color: "#7c2d12",
              fontSize: 10,
              fontWeight: 700,
              display: "grid",
              placeItems: "center",
              padding: "0 5px",
              border: "2px solid #fff",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>{cartCount > 99 ? "99+" : cartCount}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to={dashPath} className="btn btn-ghost hide-mobile" style={{
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <IconHome /> Kabinet
            </Link>
            <Link to="/profile" className="btn btn-accent" style={{
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <IconUser /> <span className="hide-mobile">{user.full_name.split(" ")[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost hide-mobile">Kirish</Link>
            <Link to="/register" className="btn btn-accent">Ro'yxat</Link>
          </>
        )}

        <button
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(100,116,139,0.2)",
            borderRadius: 10,
            width: 40, height: 40,
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#475569",
            flexShrink: 0,
          }}
        >
          <IconMenu open={open} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="nav-center open"
          style={{ display: "flex", gap: 6 }}
          onClick={(e) => {
            // faqat NavLink'lar bosilganda yopiladi, umumiy bo'sh joyda yopilmasin
            if (e.target.tagName === "A") closeMenu();
          }}
        >
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              style={({ isActive }) => ({
                padding: "12px 18px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                background: isActive ? "#fb923c" : "transparent",
                color: isActive ? "#7c2d12" : "#334155",
                textAlign: "left",
              })}
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to={dashPath}
              onClick={closeMenu}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                color: "#475569",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                marginTop: 6,
              }}
            >
              🏠 Kabinet
            </NavLink>
          )}
          {!user && (
            <NavLink
              to="/login"
              onClick={closeMenu}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                color: "#475569",
                borderTop: "1px solid rgba(0,0,0,0.05)",
                marginTop: 6,
              }}
            >
              Kirish
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
