import { useState } from "react";
import { C, STATUS_LABEL, STATUS_COLOR, CATEGORIES } from "../data";
import { Badge, Pill, Btn } from "../components/ui";

const STATUS_FILTERS = ['Все', 'Активные', 'Выполнено'];

export default function MyRequests({ currentUser, requests, onOpenDetail, onNavigate }) {
  const [filter, setFilter] = useState('Все');

  const filtered = requests.filter(r => {
    if (filter === 'Активные') return !['closed', 'done'].includes(r.status);
    if (filter === 'Выполнено') return ['closed', 'done'].includes(r.status);
    return true;
  }).sort((a, b) => {
    const order = ['info', 'inwork', 'assigned', 'review', 'sent', 'done', 'closed', 'draft'];
    return order.indexOf(a.status) - order.indexOf(b.status);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: 0 }}>Мои заявки</h1>
          <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>
            История всех ваших обращений в HR Service Center
          </p>
        </div>
        <Btn onClick={() => onNavigate('catalog')}>+ Новая заявка</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {STATUS_FILTERS.map(f => (
          <Pill key={f} text={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.gray500, alignSelf: "center" }}>
          {filtered.length} {filtered.length === 1 ? 'заявка' : 'заявок'}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 14,
          padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
            {filter === 'Все' ? 'Заявок пока нет' : 'Нет заявок в этой категории'}
          </div>
          <div style={{ fontSize: 13, color: C.gray500, marginBottom: 20 }}>
            Подайте первую заявку через каталог
          </div>
          <Btn onClick={() => onNavigate('catalog')}>Открыть каталог</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(r => <RequestRow key={r.id} request={r} onClick={() => onOpenDetail(r.id)} />)}
        </div>
      )}
    </div>
  );
}

function RequestRow({ request: r, onClick }) {
  const cat = CATEGORIES.find(c => c.id === r.cat);
  const isUrgent = r.status === 'info';
  const isActive = !['closed', 'done'].includes(r.status);

  return (
    <div onClick={onClick}
      style={{
        background: isUrgent ? C.red + "05" : C.white,
        border: `1px solid ${isUrgent ? C.red + '40' : C.gray300}`,
        borderRadius: 12, padding: "16px 20px", cursor: "pointer",
        boxShadow: "0 1px 4px #0000000A",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: (cat?.color || C.green) + "15",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>{r.icon}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{r.title}</span>
            {isUrgent && <span style={{ fontSize: 10, background: C.red, color: "#FFF",
              borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>ДЕЙСТВИЕ</span>}
          </div>
          <div style={{ fontSize: 11, color: C.gray500 }}>
            {r.id} · Подана {r.date} · SLA: {r.sla}
            {r.messages?.length > 0 && <span> · 💬 {r.messages.length} сообщ.</span>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Badge text={STATUS_LABEL[r.status]} color={STATUS_COLOR[r.status]} />
          <span style={{ color: C.gray300, fontSize: 18 }}>›</span>
        </div>
      </div>

      {/* SLA progress bar for active requests */}
      {isActive && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gray100}` }}>
          <SLABar status={r.status} slaDays={r.sla_days} />
        </div>
      )}
    </div>
  );
}

function SLABar({ status, slaDays }) {
  const STEPS_ORDER = ['sent', 'review', 'assigned', 'inwork', 'info', 'done', 'closed'];
  const cur = STEPS_ORDER.indexOf(status);
  const pct = Math.min(100, Math.round(((cur + 1) / 5) * 100));
  const color = pct > 80 ? C.red : pct > 60 ? C.orange : C.green;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: C.gray500 }}>Прогресс выполнения</span>
        <span style={{ fontSize: 10, color }}>SLA: {slaDays} {slaDays === 1 ? 'день' : 'дня'}</span>
      </div>
      <div style={{ height: 4, background: C.gray100, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2,
          transition: "width .3s" }} />
      </div>
    </div>
  );
}
