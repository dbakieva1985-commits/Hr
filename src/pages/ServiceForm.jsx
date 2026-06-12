import { useState } from "react";
import { C, CATEGORIES, COMPANIES } from "../data";
import { Input, Btn, Badge } from "../components/ui";

export default function ServiceForm({ service: s, currentUser, requests, onSubmit, onBack }) {
  const [form, setForm] = useState({ name: currentUser.name, dept: currentUser.dept, comment: "", dates: "" });
  const [submitted, setSubmitted] = useState(false);
  const [newReq, setNewReq] = useState(null);

  const cat = CATEGORIES.find(c => c.id === s.cat);
  const f = v => ({ ...form, ...v });

  function handleSubmit() {
    const maxId = requests.reduce((max, r) => {
      const n = parseInt(r.id.replace('HR-', ''), 10);
      return n > max ? n : max;
    }, 0);
    const req = {
      id: `HR-${String(maxId + 1).padStart('3', '0')}`,
      serviceId: s.id, icon: s.icon, title: s.title,
      status: 'sent', sla: s.sla, sla_days: s.sla_days,
      date: new Date('2026-06-12').toLocaleDateString('ru-RU'),
      company: currentUser.company, submitterId: currentUser.id,
      assigneeId: null, dept: form.dept,
      comment: form.comment || form.dates || `Заявка от ${form.name}`,
      messages: [], cat: s.cat,
    };
    setNewReq(req);
    setSubmitted(true);
    onSubmit(req);
  }

  if (submitted && newReq) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 10px" }}>
          Заявка отправлена!
        </h2>
        <p style={{ color: C.gray500, fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
          Ваша заявка <b>«{s.title}»</b> успешно принята HR Service Center.
        </p>
        <p style={{ color: C.gray500, fontSize: 14, marginBottom: 28 }}>
          Номер заявки: <b style={{ color: C.dark }}>{newReq.id}</b> · SLA: <b style={{ color: C.dark }}>{s.sla}</b>
        </p>
        <div style={{ background: C.greenPale, border: `1px solid ${C.green}30`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8 }}>
            ЧТО БУДЕТ ДАЛЬШЕ
          </div>
          {[
            'HR проверит комплектность заявки',
            'Назначит ответственного специалиста',
            'Вы получите уведомление об изменении статуса',
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.green,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#FFF", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
              <span style={{ fontSize: 12, color: C.gray700 }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn onClick={() => window.location.reload()}>Мои заявки</Btn>
          <Btn variant="ghost" onClick={onBack}>В каталог</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack}
        style={{ background: "none", border: "none", color: C.green, fontSize: 13,
          cursor: "pointer", marginBottom: 24, padding: 0, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6 }}>
        ← Назад в каталог
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        {/* Form */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: "0 0 4px" }}>{s.title}</h1>
            <div style={{ fontSize: 13, color: C.gray500 }}>Заполните форму для подачи заявки</div>
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 14, padding: "24px 28px" }}>

            <Input label="Ваше имя и фамилия *"
              value={form.name} onChange={v => setForm(f({ name: v }))}
              placeholder="Иванов Иван Иванович" />

            <Input label="Подразделение *"
              value={form.dept} onChange={v => setForm(f({ dept: v }))}
              placeholder="Департамент управления персоналом" />

            {(s.id === 's1') && (
              <Input label="Период отпуска (даты)"
                value={form.dates} onChange={v => setForm(f({ dates: v }))}
                placeholder="с 20 июня по 4 июля 2026" />
            )}

            {(s.id === 's4') && (
              <Input label="Место и период командировки"
                value={form.dates} onChange={v => setForm(f({ dates: v }))}
                placeholder="Алматы, 15–17 июня 2026" />
            )}

            <Input label="Комментарий / дополнительные детали"
              value={form.comment} onChange={v => setForm(f({ comment: v }))}
              placeholder="Укажите любые дополнительные сведения..."
              multiline />

            {s.docs.length > 0 && (
              <div style={{ background: C.gray100, border: `1px solid ${C.gray300}`,
                borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gray700, marginBottom: 8 }}>
                  📎 Необходимые документы
                </div>
                {s.docs.map((doc, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 8, fontSize: 13, color: C.gray700 }}>
                    <span style={{ color: C.gray500 }}>•</span> {doc}
                    <div style={{ marginLeft: "auto" }}>
                      <label style={{ fontSize: 11, color: C.green, cursor: "pointer",
                        border: `1px solid ${C.green}`, borderRadius: 4, padding: "2px 8px" }}>
                        + Прикрепить
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={handleSubmit} disabled={!form.name.trim() || !form.dept.trim()}>
                Отправить заявку
              </Btn>
              <Btn variant="ghost" onClick={onBack}>Отмена</Btn>
            </div>
          </div>
        </div>

        {/* Info sidebar */}
        <div>
          <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: cat?.color, letterSpacing: 1.5,
              textTransform: "uppercase", marginBottom: 6 }}>{cat?.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 8 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: C.gray500, lineHeight: 1.5, marginBottom: 14 }}>{s.desc}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Row label="SLA" value={s.sla} />
              <Row label="Кто может подать" value={s.who} />
              <Row label="Исполнитель" value="HR Service Center" />
            </div>
          </div>

          <div style={{ background: C.greenPale, border: `1px solid ${C.green}30`,
            borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 8 }}>
              О сроке выполнения
            </div>
            <div style={{ fontSize: 12, color: C.gray700, lineHeight: 1.5 }}>
              SLA <b>{s.sla}</b> — нормативный срок с момента подачи и проверки комплектности документов.
              При нарушении срока вы получите уведомление.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0",
      borderBottom: `1px solid ${C.gray100}`, fontSize: 12 }}>
      <span style={{ color: C.gray500 }}>{label}</span>
      <span style={{ color: C.dark, fontWeight: 500, textAlign: "right", maxWidth: 160 }}>{value}</span>
    </div>
  );
}
