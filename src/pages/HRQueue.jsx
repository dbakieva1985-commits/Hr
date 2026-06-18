import { useState } from "react";
import { C, STATUS_LABEL, STATUS_COLOR, COMPANIES, CATEGORIES, USERS } from "../data";
import { Badge, Pill } from "../components/ui";

const FILTERS = ['Все', 'Требуют действия', 'В работе', 'Выполнено'];

export default function HRQueue({ currentUser, requests, onOpenDetail }) {
  const [filter, setFilter] = useState('Все');
  const [company, setCompany] = useState('Все');

  const companies = ['Все', ...COMPANIES.map(c => c.name)];

  const filtered = requests.filter(r => {
    const matchStatus =
      filter === 'Все' ? true :
      filter === 'Требуют действия' ? ['sent', 'review', 'info'].includes(r.status) :
      filter === 'В работе' ? ['assigned', 'inwork'].includes(r.status) :
      ['done', 'closed'].includes(r.status);
    const matchCompany = company === 'Все' || COMPANIES.find(c => c.id === r.company)?.name === company;
    return matchStatus && matchCompany;
  }).sort((a, b) => {
    const urgency = { info: 0, sent: 1, review: 2, assigned: 3, inwork: 4, done: 5, closed: 6, draft: 7 };
    return urgency[a.status] - urgency[b.status];
  });

  const stats = {
    new:     requests.filter(r => ['sent', 'review'].includes(r.status)).length,
    inwork:  requests.filter(r => ['assigned', 'inwork'].includes(r.status)).length,
    info:    requests.filter(r => r.status === 'info').length,
    done:    requests.filter(r => ['done', 'closed'].includes(r.status)).length,
  };

  const myRequests = requests.filter(r => r.assigneeId === currentUser.id && !['done','closed'].includes(r.status));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: 0 }}>
          Очередь заявок
        </h1>
        <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>
          HR Service Center · Все компании группы
        </p>
      </div>

      {/* KPI stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Новые / Проверка", value: stats.new,    color: C.orange, icon: "📨" },
          { label: "В работе",         value: stats.inwork,  color: C.green,  icon: "⚡" },
          { label: "Нужна информация", value: stats.info,    color: C.red,    icon: "⚠️" },
          { label: "Выполнено",        value: stats.done,    color: C.gray500,icon: "✅" },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 4px #0000000A" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ height: 3, width: 24, background: s.color, borderRadius: 2 }} />
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.gray500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My active tasks */}
      {myRequests.length > 0 && (
        <div style={{ background: C.greenPale, border: `1px solid ${C.green}30`,
          borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8 }}>
            МОИ АКТИВНЫЕ ЗАДАЧИ ({myRequests.length})
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {myRequests.map(r => (
              <button key={r.id} onClick={() => onOpenDetail(r.id)}
                style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.green}40`,
                  background: C.white, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.dark }}>
                <span>{r.icon}</span> {r.id}: {r.title.slice(0, 25)}...
                <Badge text={STATUS_LABEL[r.status]} color={STATUS_COLOR[r.status]} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {FILTERS.map(f => (
          <Pill key={f} text={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
        <div style={{ width: 1, background: C.gray300, margin: "0 4px" }} />
        {companies.map(c => (
          <Pill key={c} text={c} active={company === c} onClick={() => setCompany(c)} />
        ))}
      </div>

      <div style={{ fontSize: 12, color: C.gray500, marginBottom: 14 }}>
        {filtered.length} {filtered.length === 1 ? 'заявка' : 'заявок'}
      </div>

      {/* Request list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12,
            padding: "60px 24px", textAlign: "center", color: C.gray500 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Нет заявок</div>
          </div>
        ) : (
          filtered.map(r => <QueueRow key={r.id} request={r} onClick={() => onOpenDetail(r.id)} currentUser={currentUser} />)
        )}
      </div>
    </div>
  );
}

function QueueRow({ request: r, onClick, currentUser }) {
  const submitter = USERS.find(u => u.id === r.submitterId);
  const assignee  = USERS.find(u => u.id === r.assigneeId);
  const company   = COMPANIES.find(c => c.id === r.company);
  const cat       = CATEGORIES.find(c => c.id === r.cat);
  const isUrgent  = ['sent', 'review', 'info'].includes(r.status);
  const isMyTask  = r.assigneeId === currentUser.id;

  return (
    <div onClick={onClick}
      style={{
        background: isUrgent ? C.orange + "06" : C.white,
        border: `1px solid ${r.status === 'info' ? C.red + "50" : isUrgent ? C.orange + "40" : C.gray300}`,
        borderRadius: 12, padding: "16px 20px", cursor: "pointer",
        boxShadow: "0 1px 4px #0000000A",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12,
          background: (cat?.color || C.green) + "15",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
          {r.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{r.title}</span>
            {isMyTask && <span style={{ fontSize: 10, background: C.green, color: "#FFF",
              borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>МОЯ</span>}
            {r.status === 'info' && <span style={{ fontSize: 10, background: C.red, color: "#FFF",
              borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>ОЖИДАЕТ ДАННЫХ</span>}
          </div>
          <div style={{ fontSize: 11, color: C.gray500 }}>
            {r.id} · {company?.name} · {submitter?.name} · {r.dept}
          </div>
          <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>
            Подана {r.date} · SLA: {r.sla}
            {assignee && <span> · Исп: <b style={{ color: C.dark }}>{assignee.name.split(' ')[0]}</b></span>}
            {!assignee && <span style={{ color: C.orange }}> · Не назначена</span>}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <Badge text={STATUS_LABEL[r.status]} color={STATUS_COLOR[r.status]} />
          <div style={{ fontSize: 10, color: C.gray500 }}>
            {cat?.icon} {cat?.label}
          </div>
        </div>
      </div>
    </div>
  );
}
