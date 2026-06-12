import { C, COMPANIES, ROLE_LABELS } from "../data";
import { Avatar } from "./ui";

const EMPLOYEE_NAV = [
  { id: "home",    icon: "⊞", label: "Главная" },
  { id: "catalog", icon: "☰", label: "Каталог сервисов" },
  { id: "my",      icon: "📋", label: "Мои заявки" },
];
const HR_NAV = [
  { id: "queue",    icon: "📥", label: "Очередь заявок" },
  { id: "catalog",  icon: "☰", label: "Каталог" },
  { id: "analytics",icon: "📊", label: "Аналитика" },
];
const ANALYTICS_NAV = [
  { id: "analytics", icon: "📊", label: "Дашборд" },
  { id: "catalog",   icon: "☰", label: "Каталог" },
];

export default function Sidebar({ currentUser, page, onNav, onLogout }) {
  const role = currentUser.role;
  const isHR = role === "hr_specialist";
  const isAnalytics = role === "hr_analyst" || role === "hr_director";
  const nav = isHR ? HR_NAV : isAnalytics ? ANALYTICS_NAV : EMPLOYEE_NAV;
  const company = COMPANIES.find(c => c.id === currentUser.company);
  const companyColor = company?.color || C.green;

  return (
    <div style={{ width: 220, background: C.dark, display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>

      {/* Logo */}
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: 2, marginBottom: 4 }}>HALYK GROUP</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.white, lineHeight: 1.2 }}>HR Service<br/>Portal</div>
      </div>

      {/* Company badge */}
      <div style={{ margin: "0 14px 12px", padding: "8px 12px", borderRadius: 8,
        background: companyColor + "20", border: `1px solid ${companyColor}40` }}>
        <div style={{ fontSize: 10, color: companyColor, fontWeight: 700 }}>{company?.name}</div>
        <div style={{ fontSize: 10, color: "#FFFFFF60", marginTop: 2 }}>
          {company?.type === 'A' ? 'Исполнитель услуг' : 'Дочерняя компания'}
        </div>
      </div>

      <div style={{ height: 1, background: "#FFFFFF18", margin: "0 16px 8px" }} />

      {/* Nav */}
      <nav style={{ padding: "4px 10px", flex: 1 }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => onNav(n.id)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: page === n.id ? C.green + "30" : "transparent",
            color: page === n.id ? C.white : "#FFFFFF80",
            fontSize: 13, fontWeight: page === n.id ? 600 : 400,
            cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
            borderLeft: page === n.id ? `3px solid ${C.green}` : "3px solid transparent",
          }}>
            <span style={{ fontSize: 15 }}>{n.icon}</span> {n.label}
          </button>
        ))}

        {/* Separator and extra items */}
        {(isHR || isAnalytics) && (
          <>
            <div style={{ height: 1, background: "#FFFFFF18", margin: "10px 4px" }} />
            <div style={{ fontSize: 10, color: "#FFFFFF40", fontWeight: 700, letterSpacing: 1,
              padding: "4px 12px 6px", textTransform: "uppercase" }}>HR Service Center</div>
          </>
        )}
      </nav>

      {/* Role badge */}
      <div style={{ padding: "12px 14px", margin: "0 10px 8px", borderRadius: 8,
        background: "#FFFFFF0A", border: "1px solid #FFFFFF12" }}>
        <div style={{ fontSize: 10, color: "#FFFFFF50", marginBottom: 4, fontWeight: 600 }}>РОЛЬ</div>
        <div style={{ fontSize: 11, color: "#FFFFFF90", fontWeight: 600 }}>{ROLE_LABELS[role]}</div>
      </div>

      {/* User */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #FFFFFF18" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Avatar initials={currentUser.initials} size={34} color={companyColor} />
          <div>
            <div style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{currentUser.name}</div>
            <div style={{ fontSize: 10, color: "#FFFFFF50" }}>{currentUser.dept}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", padding: "7px", borderRadius: 6, border: "1px solid #FFFFFF20",
          background: "transparent", color: "#FFFFFF60", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
        }}>Сменить пользователя</button>
      </div>
    </div>
  );
}
