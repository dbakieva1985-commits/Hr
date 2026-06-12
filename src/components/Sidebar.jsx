import { C, COMPANIES, ROLE_LABELS } from "../data";

const EMPLOYEE_NAV = [
  { id: "home",    icon: "🏠", label: "Главная" },
  { id: "catalog", icon: "📦", label: "Каталог услуг" },
  { id: "my",      icon: "📋", label: "Мои заявки" },
];
const HR_NAV = [
  { id: "queue",     icon: "📥", label: "Очередь заявок" },
  { id: "catalog",   icon: "📦", label: "Каталог" },
  { id: "analytics", icon: "📊", label: "Аналитика" },
];
const ANALYTICS_NAV = [
  { id: "analytics", icon: "📊", label: "Дашборд" },
  { id: "catalog",   icon: "📦", label: "Каталог" },
];

const ROLE_COLORS = {
  employee:      C.green,
  manager:       "#1D4ED8",
  hr_specialist: "#7C3AED",
  hr_analyst:    "#0891B2",
  hr_director:   "#D97706",
};

export default function Sidebar({ currentUser, page, onNav, onLogout }) {
  const role = currentUser.role;
  const isHR = role === "hr_specialist";
  const isAnalytics = role === "hr_analyst" || role === "hr_director";
  const nav = isHR ? HR_NAV : isAnalytics ? ANALYTICS_NAV : EMPLOYEE_NAV;
  const company = COMPANIES.find(c => c.id === currentUser.company);
  const roleColor = ROLE_COLORS[role] || C.green;

  return (
    <div style={{ width: 232, background: "#0F1E1B", display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>

      {/* Logo */}
      <div style={{ padding: "28px 22px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#FFF", flexShrink: 0 }}>H</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>HR Portal</div>
            <div style={{ fontSize: 10, color: C.green, fontWeight: 700, letterSpacing: 1 }}>HALYK GROUP</div>
          </div>
        </div>
      </div>

      {/* Company */}
      <div style={{ margin: "0 14px 16px", padding: "10px 12px", borderRadius: 10,
        background: company?.color + "18", border: `1px solid ${company?.color}30` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: company?.color }}>{company?.name}</div>
        <div style={{ fontSize: 10, color: "#FFFFFF50", marginTop: 2 }}>
          {company?.type === "A" ? "Исполнитель HR-услуг" : "Дочерняя компания"}
        </div>
      </div>

      <div style={{ height: 1, background: "#FFFFFF10", margin: "0 16px 8px" }} />

      {/* Nav */}
      <nav style={{ padding: "4px 10px", flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#FFFFFF30", letterSpacing: 2,
          padding: "6px 12px 8px", textTransform: "uppercase" }}>Меню</div>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "11px 14px", borderRadius: 10, border: "none",
              background: active ? C.green + "25" : "transparent",
              color: active ? "#FFFFFF" : "#FFFFFF60",
              fontSize: 13, fontWeight: active ? 700 : 400,
              cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
              borderLeft: `3px solid ${active ? C.green : "transparent"}`,
            }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
              {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
                background: C.green }} />}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ margin: "8px 12px 12px", padding: "14px", borderRadius: 12,
        background: "#FFFFFF08", border: "1px solid #FFFFFF10" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: roleColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>
            {currentUser.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "#FFF", fontWeight: 600,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentUser.name.split(" ").slice(0, 2).join(" ")}
            </div>
            <div style={{ fontSize: 10, color: "#FFFFFF50", marginTop: 1 }}>
              {ROLE_LABELS[role]}
            </div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", padding: "7px", borderRadius: 8,
          border: "1px solid #FFFFFF15", background: "transparent",
          color: "#FFFFFF50", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
        }}>Сменить пользователя</button>
      </div>
    </div>
  );
}
