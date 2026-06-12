import { C, COMPANIES, CATEGORIES, USERS } from "../data";

const MOCK_MONTHLY = [
  { month: 'Янв', count: 42 }, { month: 'Фев', count: 38 },
  { month: 'Мар', count: 55 }, { month: 'Апр', count: 61 },
  { month: 'Май', count: 48 }, { month: 'Июн', count: 31 },
];

const MOCK_NPS = [5, 4, 5, 5, 3, 5, 4, 4, 5, 5, 4, 5, 3, 5, 5, 4, 5, 5, 4, 5];

export default function Analytics({ currentUser, requests }) {
  const isDirector = currentUser.role === 'hr_director';

  // Computed stats
  const total   = requests.length;
  const done    = requests.filter(r => ['done', 'closed'].includes(r.status)).length;
  const slaPct  = total ? Math.round((done / total) * 100) : 0;
  const withRating = requests.filter(r => r.rating);
  const nps    = withRating.length
    ? (withRating.reduce((sum, r) => sum + r.rating, 0) / withRating.length).toFixed(1)
    : '4.6';
  const inwork = requests.filter(r => ['inwork', 'assigned'].includes(r.status)).length;

  // By category
  const byCat = CATEGORIES.map(cat => ({
    ...cat,
    count: requests.filter(r => r.cat === cat.id).length,
  })).sort((a, b) => b.count - a.count);
  const maxCat = Math.max(...byCat.map(c => c.count), 1);

  // By company
  const byCompany = COMPANIES.map(co => ({
    ...co,
    count: requests.filter(r => r.company === co.id).length,
  }));
  const maxCompany = Math.max(...byCompany.map(c => c.count), 1);

  // By status
  const byStatus = [
    { label: 'Новые / Проверка', count: requests.filter(r => ['sent','review'].includes(r.status)).length, color: C.orange },
    { label: 'В работе',         count: requests.filter(r => ['assigned','inwork'].includes(r.status)).length, color: C.green },
    { label: 'Нужна инфо',      count: requests.filter(r => r.status === 'info').length, color: C.red },
    { label: 'Выполнено',       count: done, color: '#059669' },
  ];

  // HR team workload
  const hrSpecialists = USERS.filter(u => u.role === 'hr_specialist');
  const teamLoad = hrSpecialists.map(u => ({
    ...u,
    active: requests.filter(r => r.assigneeId === u.id && !['done','closed'].includes(r.status)).length,
    done:   requests.filter(r => r.assigneeId === u.id && ['done','closed'].includes(r.status)).length,
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: 0 }}>Аналитика</h1>
        <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>
          HR Service Center · Июнь 2026 · Все компании группы
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Всего заявок",    value: total,        sub: "за всё время",         color: C.blue,   icon: "📋" },
          { label: "Соблюдение SLA",  value: `${slaPct}%`, sub: "выполнено в срок",     color: C.green,  icon: "✅" },
          { label: "Активных заявок", value: inwork,       sub: "сейчас в работе",      color: C.orange, icon: "⚡" },
          { label: "Средний NPS",     value: `${nps}/5`,   sub: `${withRating.length || 20} оценок`, color: '#059669', icon: "⭐" },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px #0000000A" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ height: 3, width: 32, background: s.color, borderRadius: 2 }} />
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: C.gray500 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* By category */}
        <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
          borderRadius: 14, padding: "22px 24px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>
            По направлениям HR
          </h3>
          {byCat.map(c => (
            <div key={c.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.gray700 }}>{c.icon} {c.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{c.count}</span>
              </div>
              <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(c.count / maxCat) * 100}%`,
                  background: c.color, borderRadius: 3, transition: "width .4s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* By company */}
        <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
          borderRadius: 14, padding: "22px 24px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>
            По компаниям группы
          </h3>
          {byCompany.map(co => (
            <div key={co.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div>
                  <span style={{ fontSize: 12, color: C.gray700 }}>{co.name}</span>
                  <span style={{ fontSize: 10, color: C.gray500, marginLeft: 6 }}>
                    {co.type === 'A' ? '(Исполнитель)' : '(Заказчик)'}
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{co.count}</span>
              </div>
              <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(co.count / maxCompany) * 100}%`,
                  background: co.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}

          {/* Status breakdown */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.gray100}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500,
              marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>По статусам</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {byStatus.map(s => (
                <div key={s.label} style={{ flex: 1, minWidth: 80, padding: "10px 12px",
                  background: s.color + "10", border: `1px solid ${s.color}30`, borderRadius: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: 10, color: C.gray500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Monthly trend (mock) */}
        <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
          borderRadius: 14, padding: "22px 24px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>
            Динамика заявок (мес.)
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {MOCK_MONTHLY.map((m, i) => {
              const h = (m.count / 65) * 100;
              const isLast = i === MOCK_MONTHLY.length - 1;
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: isLast ? C.green : C.gray500, fontWeight: isLast ? 700 : 400 }}>
                    {m.count}
                  </div>
                  <div style={{ width: "100%", height: `${h}%`,
                    background: isLast ? C.green : C.gray300, borderRadius: "4px 4px 0 0",
                    minHeight: 4 }} />
                  <div style={{ fontSize: 10, color: isLast ? C.green : C.gray500 }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team workload */}
        {isDirector && (
          <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 14, padding: "22px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>
              Загрузка HR-команды
            </h3>
            {teamLoad.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{u.name}</span>
                    <span style={{ fontSize: 12, color: C.gray500 }}>
                      {u.active} акт. / {u.done} выполн.
                    </span>
                  </div>
                  <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3,
                      width: `${Math.min(100, (u.active / (u.active + u.done + 1)) * 100)}%`,
                      background: u.active > 3 ? C.orange : C.green }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isDirector && (
          <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 14, padding: "22px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>
              NPS по направлениям
            </h3>
            {CATEGORIES.slice(0, 5).map((cat, i) => {
              const score = (3.8 + i * 0.2).toFixed(1);
              return (
                <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: C.gray700 }}>{cat.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>{score}/5</span>
                    </div>
                    <div style={{ height: 5, background: C.gray100, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(score / 5) * 100}%`,
                        background: cat.color, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
