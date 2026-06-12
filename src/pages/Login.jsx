import { useState } from "react";
import { COMPANIES, USERS, ROLE_LABELS, C } from "../data";

export default function Login({ onLogin }) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const companyUsers = USERS.filter(u => u.company === selectedCompany);
  const user = USERS.find(u => u.id === selectedUser);
  const company = COMPANIES.find(c => c.id === selectedCompany);

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif",
      display: "flex", background: "#F4F6F5",
    }}>
      {/* Left — brand */}
      <div style={{
        width: 480, background: C.dark, display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "52px 48px",
        position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320,
          borderRadius: "50%", background: C.green + "18" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 260, height: 260,
          borderRadius: "50%", background: C.green + "10" }} />

        {/* Logo */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: C.green,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "#FFF" }}>H</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#FFF", lineHeight: 1.1 }}>Halyk Group</div>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 700, letterSpacing: 2 }}>HR SERVICE PORTAL</div>
            </div>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#FFF", margin: "0 0 16px", lineHeight: 1.2 }}>
            Единый портал<br/>HR-услуг
          </h2>
          <p style={{ fontSize: 15, color: "#FFFFFF70", lineHeight: 1.7, margin: 0 }}>
            Подача и отслеживание HR-заявок для сотрудников банка и дочерних компаний группы
          </p>
        </div>

        {/* Features */}
        <div style={{ position: "relative" }}>
          {[
            { icon: "📦", text: "Каталог из 17 HR-услуг в 7 направлениях" },
            { icon: "⚡", text: "Контроль SLA — заявка всегда в срок" },
            { icon: "🤝", text: "Согласование кандидатов с Головным банком" },
            { icon: "📊", text: "Аналитика и дашборды в реальном времени" },
          ].map(f => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.green + "25",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {f.icon}
              </div>
              <span style={{ fontSize: 13, color: "#FFFFFFA0", lineHeight: 1.4 }}>{f.text}</span>
            </div>
          ))}
          <div style={{ marginTop: 32, fontSize: 11, color: "#FFFFFF35" }}>
            Версия 1.0 · Июнь 2026 · АО «Халык Банк»
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: "0 0 6px" }}>Войти в систему</h3>
          <p style={{ fontSize: 14, color: C.gray500, margin: "0 0 32px" }}>
            Выберите вашу компанию и профиль
          </p>

          {/* Company */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.gray500,
              marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Компания</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {COMPANIES.map(co => {
                const active = selectedCompany === co.id;
                return (
                  <button key={co.id} onClick={() => { setSelectedCompany(co.id); setSelectedUser(""); }}
                    style={{
                      padding: "14px 16px", borderRadius: 12,
                      border: `2px solid ${active ? co.color : C.gray200}`,
                      background: active ? co.color + "0E" : C.white,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      boxShadow: active ? `0 0 0 3px ${co.color}20` : "none",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%",
                        background: active ? co.color : C.gray300 }} />
                      <span style={{ fontSize: 13, fontWeight: 700,
                        color: active ? co.color : C.gray700 }}>{co.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.gray400, paddingLeft: 16 }}>
                      {co.type === "A" ? "Головной банк · Исполнитель" : "Дочерняя компания"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User */}
          {selectedCompany && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.gray500,
                marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Пользователь</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6,
                maxHeight: 300, overflowY: "auto", paddingRight: 2 }}>
                {companyUsers.map(u => {
                  const active = selectedUser === u.id;
                  return (
                    <button key={u.id} onClick={() => setSelectedUser(u.id)}
                      style={{
                        padding: "12px 14px", borderRadius: 10,
                        border: `2px solid ${active ? C.green : C.gray200}`,
                        background: active ? C.greenPale : C.white,
                        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                        display: "flex", alignItems: "center", gap: 12,
                        boxShadow: active ? `0 0 0 3px ${C.green}15` : "none",
                      }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%",
                        background: active ? C.green : C.gray200,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, color: active ? "#FFF" : C.gray500,
                        fontWeight: 700, flexShrink: 0 }}>{u.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600,
                          color: active ? C.dark : C.gray700 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: C.gray400 }}>
                          {ROLE_LABELS[u.role]} · {u.dept}
                        </div>
                      </div>
                      {active && (
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.green,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: "#FFF", fontWeight: 700 }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button onClick={() => user && onLogin(user)} disabled={!selectedUser}
            style={{
              width: "100%", padding: "15px", borderRadius: 12, border: "none",
              background: selectedUser ? C.green : C.gray200,
              color: selectedUser ? "#FFF" : C.gray400,
              fontSize: 15, fontWeight: 700, cursor: selectedUser ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}>
            {selectedUser ? `Войти как ${user?.name?.split(" ")[0]} →` : "Выберите пользователя"}
          </button>

          {selectedUser && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10,
              background: C.greenPale, border: `1px solid ${C.green}30`,
              display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14 }}>✅</span>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>
                {ROLE_LABELS[user?.role]} · {company?.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
