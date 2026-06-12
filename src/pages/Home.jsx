import { useState } from "react";
import { C, SERVICES, CATEGORIES, STATUS_LABEL, STATUS_COLOR, COMPANIES } from "../data";
import { Badge } from "../components/ui";

export default function Home({ currentUser, requests, onNavigate, onSelectService, onOpenDetail }) {
  const [search, setSearch] = useState("");
  const open   = requests.filter(r => !["closed","done"].includes(r.status));
  const urgent = requests.filter(r => r.status === "info");
  const done   = requests.filter(r => ["closed","done"].includes(r.status));
  const company = COMPANIES.find(c => c.id === currentUser.company);

  const searchResults = search.trim().length > 1
    ? SERVICES.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #2D4A44 100%)`,
        borderRadius: 20, padding: "40px 48px", marginBottom: 28, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 280, height: 280,
          borderRadius: "50%", background: C.green + "20" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 180, height: 180,
          borderRadius: "50%", background: C.green + "12" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", marginBottom: 10 }}>{company?.name}</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
            Здравствуйте, {currentUser.name.split(" ")[0]}!
          </h1>
          <p style={{ color: "#FFFFFF80", fontSize: 14, margin: "0 0 28px" }}>
            Чем могу помочь сегодня? Выберите услугу или найдите нужную
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 560 }}>
            <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
              fontSize: 18, opacity: 0.5 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск HR-услуги... (отпуск, справка, обучение...)"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "16px 20px 16px 52px", fontSize: 15, borderRadius: 14, border: "none",
                background: "#FFFFFF18", backdropFilter: "blur(8px)",
                color: "#FFFFFF", fontFamily: "inherit", outline: "2px solid #FFFFFF30",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#FFFFFF80", fontSize: 18, cursor: "pointer" }}>×</button>
            )}
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, maxWidth: 560,
              background: C.white, borderRadius: 14, boxShadow: "0 16px 48px #00000040",
              zIndex: 50, marginTop: 8, overflow: "hidden" }}>
              {searchResults.slice(0, 6).map(s => (
                <div key={s.id} onClick={() => { onSelectService(s); setSearch(""); }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                    cursor: "pointer", borderBottom: `1px solid ${C.gray100}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.gray100}
                  onMouseLeave={e => e.currentTarget.style.background = C.white}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: C.gray500 }}>SLA: {s.sla}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: C.green, fontWeight: 600 }}>Подать →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Активных заявок", value: open.length,   color: C.blue,   icon: "📋", click: () => onNavigate("my") },
          { label: "Требуют действия", value: urgent.length, color: C.red,    icon: "⚠️", click: () => onNavigate("my") },
          { label: "Выполнено",        value: done.length,   color: C.green,  icon: "✅", click: () => onNavigate("my") },
        ].map(s => (
          <div key={s.label} onClick={s.click}
            style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 14,
              padding: "20px 22px", cursor: "pointer", boxShadow: "0 1px 4px #0000000A" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: C.gray500, marginTop: 4 }}>{s.label}</div>
              </div>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent banner */}
      {urgent.length > 0 && (
        <div onClick={() => onNavigate("my")} style={{
          background: C.red + "08", border: `1px solid ${C.red}30`, borderRadius: 12,
          padding: "14px 20px", marginBottom: 28, display: "flex", alignItems: "center",
          gap: 12, cursor: "pointer",
        }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>Требуется ваше действие</div>
            <div style={{ fontSize: 12, color: C.gray700 }}>
              HR запрашивает дополнительные сведения по {urgent.length === 1 ? "заявке" : `${urgent.length} заявкам`}
            </div>
          </div>
          <span style={{ fontSize: 13, color: C.red, fontWeight: 600 }}>Открыть →</span>
        </div>
      )}

      {/* Service categories */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: 0 }}>Каталог услуг</h2>
        <button onClick={() => onNavigate("catalog")}
          style={{ background: "none", border: "none", color: C.green, fontSize: 13,
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Все услуги →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
        {CATEGORIES.map(cat => {
          const services = SERVICES.filter(s => s.cat === cat.id);
          return (
            <div key={cat.id} onClick={() => onNavigate("catalog")}
              style={{
                borderRadius: 16, padding: "22px 18px", cursor: "pointer",
                background: cat.color, position: "relative", overflow: "hidden",
                boxShadow: `0 4px 20px ${cat.color}40`,
                transition: "transform .15s, box-shadow .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${cat.color}60`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${cat.color}40`; }}>
              <div style={{ position: "absolute", right: -16, bottom: -16, fontSize: 72, opacity: 0.15 }}>{cat.icon}</div>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 6 }}>
                {cat.label}
              </div>
              <div style={{ fontSize: 11, color: "#FFFFFF90" }}>
                {services.length} {services.length === 1 ? "услуга" : services.length < 5 ? "услуги" : "услуг"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent requests */}
      {requests.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: 0 }}>Мои заявки</h2>
            <button onClick={() => onNavigate("my")}
              style={{ background: "none", border: "none", color: C.green, fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Все заявки →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {requests.slice(0, 4).map(r => (
              <div key={r.id} onClick={() => onOpenDetail(r.id)}
                style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12,
                  padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = C.gray100}
                onMouseLeave={e => e.currentTarget.style.background = C.white}>
                <div style={{ width: 42, height: 42, borderRadius: 12,
                  background: C.gray100, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{r.id} · {r.date} · SLA {r.sla}</div>
                </div>
                <Badge text={STATUS_LABEL[r.status]} color={STATUS_COLOR[r.status]} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
