import { C, COMPANIES, ROLE_LABELS } from "../data";

function getNav(role, company) {
  const isSubsidiary = company !== "halyk";
  if (role === "hr_specialist" || role === "hr_analyst") {
    return [
      { id: "queue",     icon: "📥", label: "Очередь заявок" },
      { id: "approvals", icon: "🤝", label: "Кандидаты от дочек" },
      { id: "catalog",   icon: "📦", label: "Каталог" },
      { id: "analytics", icon: "📊", label: "Аналитика" },
    ];
  }
  if (role === "hr_director") {
    return [
      { id: "queue",     icon: "📥", label: "Очередь заявок" },
      { id: "approvals", icon: "🤝", label: "Кандидаты от дочек" },
      { id: "analytics", icon: "📊", label: "Аналитика" },
    ];
  }
  if (["deputy_msb","deputy_rb","chairman"].includes(role)) {
    return [
      { id: "approvals", icon: "🤝", label: "Согласование найма" },
    ];
  }
  if (role === "hr_subsidiary") {
    return [
      { id: "home",      icon: "🏠", label: "Главная" },
      { id: "catalog",   icon: "📦", label: "Каталог услуг" },
      { id: "my",        icon: "📋", label: "Мои заявки" },
      { id: "candidates",icon: "🤝", label: "Согласование кандидатов" },
    ];
  }
  // employee / manager
  return [
    { id: "home",    icon: "🏠", label: "Главная" },
    { id: "catalog", icon: "📦", label: "Каталог услуг" },
    { id: "my",      icon: "📋", label: "Мои заявки" },
  ];
}

const ROLE_COLOR = {
  employee:      "#0B6E3A",
  manager:       "#2563EB",
  hr_specialist: "#7C3AED",
  hr_analyst:    "#0D9488",
  hr_director:   "#D97706",
  hr_subsidiary: "#2563EB",
  deputy_msb:    "#D97706",
  deputy_rb:     "#DC2626",
  chairman:      "#0B6E3A",
  deputy_corp:   "#7C3AED",
};

export default function Sidebar({ currentUser, page, onNav, onLogout }) {
  const nav = getNav(currentUser.role, currentUser.company);
  const company = COMPANIES.find(c => c.id === currentUser.company);
  const roleColor = ROLE_COLOR[currentUser.role] || C.green;

  return (
    <div style={{
      width: 236, background: "#0D1C18", display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "26px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 900, color: "#FFF", flexShrink: 0, letterSpacing: -1 }}>H</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>HR Portal</div>
            <div style={{ fontSize: 9, color: C.green, fontWeight: 700, letterSpacing: 2,
              textTransform: "uppercase" }}>Halyk Group</div>
          </div>
        </div>
      </div>

      {/* Company badge */}
      <div style={{ margin: "0 14px 14px", padding: "10px 14px", borderRadius: 10,
        background: (company?.color || C.green) + "18",
        border: `1px solid ${(company?.color || C.green)}28` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: company?.color || C.green,
          marginBottom: 2 }}>{company?.name}</div>
        <div style={{ fontSize: 10, color: "#FFFFFF45" }}>
          {company?.type === "A" ? "Головной банк" : "Дочерняя компания"}
        </div>
      </div>

      <div style={{ height: 1, background: "#FFFFFF10", margin: "0 16px 10px" }} />

      {/* Nav */}
      <nav style={{ padding: "2px 10px", flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#FFFFFF25", letterSpacing: 2,
          padding: "4px 14px 8px", textTransform: "uppercase" }}>Навигация</div>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "11px 14px", borderRadius: 10, border: "none",
                background: active ? C.green + "28" : "transparent",
                color: active ? "#FFFFFF" : "#FFFFFF55",
                fontSize: 13, fontWeight: active ? 700 : 400,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
                borderLeft: `3px solid ${active ? C.green : "transparent"}`,
                transition: "all .12s",
              }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{n.label}</span>
              {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ margin: "8px 12px 12px", padding: "14px", borderRadius: 12,
        background: "#FFFFFF07", border: "1px solid #FFFFFF0E" }}>
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
            <div style={{ fontSize: 10, color: "#FFFFFF45", marginTop: 1 }}>
              {ROLE_LABELS[currentUser.role]}
            </div>
          </div>
        </div>
        <button onClick={onLogout}
          style={{ width: "100%", padding: "7px", borderRadius: 8,
            border: "1px solid #FFFFFF14", background: "transparent",
            color: "#FFFFFF45", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
            transition: "all .12s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#FFFFFF80"}
          onMouseLeave={e => e.currentTarget.style.color = "#FFFFFF45"}>
          Сменить пользователя
        </button>
      </div>
    </div>
  );
}
