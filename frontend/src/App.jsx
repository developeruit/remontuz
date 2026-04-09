import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Masters from "./pages/Masters";
import MasterProfile from "./pages/MasterProfile";
import Portfolio from "./pages/Portfolio";
import Materials from "./pages/Materials";
import Calculator from "./pages/Calculator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Apply from "./pages/Apply";
import ClientDashboard from "./pages/ClientDashboard";
import MasterDashboard from "./pages/MasterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 48 }}>Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/masters" element={<Masters />} />
          <Route path="/masters/:id" element={<MasterProfile />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/apply" element={<Protected><Apply /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/client" element={<Protected role="client"><ClientDashboard /></Protected>} />
          <Route path="/master" element={<Protected role="master"><MasterDashboard /></Protected>} />
          <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}
