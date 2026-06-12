import { useState } from "react";
import { C, MANAGEMENT_BLOCKS, COMPANIES } from "../data";

export default function CandidateForm({ currentUser, candidates, onSubmit, onBack }) {
  const [form, setForm] = useState({
    candidateName: "", position: "", department: "", block: "",
    expectedSalary: "", currency: "KZT", resumeFile: "", notes: "",
  });
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [submitted, setSubmitted] = useState(null);

  const company = COMPANIES.find(c => c.id === currentUser.company);
  const block = MANAGEMENT_BLOCKS.find(b => b.id === form.block);
  const f = v => setForm(p => ({ ...p, ...v }));
  const valid = form.candidateName && form.position && form.department && form.block && form.expectedSalary;

  function handleSubmit() {
    const maxId = candidates.reduce((mx, c) => {
      const n = parseInt(c.id.replace("CA-", ""), 10);
      return n > mx ? n : mx;
    }, 0);
    const req = {
      id: `CA-${String(maxId + 1).padStart(3, "0")}`,
      submitterId: currentUser.id,
      company: currentUser.company,
      date: new Date("2026-06-12").toLocaleDateString("ru-RU"),
      ...form,
      status: "pending_hr",
      approvals: [
        { step: "hr",     label: "HR ГБ",        assigneeId: "u3",         status: "pending", comment: "", date: null },
        { step: "deputy", label: block?.label ? `Зампред ${block.label === "МСБ" ? "МСБ" : block.label === "РБ" ? "РБ" : block.label}` : "Зампред", assigneeId: block?.approver_id, status: "pending", comment: "", date: null },
        { step: "hrd",    label: "HRD ГБ",       assigneeId: "u6",         status: "pending", comment: "", date: null },
      ],
      messages: [],
    };
    setSubmitted(req);
    setStep(2);
    onSubmit(req);
  }

  if (step === 2 && submitted) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ background: C.white, borderRadius: 20, padding: "48px 40px", textAlign: "center",
          boxShadow: "0 4px 24px #0000000D", border: `1px solid ${C.gray200}` }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.greenPale,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 24px" }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: "0 0 10px" }}>
            Заявка отправлена в ГБ!
          </h2>
          <p style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6, margin: "0 0 8px" }}>
            Заявка на согласование кандидата <b style={{ color: C.dark }}>{submitted.candidateName}</b> передана в Халык Банк.
          </p>
          <p style={{ fontSize: 13, color: C.gray500, margin: "0 0 32px" }}>
            Номер: <b style={{ color: C.dark }}>{submitted.id}</b>
          </p>

          {/* Approval chain preview */}
          <div style={{ background: C.gray100, borderRadius: 14, padding: "20px", marginBottom: 28, textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 14,
              textTransform: "uppercase", letterSpacing: 1 }}>Цепочка согласования</div>
            {[
              { n: 1, label: "HR ГБ", desc: "Проверка документов и соответствия" },
              { n: 2, label: block ? (block.label === "МСБ" ? "Зампред МСБ" : block.label === "РБ" ? "Зампред РБ" : block.label === "Блок Председателя" ? "Председатель" : "Зампред") : "Зампред", desc: "Согласование по блоку" },
              { n: 3, label: "HRD ГБ", desc: "Финальное согласование" },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%",
                  background: i === 0 ? C.orange + "20" : C.gray200,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: i === 0 ? C.orange : C.gray400, flexShrink: 0 }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{step.desc}</div>
                </div>
                {i === 0 && (
                  <div style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 6,
                    background: C.orange + "15", fontSize: 11, fontWeight: 700, color: C.orange }}>
                    На рассмотрении
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={onBack}
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: C.green,
                color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              К списку кандидатов
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Back */}
      <button onClick={onBack}
        style={{ background: "none", border: "none", color: C.green, fontSize: 13,
          cursor: "pointer", marginBottom: 24, padding: 0, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
        ← Назад
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.dark, margin: "0 0 6px" }}>
          Новое согласование кандидата
        </h1>
        <p style={{ fontSize: 14, color: C.gray500, margin: 0 }}>
          {company?.name} → Халык Банк (ГБ) · Заявка пройдёт цепочку согласования
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
        {["Данные кандидата", "Резюме", "Согласование"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%",
                background: i === 0 ? C.green : C.gray200,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: i === 0 ? "#FFF" : C.gray400 }}>{i + 1}</div>
              <div style={{ fontSize: 10, color: i === 0 ? C.green : C.gray400, marginTop: 4,
                whiteSpace: "nowrap" }}>{s}</div>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: C.gray200, margin: "0 8px 16px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        {/* Main form */}
        <div style={{ background: C.white, borderRadius: 16, padding: "28px 32px",
          border: `1px solid ${C.gray200}`, boxShadow: "0 2px 12px #0000000A" }}>

          <Section title="Информация о кандидате">
            <Field label="Имя и фамилия кандидата *">
              <input value={form.candidateName} onChange={e => f({ candidateName: e.target.value })}
                placeholder="Иванов Иван Иванович"
                style={inputStyle()} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Должность *">
                <input value={form.position} onChange={e => f({ position: e.target.value })}
                  placeholder="Senior Product Manager"
                  style={inputStyle()} />
              </Field>
              <Field label="Департамент / управление *">
                <input value={form.department} onChange={e => f({ department: e.target.value })}
                  placeholder="Управление продаж МСБ"
                  style={inputStyle()} />
              </Field>
            </div>
          </Section>

          <div style={{ height: 1, background: C.gray200, margin: "20px 0" }} />

          <Section title="Блок согласования *">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 4 }}>
              {MANAGEMENT_BLOCKS.map(b => {
                const active = form.block === b.id;
                return (
                  <button key={b.id} onClick={() => f({ block: b.id })}
                    style={{
                      padding: "12px 14px", borderRadius: 10, border: `2px solid ${active ? C.green : C.gray200}`,
                      background: active ? C.greenPale : C.white, cursor: "pointer",
                      fontFamily: "inherit", textAlign: "left",
                    }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? C.green : C.dark }}>
                      {b.label}
                    </div>
                    <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>
                      → {b.label === "МСБ" ? "Зампред МСБ" : b.label === "РБ" ? "Зампред РБ" : b.label === "Блок Председателя" ? "Председатель" : "Зампред"}
                    </div>
                  </button>
                );
              })}
            </div>
            {form.block && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: C.greenPale,
                border: `1px solid ${C.green}30`, fontSize: 12, color: C.green, marginTop: 8 }}>
                ✓ Заявка пройдёт: HR ГБ → {block?.label === "МСБ" ? "Зампред МСБ" : block?.label === "РБ" ? "Зампред РБ" : block?.label === "Блок Председателя" ? "Председатель" : "Зампред"} → HRD ГБ
              </div>
            )}
          </Section>

          <div style={{ height: 1, background: C.gray200, margin: "20px 0" }} />

          <Section title="Условия и резюме">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
              <Field label="Ожидания по зарплате *">
                <input value={form.expectedSalary} onChange={e => f({ expectedSalary: e.target.value })}
                  placeholder="850 000" style={inputStyle()} />
              </Field>
              <Field label="Валюта">
                <select value={form.currency} onChange={e => f({ currency: e.target.value })}
                  style={{ ...inputStyle(), paddingRight: 8 }}>
                  <option>KZT</option>
                  <option>USD</option>
                </select>
              </Field>
            </div>

            <Field label="Резюме кандидата *">
              <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                border: `2px dashed ${form.resumeFile ? C.green : C.gray300}`,
                borderRadius: 10, cursor: "pointer", background: form.resumeFile ? C.greenPale : C.white }}>
                <span style={{ fontSize: 24 }}>{form.resumeFile ? "📄" : "📎"}</span>
                <div>
                  {form.resumeFile ? (
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{form.resumeFile}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>Прикрепить резюме</div>
                      <div style={{ fontSize: 11, color: C.gray500 }}>PDF, DOC, DOCX — до 10 МБ</div>
                    </>
                  )}
                </div>
                <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                  onChange={e => f({ resumeFile: e.target.files[0]?.name || "" })} />
                {!form.resumeFile && (
                  <button type="button" onClick={e => { e.preventDefault(); f({ resumeFile: "resume_candidate.pdf" }); }}
                    style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.gray300}`,
                      background: C.white, fontSize: 12, color: C.gray700, cursor: "pointer", fontFamily: "inherit" }}>
                    Выбрать файл
                  </button>
                )}
                {form.resumeFile && (
                  <button type="button" onClick={e => { e.preventDefault(); f({ resumeFile: "" }); }}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: C.gray400,
                      fontSize: 18, cursor: "pointer" }}>×</button>
                )}
              </label>
            </Field>

            <Field label="Дополнительная информация">
              <textarea value={form.notes} onChange={e => f({ notes: e.target.value })}
                placeholder="Опыт работы, сильные стороны, особые условия кандидата..."
                rows={3}
                style={{ ...inputStyle(), resize: "vertical" }} />
            </Field>
          </Section>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={handleSubmit} disabled={!valid}
              style={{ padding: "14px 28px", borderRadius: 12, border: "none",
                background: valid ? C.green : C.gray200, color: valid ? "#FFF" : C.gray400,
                fontSize: 15, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed",
                fontFamily: "inherit" }}>
              Отправить на согласование →
            </button>
            <button onClick={onBack}
              style={{ padding: "14px 20px", borderRadius: 12, border: `1px solid ${C.gray300}`,
                background: C.white, color: C.gray700, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit" }}>
              Отмена
            </button>
          </div>
        </div>

        {/* Sidebar info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.white, borderRadius: 14, padding: "18px 20px",
            border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 12,
              textTransform: "uppercase", letterSpacing: 1 }}>Как это работает</div>
            {[
              { n: "1", t: "Вы заполняете анкету", d: "Данные кандидата и резюме" },
              { n: "2", t: "HR Халык Банка", d: "Проверяет документы (1–2 дня)" },
              { n: "3", t: "Зампред / Председатель", d: "Согласует по направлению" },
              { n: "4", t: "HRD ГБ", d: "Финальное решение" },
              { n: "5", t: "Результат к вам", d: "Уведомление с решением" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.green + "15",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: C.green, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.greenPale, borderRadius: 14, padding: "16px 18px",
            border: `1px solid ${C.green}25` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8 }}>💡 Подсказка</div>
            <div style={{ fontSize: 12, color: C.gray700, lineHeight: 1.5 }}>
              Срок согласования зависит от направления. Обычно 3–7 рабочих дней. Вы будете получать уведомления на каждом этапе.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.gray500, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%", boxSizing: "border-box", border: `1.5px solid ${C.gray200}`,
    borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "inherit",
    color: C.dark, outline: "none", background: C.white,
  };
}
