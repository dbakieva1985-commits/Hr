import { useState } from "react";
import { COMPANIES, USERS, ROLE_LABELS, C } from "../data";

export default function Login({ onLogin }) {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const companyUsers = USERS.filter(u => u.company === selectedCompany);
  const user = USERS.find(u => u.id === selectedUser);

  return (
    <div style={{ minHeight: "100vh", background: C.dark, display: "flex",
      fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* Left brand panel */}
      <div style={{ flex: 1, padding: "60px 56px", display: "flex", flexDirection: "column",
        justifyContent: "center", maxWidth: 520 }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 3, marginBottom: 16 }}>
            HALYK BANK GROUP
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>
            HR Service<br/>Portal
          </h1>
          <p style={{ color: "#FFFFFF60", marginTop: 16, fontSize: 15, lineHeight: 1.7 }}>
            Единая платформа HR-услуг для сотрудников Халык Банка и дочерних компаний группы
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { icon: '📋', text: '7 направлений HR-сервисов, 17 услуг в каталоге' },
            { icon: '⚡', text: 'Контроль SLA и автоматические уведомления' },
            { icon: '🏢', text: 'Поддержка дочерних компаний группы' },
            { icon: '📊', text: 'Аналитика и отчётность в реальном времени' },
            { icon: '🔒', text: 'Изоляция данных по компаниям (мультитенантность)' },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: "#FFFFFF70", lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, fontSize: 11, color: "#FFFFFF30" }}>
          Версия 1.0 · Июнь 2026 · © АО «Халык Банк»
        </div>
      </div>

      {/* Right login form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px", flex: 1 }}>
        <div style={{ width: 440, background: "#FFFFFF", borderRadius: 20, padding: "48px 40px",
          boxShadow: "0 32px 80px #00000060" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: "0 0 6px" }}>
            Войти в систему
          </h2>
          <p style={{ fontSize: 13, color: C.gray500, margin: "0 0 32px" }}>
            Выберите компанию и профиль пользователя
          </p>

          {/* Company selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.gray500,
              marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Компания
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {COMPANIES.map(co => (
                <button key={co.id} onClick={() => { setSelectedCompany(co.id); setSelectedUser(''); }}
                  style={{
                    padding: "12px 14px", borderRadius: 10,
                    border: `2px solid ${selectedCompany === co.id ? co.color : C.gray300}`,
                    background: selectedCompany === co.id ? co.color + "10" : C.white,
                    cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedCompany === co.id ? co.color : C.gray700 }}>
                    {co.name}
                  </div>
                  <div style={{ fontSize: 10, color: C.gray500, marginTop: 2 }}>
                    {co.type === 'A' ? '● Исполнитель услуг' : '○ Дочерняя компания'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User selector */}
          {selectedCompany && (
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.gray500,
                marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
                Пользователь
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6,
                maxHeight: 280, overflowY: "auto" }}>
                {companyUsers.map(u => (
                  <button key={u.id} onClick={() => setSelectedUser(u.id)}
                    style={{
                      padding: "12px 14px", borderRadius: 10,
                      border: `2px solid ${selectedUser === u.id ? C.green : C.gray300}`,
                      background: selectedUser === u.id ? C.greenPale : C.white,
                      cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>
                      {u.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: C.gray500 }}>{ROLE_LABELS[u.role]} · {u.dept}</div>
                    </div>
                    {selectedUser === u.id && (
                      <span style={{ color: C.green, fontSize: 18, fontWeight: 700 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => user && onLogin(user)}
            disabled={!selectedUser}
            style={{
              width: "100%", padding: "14px", borderRadius: 10, border: "none",
              background: selectedUser ? C.green : C.gray300,
              color: "#FFF", fontSize: 15, fontWeight: 700,
              cursor: selectedUser ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}>
            {selectedUser ? `Войти как ${user?.name?.split(' ')[0]} →` : 'Выберите пользователя'}
          </button>

          {selectedUser && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8,
              background: C.greenPale, border: `1px solid ${C.green}30` }}>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>
                {ROLE_LABELS[user?.role]} · {COMPANIES.find(c => c.id === user?.company)?.name}
              </div>
              <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>
                {user?.dept}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
