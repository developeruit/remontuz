export default function GlassCard({ children, className = "", style = {}, hoverable = false, ...rest }) {
  return (
    <div
      className={`glass-card ${hoverable ? "hoverable" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
