import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const navigate = useNavigate();

  const dashPath =
    user?.role === "admin" ? "/admin"
    : user?.role === "master" ? "/master"
    : "/client";

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 48px",
      background: "rgba(255,255,255,0.45)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.5)",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
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

      <div style={{
        display: "flex", gap: 4,
        background: "rgba(255,255,255,0.5)",
        borderRadius: 50, padding: 4,
        border: "1px solid rgba(255,255,255,0.6)",
        flexWrap: "wrap",
      }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            style={({ isActive }) => ({
              padding: "8px 18px",
              borderRadius: 50,
              fontSize: 13.5,
              fontWeight: 500,
              transition: "all 0.25s ease",
              background: isActive ? "#fb923c" : "transparent",
              color: isActive ? "#7c2d12" : "#64748b",
              boxShadow: isActive ? "0 2px 8px rgba(251,146,60,0.3)" : "none",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {user ? (
          <>
            <Link to={dashPath} className="btn btn-ghost" style={{
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <IconHome /> Kabinet
            </Link>
            <Link to="/profile" className="btn btn-accent" style={{
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <IconUser /> {user.full_name.split(" ")[0]}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Kirish</Link>
            <Link to="/register" className="btn btn-accent">Ro'yxatdan o'tish</Link>
          </>
        )}
      </div>
    </nav>
  );
}
