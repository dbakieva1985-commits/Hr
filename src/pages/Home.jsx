import { C, SERVICES, STATUS_LABEL, STATUS_COLOR, COMPANIES } from "../data";
import { Badge, Btn } from "../components/ui";

export default function Home({ currentUser, requests, onNavigate, onSelectService, onOpenDetail }) {
  const open   = requests.filter(r => !['closed','done'].includes(r.status));
  const done   = requests.filter(r => ['closed','done'].includes(r.status));
  const urgent = requests.filter(r => r.status === 'info');
  const company = COMPANIES.find(c => c.id === currentUser.company);

  const quickServices = SERVICES.filter(s => s.for_all).slice(0, 4);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: C.green, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", marginBottom: 8 }}>
          {company?.name}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.dark, margin: 0 }}>
          Добро пожаловать, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: C.gray500, marginTop: 8, fontSize: 14 }}>
          Здесь вы можете подать HR-заявку и отследить её выполнение
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 32 }}>
        {[
          { label: "Активных заявок", value: open.length, color: C.blue, icon: "📋" },
          { label: "Требуют действия", value: urgent.length, color: C.red, icon: "⚠️" },
          { label: "Выполнено",        value: done.length,  color: C.green, icon: "✅" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 4px #0000000A",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ height: 3, width: 32, background: stat.color, borderRadius: 2 }} />
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: C.gray500, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Urgent banner */}
      {urgent.length > 0 && (
        <div style={{ background: C.red + "10", border: `1px solid ${C.red}30`, borderRadius: 12,
          padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>Требуется ваше действие</div>
            <div style={{ fontSize: 12, color: C.gray700 }}>
              {urgent.length} {urgent.length === 1 ? 'заявка требует' : 'заявки требуют'} дополнительных сведений от вас
            </div>
          </div>
          <Btn small onClick={() => onNavigate('my')}>Посмотреть</Btn>
        </div>
      )}

      {/* Quick services */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>Популярные сервисы</h2>
        <Btn variant="ghost" small onClick={() => onNavigate('catalog')}>Весь каталог →</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {quickServices.map(s => (
          <div key={s.id} onClick={() => onSelectService(s)}
            style={{
              background: C.white, border: `1px solid ${C.gray300}`,
              borderRadius: 12, padding: "18px 16px", cursor: "pointer",
              boxShadow: "0 1px 4px #0000000A", transition: "box-shadow .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 4, lineHeight: 1.3 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: C.gray500 }}>SLA: {s.sla}</div>
            <div style={{ height: 2, background: C.green, borderRadius: 2, marginTop: 14, width: 28 }} />
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>Последние заявки</h2>
        <Btn variant="ghost" small onClick={() => onNavigate('my')}>Все заявки →</Btn>
      </div>

      {requests.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12,
          padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.dark, marginBottom: 6 }}>Заявок пока нет</div>
          <div style={{ fontSize: 13, color: C.gray500, marginBottom: 20 }}>Подайте первую заявку через каталог</div>
          <Btn onClick={() => onNavigate('catalog')}>Открыть каталог</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {requests.slice(0, 5).map(r => (
            <div key={r.id} onClick={() => onOpenDetail(r.id)}
              style={{
                background: C.white, border: `1px solid ${C.gray300}`,
                borderRadius: 10, padding: "14px 18px", display: "flex",
                alignItems: "center", gap: 14, cursor: "pointer",
                boxShadow: "0 1px 3px #0000000A",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.gray100}
              onMouseLeave={e => e.currentTarget.style.background = C.white}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenPale,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {r.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{r.title}</div>
                <div style={{ fontSize: 11, color: C.gray500 }}>{r.id} · {r.date}</div>
              </div>
              <Badge text={STATUS_LABEL[r.status]} color={STATUS_COLOR[r.status]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
