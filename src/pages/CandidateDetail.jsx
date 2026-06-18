import { useState } from "react";
import { C, CAND_STATUS, MANAGEMENT_BLOCKS, USERS, COMPANIES } from "../data";

export default function CandidateDetail({ cand, currentUser, onBack, onUpdate }) {
  const [msg, setMsg] = useState("");
  const [comment, setComment] = useState("");
  const [showApprove, setShowApprove] = useState(false);

  const isHR = currentUser.role === "hr_specialist";
  const isDirector = currentUser.role === "hr_director";
  const isDeputy = ["deputy_msb", "deputy_rb", "chairman", "deputy_corp"].includes(currentUser.role);
  const isSubsidiary = currentUser.role === "hr_subsidiary" || ["halyk-life","halyk-finance","halyk-leasing"].includes(currentUser.company);

  const st = CAND_STATUS[cand.status] || { label: cand.status, color: C.gray500 };
  const block = MANAGEMENT_BLOCKS.find(b => b.id === cand.block);
  const submitter = USERS.find(u => u.id === cand.submitterId);
  const company = COMPANIES.find(c => c.id === cand.company);

  // Find current pending step
  const pendingStep = cand.approvals.find(a => a.status === "pending");
  const myStep = cand.approvals.find(a => a.assigneeId === currentUser.id && a.status === "pending");
  const canApprove = !!myStep;

  function sendMessage() {
    if (!msg.trim()) return;
    const newMsg = {
      from: isSubsidiary ? "subsidiary" : "hb",
      name: currentUser.name.split(" ").slice(0, 2).join(" "),
      text: msg.trim(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    onUpdate({ messages: [...(cand.messages || []), newMsg] });
    setMsg("");
  }

  function approve() {
    const newApprovals = cand.approvals.map(a => {
      if (a.assigneeId === currentUser.id && a.status === "pending") {
        return { ...a, status: "approved", comment: comment.trim(), date: new Date("2026-06-12").toLocaleDateString("ru-RU") };
      }
      return a;
    });
    // Check if all approved
    const allApproved = newApprovals.every(a => a.status === "approved");
    // Find next pending
    const nextPending = newApprovals.find(a => a.status === "pending");
    let newStatus = cand.status;
    if (allApproved) newStatus = "approved";
    else if (nextPending?.step === "deputy") newStatus = "pending_deputy";
    else if (nextPending?.step === "hrd") newStatus = "pending_hrd";

    const autoMsg = {
      from: "hb", name: currentUser.name.split(" ")[0],
      text: allApproved
        ? `✅ Кандидат окончательно согласован. ${comment ? `Комментарий: ${comment}` : "Можете делать оффер!"}`
        : `✅ Этап «${myStep?.label}» пройден. ${comment ? comment : ""} Заявка передана на следующий этап.`,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    onUpdate({ approvals: newApprovals, status: newStatus, messages: [...(cand.messages || []), autoMsg] });
    setComment("");
    setShowApprove(false);
  }

  function reject() {
    const newApprovals = cand.approvals.map(a =>
      a.assigneeId === currentUser.id && a.status === "pending"
        ? { ...a, status: "rejected", comment: comment.trim(), date: new Date("2026-06-12").toLocaleDateString("ru-RU") }
        : a
    );
    const autoMsg = {
      from: "hb", name: currentUser.name.split(" ")[0],
      text: `❌ Заявка отклонена на этапе «${myStep?.label}». ${comment ? `Причина: ${comment}` : ""}`,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    onUpdate({ approvals: newApprovals, status: "rejected", messages: [...(cand.messages || []), autoMsg] });
    setComment("");
    setShowApprove(false);
  }

  return (
    <div>
      <button onClick={onBack}
        style={{ background: "none", border: "none", color: C.green, fontSize: 13,
          cursor: "pointer", marginBottom: 24, padding: 0, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
        ← {isSubsidiary ? "Мои кандидаты" : "Очередь согласований"}
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.greenPale,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: 0 }}>{cand.candidateName}</h1>
            <span style={{ padding: "3px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: st.color + "15", color: st.color, border: `1px solid ${st.color}30` }}>
              {st.label}
            </span>
          </div>
          <div style={{ fontSize: 14, color: C.gray700 }}>{cand.position} · {cand.department}</div>
          <div style={{ fontSize: 12, color: C.gray500, marginTop: 4 }}>
            {cand.id} · {company?.name} · Подано {cand.date}
          </div>
        </div>

        {/* Approve/Reject for approver */}
        {canApprove && !showApprove && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowApprove("approve")}
              style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: C.green,
                color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ✓ Согласовать
            </button>
            <button onClick={() => setShowApprove("reject")}
              style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${C.red}`,
                background: C.white, color: C.red, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              ✗ Отклонить
            </button>
          </div>
        )}
      </div>

      {/* Approve panel */}
      {showApprove && (
        <div style={{ background: showApprove === "approve" ? C.greenPale : C.red + "08",
          border: `1px solid ${showApprove === "approve" ? C.green + "40" : C.red + "40"}`,
          borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: showApprove === "approve" ? C.green : C.red, marginBottom: 12 }}>
            {showApprove === "approve" ? "✓ Подтвердите согласование" : "✗ Укажите причину отказа"}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder={showApprove === "approve" ? "Комментарий (необязательно)..." : "Причина отклонения *"}
            rows={3}
            style={{ width: "100%", boxSizing: "border-box", border: `1.5px solid ${C.gray200}`,
              borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "inherit",
              color: C.dark, outline: "none", resize: "none", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={showApprove === "approve" ? approve : reject}
              disabled={showApprove === "reject" && !comment.trim()}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none",
                background: showApprove === "approve" ? C.green : (comment.trim() ? C.red : C.gray300),
                color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {showApprove === "approve" ? "Согласовать" : "Отклонить"}
            </button>
            <button onClick={() => setShowApprove(false)}
              style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${C.gray300}`,
                background: C.white, color: C.gray700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Approval chain */}
          <div style={{ background: C.white, borderRadius: 14, padding: "22px 24px",
            border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 18,
              textTransform: "uppercase", letterSpacing: 1 }}>Цепочка согласования</div>
            {cand.approvals.map((a, i) => {
              const color = a.status === "approved" ? C.green : a.status === "rejected" ? C.red : a.status === "pending" && i === cand.approvals.findIndex(x => x.status === "pending") ? C.orange : C.gray300;
              const isActive = a.status === "pending" && i === cand.approvals.findIndex(x => x.status === "pending");
              return (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < cand.approvals.length - 1 ? 16 : 0,
                  position: "relative" }}>
                  {i < cand.approvals.length - 1 && (
                    <div style={{ position: "absolute", left: 16, top: 32, bottom: -16, width: 2,
                      background: a.status === "approved" ? C.green : C.gray200 }} />
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#FFF", fontWeight: 700, flexShrink: 0, zIndex: 1 }}>
                    {a.status === "approved" ? "✓" : a.status === "rejected" ? "✗" : i + 1}
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{a.label}</span>
                      {isActive && (
                        <span style={{ padding: "1px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                          background: C.orange + "20", color: C.orange }}>Ожидает</span>
                      )}
                    </div>
                    {a.date && (
                      <div style={{ fontSize: 11, color: C.gray500 }}>
                        {a.status === "approved" ? "✅ Согласовано" : "❌ Отклонено"} · {a.date}
                      </div>
                    )}
                    {!a.date && !isActive && (
                      <div style={{ fontSize: 11, color: C.gray400 }}>Ожидает предыдущего этапа</div>
                    )}
                    {a.comment && (
                      <div style={{ marginTop: 6, padding: "8px 12px", borderRadius: 8,
                        background: a.status === "approved" ? C.greenPale : C.red + "08",
                        fontSize: 12, color: C.gray700 }}>
                        {a.comment}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat */}
          <div style={{ background: C.white, borderRadius: 14, padding: "22px 24px",
            border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 16,
              textTransform: "uppercase", letterSpacing: 1 }}>Переписка</div>
            <div style={{ minHeight: 60, maxHeight: 280, overflowY: "auto", marginBottom: 14 }}>
              {(!cand.messages || cand.messages.length === 0) ? (
                <div style={{ fontSize: 12, color: C.gray400, textAlign: "center", padding: "20px 0" }}>
                  Сообщений пока нет
                </div>
              ) : (
                cand.messages.map((m, i) => {
                  const fromHB = m.from === "hb" || m.from === "hr";
                  return (
                    <div key={i} style={{ display: "flex", gap: 8,
                      flexDirection: fromHB ? "row" : "row-reverse",
                      alignItems: "flex-end", marginBottom: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%",
                        background: fromHB ? C.green : C.blue,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#FFF", fontWeight: 700, flexShrink: 0 }}>
                        {fromHB ? "ГБ" : "Д"}
                      </div>
                      <div style={{ maxWidth: "70%" }}>
                        <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3,
                          textAlign: fromHB ? "left" : "right" }}>{m.name} · {m.time}</div>
                        <div style={{ padding: "10px 14px", fontSize: 13, color: C.gray700, lineHeight: 1.5,
                          background: fromHB ? C.greenPale : C.blue + "10",
                          borderRadius: fromHB ? "4px 12px 12px 12px" : "12px 4px 12px 12px" }}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {!["approved","rejected"].includes(cand.status) && (
              <div style={{ display: "flex", gap: 8, borderTop: `1px solid ${C.gray100}`, paddingTop: 12 }}>
                <textarea value={msg} onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Написать сообщение... (Enter для отправки)"
                  rows={2}
                  style={{ flex: 1, border: `1.5px solid ${C.gray200}`, borderRadius: 10,
                    padding: "8px 12px", fontSize: 13, fontFamily: "inherit",
                    color: C.dark, resize: "none", outline: "none" }} />
                <button onClick={sendMessage} disabled={!msg.trim()}
                  style={{ padding: "8px 14px", borderRadius: 10, border: "none",
                    background: msg.trim() ? C.green : C.gray200, color: "#FFF",
                    cursor: msg.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700 }}>→</button>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.white, borderRadius: 14, padding: "18px 20px",
            border: `1px solid ${C.gray200}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 14,
              textTransform: "uppercase", letterSpacing: 1 }}>Данные кандидата</div>
            {[
              ["Имя", cand.candidateName],
              ["Должность", cand.position],
              ["Департамент", cand.department],
              ["Блок", block?.label || cand.block],
              ["Ожидаемая ЗП", `${cand.expectedSalary} ${cand.currency}`],
              ["Резюме", cand.resumeFile || "—"],
              ["Компания", company?.name],
              ["Дата подачи", cand.date],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between",
                padding: "7px 0", borderBottom: `1px solid ${C.gray100}`, fontSize: 12 }}>
                <span style={{ color: C.gray500 }}>{k}</span>
                <span style={{ color: C.dark, fontWeight: 500, textAlign: "right", maxWidth: 140,
                  wordBreak: "break-word" }}>{v}</span>
              </div>
            ))}
            {cand.resumeFile && (
              <button style={{ marginTop: 12, width: "100%", padding: "8px", borderRadius: 8,
                border: `1px solid ${C.green}`, background: C.greenPale, color: C.green,
                fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                📄 Скачать резюме
              </button>
            )}
          </div>

          {cand.notes && (
            <div style={{ background: C.white, borderRadius: 14, padding: "16px 18px",
              border: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 8,
                textTransform: "uppercase", letterSpacing: 1 }}>Заметки</div>
              <div style={{ fontSize: 12, color: C.gray700, lineHeight: 1.6 }}>{cand.notes}</div>
            </div>
          )}

          {submitter && (
            <div style={{ background: C.white, borderRadius: 14, padding: "16px 18px",
              border: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, marginBottom: 10,
                textTransform: "uppercase", letterSpacing: 1 }}>Инициатор</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.blue + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: C.blue }}>{submitter.initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{submitter.name}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{submitter.dept} · {company?.name}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
