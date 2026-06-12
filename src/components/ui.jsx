import { C } from "../data";

export const Badge = ({ text, color = C.green }) => (
  <span style={{
    background: color + "18", color, border: `1px solid ${color}40`,
    borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
  }}>{text}</span>
);

export const Btn = ({ children, onClick, variant = "primary", small, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? C.gray300 : variant === "primary" ? C.green : variant === "danger" ? C.red : variant === "ghost" ? "transparent" : C.gray100,
    color: variant === "primary" || variant === "danger" ? C.white : C.gray700,
    border: variant === "ghost" ? `1px solid ${C.gray300}` : "none",
    borderRadius: 8, padding: small ? "6px 14px" : "10px 20px",
    fontSize: small ? 12 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", transition: "opacity .15s", opacity: disabled ? 0.6 : 1,
  }}>{children}</button>
);

export const Input = ({ label, value, onChange, placeholder, multiline, type = "text" }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.gray500, marginBottom: 4 }}>{label}</label>}
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={3} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`,
          borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
          color: C.dark, resize: "vertical", outline: "none" }} />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`,
          borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
          color: C.dark, outline: "none" }} />
    }
  </div>
);

export const Pill = ({ text, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? C.green : C.white, color: active ? C.white : C.gray500,
    border: `1px solid ${active ? C.green : C.gray300}`, borderRadius: 20,
    padding: "5px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
  }}>{text}</button>
);

export const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.white, border: `1px solid ${C.gray300}`,
    borderRadius: 12, padding: "20px 24px",
    boxShadow: "0 1px 4px #0000000A", ...style,
  }}>{children}</div>
);

export const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: 11, fontWeight: 700, color: C.gray500, margin: "0 0 14px",
    textTransform: "uppercase", letterSpacing: 1 }}>{children}</h3>
);

export function WorkflowBar({ status }) {
  const STEPS = [
    { id: 'draft', label: 'Черновик' },
    { id: 'sent',  label: 'Отправлена' },
    { id: 'review',label: 'Проверка' },
    { id: 'assigned', label: 'Назначен' },
    { id: 'inwork',label: 'В работе' },
    { id: 'done',  label: 'Выполнено' },
    { id: 'closed',label: 'Закрыто' },
  ];
  const cur = STEPS.findIndex(s => s.id === status);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
      {STEPS.map((st, i) => (
        <div key={st.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 52 }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: i < cur ? C.green : i === cur ? C.green : C.gray300,
              color: C.white, fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: i === cur ? `3px solid ${C.greenMid}` : "none",
              boxSizing: "border-box",
            }}>{i < cur ? "✓" : i + 1}</div>
            <span style={{ fontSize: 9, color: i <= cur ? C.green : C.gray500, marginTop: 4,
              textAlign: "center", maxWidth: 50, lineHeight: 1.2 }}>{st.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < cur ? C.green : C.gray300,
              margin: "0 2px", marginBottom: 16 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export function Avatar({ initials, size = 32, color = C.green }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
