import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info") => {
    const id = ++idCounter;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const toast = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  const COLORS = {
    success: { bg: "rgba(251,146,60,0.95)", text: "#7c2d12", border: "rgba(251,146,60,1)", icon: "✓" },
    error:   { bg: "rgba(239,68,68,0.95)",  text: "#fff",    border: "rgba(239,68,68,1)",  icon: "✕" },
    info:    { bg: "rgba(59,130,246,0.95)", text: "#fff",    border: "rgba(59,130,246,1)", icon: "ℹ" },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: "fixed", top: 90, right: 24, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 10,
        pointerEvents: "none",
      }}>
        {toasts.map(t => {
          const c = COLORS[t.type] || COLORS.info;
          return (
            <div key={t.id} style={{
              padding: "14px 20px",
              borderRadius: 14,
              background: c.bg,
              color: c.text,
              border: `1px solid ${c.border}`,
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              backdropFilter: "blur(20px)",
              minWidth: 260,
              maxWidth: 400,
              display: "flex",
              alignItems: "center",
              gap: 12,
              animation: "slideIn 0.3s ease",
              pointerEvents: "auto",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "grid", placeItems: "center",
                fontSize: 14, fontWeight: 700, flexShrink: 0,
              }}>{c.icon}</div>
              <span style={{ flex: 1 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
