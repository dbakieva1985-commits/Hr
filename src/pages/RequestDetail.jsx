import { useState } from "react";
import { C, STATUS_LABEL, STATUS_COLOR, WORKFLOW_STEPS, USERS, COMPANIES, CATEGORIES, SERVICES } from "../data";
import { Badge, Btn, WorkflowBar, SectionTitle, Card, Avatar } from "../components/ui";

const HR_SPECIALISTS = USERS.filter(u => u.role === 'hr_specialist');

export default function RequestDetail({ request: r, currentUser, onBack, onUpdate }) {
  const [msg, setMsg] = useState("");
  const [rating, setRating] = useState(r.rating || 0);

  const isHR = currentUser.role === 'hr_specialist';
  const isDirector = ['hr_analyst', 'hr_director'].includes(currentUser.role);
  const canAct = isHR || isDirector;

  const submitter = USERS.find(u => u.id === r.submitterId);
  const assignee  = USERS.find(u => u.id === r.assigneeId);
  const company   = COMPANIES.find(c => c.id === r.company);
  const cat       = CATEGORIES.find(c => c.id === r.cat);
  const service   = SERVICES.find(s => s.id === r.serviceId);

  function sendMessage() {
    if (!msg.trim()) return;
    const newMsg = {
      from: isHR ? 'hr' : 'user',
      name: currentUser.name.split(' ').slice(0, 2).join(' '),
      text: msg.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    onUpdate({ messages: [...(r.messages || []), newMsg] });
    setMsg("");
  }

  function changeStatus(newStatus) {
    onUpdate({ status: newStatus });
  }

  function assignToMe() {
    onUpdate({ assigneeId: currentUser.id, status: 'assigned' });
  }

  function submitRating(stars) {
    setRating(stars);
    onUpdate({ rating: stars, status: 'closed' });
  }

  return (
    <div>
      {/* Back button */}
      <button onClick={onBack}
        style={{ background: "none", border: "none", color: C.green, fontSize: 13,
          cursor: "pointer", marginBottom: 24, padding: 0, fontFamily: "inherit" }}>
        ← {isHR ? 'Назад в очередь' : 'Все заявки'}
      </button>

      {/* Request header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14,
          background: (cat?.color || C.green) + "15",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
          {r.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: C.dark, margin: 0 }}>{r.title}</h1>
            <Badge text={STATUS_LABEL[r.status]} color={STATUS_COLOR[r.status]} />
          </div>
          <div style={{ fontSize: 12, color: C.gray500 }}>
            {r.id} · Подана {r.date} · {company?.name} · {cat?.label}
          </div>
        </div>
        {isHR && (
          <div style={{ display: "flex", gap: 8 }}>
            {!r.assigneeId && (
              <Btn small onClick={assignToMe}>Взять в работу</Btn>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Workflow */}
          <Card>
            <SectionTitle>Прогресс заявки</SectionTitle>
            <WorkflowBar status={r.status} />

            {/* HR status controls */}
            {isHR && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.gray100}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.gray500, marginBottom: 10 }}>
                  ИЗМЕНИТЬ СТАТУС
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { s: 'review',   label: 'На проверку',    color: C.orange },
                    { s: 'assigned', label: 'Назначить',      color: C.purple },
                    { s: 'inwork',   label: 'В работу',       color: C.green },
                    { s: 'info',     label: 'Нужна инфо',     color: C.red },
                    { s: 'done',     label: 'Выполнено',      color: '#059669' },
                  ].filter(x => x.s !== r.status).map(x => (
                    <button key={x.s} onClick={() => changeStatus(x.s)}
                      style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${x.color}`,
                        background: x.color + "12", color: x.color, fontSize: 11, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit" }}>
                      {x.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Employee: rate when done */}
            {!isHR && !isDirector && r.status === 'done' && !r.rating && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.gray100}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.gray500, marginBottom: 10 }}>
                  ОЦЕНИТЬ КАЧЕСТВО УСЛУГИ
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => submitRating(n)}
                      style={{ fontSize: 28, background: "none", border: "none",
                        cursor: "pointer", opacity: rating >= n ? 1 : 0.3 }}>
                      ⭐
                    </button>
                  ))}
                  <span style={{ fontSize: 12, color: C.gray500, marginLeft: 4 }}>Нажмите, чтобы оценить</span>
                </div>
              </div>
            )}
            {r.rating && (
              <div style={{ marginTop: 12, fontSize: 13, color: C.green }}>
                {'⭐'.repeat(r.rating)} Оценка поставлена
              </div>
            )}
          </Card>

          {/* Chat */}
          <Card>
            <SectionTitle>Переписка с HR Service Center</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16,
              minHeight: 60, maxHeight: 320, overflowY: "auto" }}>
              {(!r.messages || r.messages.length === 0) ? (
                <div style={{ fontSize: 12, color: C.gray500, textAlign: "center", padding: "20px 0" }}>
                  Сообщений пока нет
                </div>
              ) : (
                r.messages.map((m, i) => {
                  const fromHR = m.from === 'hr';
                  return (
                    <div key={i} style={{ display: "flex", gap: 8,
                      flexDirection: fromHR ? "row" : "row-reverse", alignItems: "flex-end" }}>
                      <Avatar initials={fromHR ? 'HR' : (currentUser.initials || 'Вы')} size={28}
                        color={fromHR ? C.green : C.blue} />
                      <div style={{ maxWidth: "70%" }}>
                        <div style={{ fontSize: 10, color: C.gray500, marginBottom: 4,
                          textAlign: fromHR ? "left" : "right" }}>
                          {m.name} · {m.time}
                        </div>
                        <div style={{
                          background: fromHR ? C.greenPale : C.blue + "12",
                          border: `1px solid ${fromHR ? C.green + "30" : C.blue + "30"}`,
                          borderRadius: fromHR ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                          padding: "10px 14px", fontSize: 13, color: C.gray700, lineHeight: 1.5,
                        }}>{m.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message input */}
            {!['closed'].includes(r.status) && (
              <div style={{ display: "flex", gap: 8, borderTop: `1px solid ${C.gray100}`, paddingTop: 12 }}>
                <textarea
                  value={msg} onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Написать сообщение... (Enter для отправки)"
                  rows={2}
                  style={{ flex: 1, border: `1px solid ${C.gray300}`, borderRadius: 8,
                    padding: "8px 12px", fontSize: 13, fontFamily: "inherit",
                    color: C.dark, resize: "none", outline: "none" }} />
                <Btn onClick={sendMessage} disabled={!msg.trim()} small>→</Btn>
              </div>
            )}
          </Card>
        </div>

        {/* Right column: details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <SectionTitle>Детали заявки</SectionTitle>
            {[
              ["Номер", r.id],
              ["Дата подачи", r.date],
              ["SLA", r.sla],
              ["Компания", company?.name],
              ["Подразделение", r.dept],
              ["Направление", cat?.label],
            ].map(([k, v]) => <DetailRow key={k} label={k} value={v} />)}
          </Card>

          {isHR && (
            <Card>
              <SectionTitle>Управление</SectionTitle>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: C.gray500, marginBottom: 6 }}>Исполнитель</div>
                {assignee ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar initials={assignee.initials} size={28} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{assignee.name}</div>
                      <div style={{ fontSize: 10, color: C.gray500 }}>{assignee.dept}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: C.gray500 }}>Не назначен</div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {HR_SPECIALISTS.filter(u => u.id !== r.assigneeId).map(u => (
                  <button key={u.id}
                    onClick={() => onUpdate({ assigneeId: u.id, status: 'assigned' })}
                    style={{ padding: "8px 10px", border: `1px solid ${C.gray300}`,
                      borderRadius: 8, background: C.white, cursor: "pointer", textAlign: "left",
                      fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                    <Avatar initials={u.initials} size={24} />
                    <span style={{ fontSize: 12, color: C.dark }}>{u.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <SectionTitle>Заявитель</SectionTitle>
            {submitter && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={submitter.initials} size={36} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{submitter.name}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{submitter.dept}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{company?.name}</div>
                </div>
              </div>
            )}
            {r.comment && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: C.gray100,
                borderRadius: 8, fontSize: 12, color: C.gray700, lineHeight: 1.5 }}>
                {r.comment}
              </div>
            )}
          </Card>

          {service?.docs?.length > 0 && (
            <Card>
              <SectionTitle>Документы</SectionTitle>
              {service.docs.map((doc, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 0", borderBottom: `1px solid ${C.gray100}` }}>
                  <span style={{ fontSize: 14 }}>📎</span>
                  <span style={{ fontSize: 12, color: C.gray700 }}>{doc}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0",
      borderBottom: `1px solid ${C.gray100}`, fontSize: 12 }}>
      <span style={{ color: C.gray500 }}>{label}</span>
      <span style={{ color: C.dark, fontWeight: 500 }}>{value}</span>
    </div>
  );
}
