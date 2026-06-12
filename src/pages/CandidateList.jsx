import { C, CAND_STATUS, MANAGEMENT_BLOCKS } from "../data";

export default function CandidateList({ currentUser, candidates, onNew, onOpenDetail }) {
  const mine = candidates.filter(c => c.submitterId === currentUser.id || c.company === currentUser.company);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: "0 0 6px" }}>
            Согласование кандидатов
          </h1>
          <p style={{ fontSize: 14, color: C.gray500, margin: 0 }}>
            Согласование найма с Халык Банком (Головной банк)
          </p>
        </div>
        <button onClick={onNew}
          style={{ padding: "12px 22px", borderRadius: 12, border: "none", background: C.green,
            color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 8 }}>
          + Новый кандидат
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Всего направлено", value: mine.length,                                             color: C.blue,   icon: "📤" },
          { label: "На рассмотрении",  value: mine.filter(c => c.status.startsWith("pending")).length, color: C.orange, icon: "⏳" },
          { label: "Согласовано",      value: mine.filter(c => c.status === "approved").length,        color: C.green,  icon: "✅" },
          { label: "Отклонено",        value: mine.filter(c => c.status === "rejected").length,        color: C.red,    icon: "❌" },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, border: `1px solid ${C.gray200}`,
            borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 6px #0000000A" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ width: 4, height: 28, background: s.color, borderRadius: 2 }} />
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works banner */}
      {mine.length === 0 && (
        <div style={{ background: C.white, border: `2px dashed ${C.gray300}`, borderRadius: 16,
          padding: "48px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🤝</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 10px" }}>
            Нет активных согласований
          </h3>
          <p style={{ fontSize: 14, color: C.gray500, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
            Направьте кандидата в Халык Банк для согласования найма. Заявка автоматически пройдёт цепочку согласования.
          </p>
          <button onClick={onNew}
            style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: C.green,
              color: "#FFF", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Направить первого кандидата →
          </button>
        </div>
      )}

      {/* List */}
      {mine.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mine.map(c => <CandidateRow key={c.id} cand={c} onClick={() => onOpenDetail(c.id)} />)}
        </div>
      )}
    </div>
  );
}

function CandidateRow({ cand: c, onClick }) {
  const st = CAND_STATUS[c.status] || { label: c.status, color: C.gray500 };
  const block = MANAGEMENT_BLOCKS.find(b => b.id === c.block);
  const approved = c.approvals.filter(a => a.status === "approved").length;
  const total = c.approvals.length;
  const pct = Math.round((approved / total) * 100);

  return (
    <div onClick={onClick}
      style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14,
        padding: "20px 24px", cursor: "pointer", boxShadow: "0 1px 6px #0000000A" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px #0000001A"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 6px #0000000A"}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Avatar */}
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.greenPale,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0 }}>👤</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{c.candidateName}</span>
            <span style={{ padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
              background: st.color + "18", color: st.color, border: `1px solid ${st.color}40` }}>
              {st.label}
            </span>
          </div>
          <div style={{ fontSize: 13, color: C.gray700, marginBottom: 4 }}>
            {c.position} · {c.department}
          </div>
          <div style={{ fontSize: 12, color: C.gray500 }}>
            {c.id} · Подано {c.date} · {block?.label} · {c.expectedSalary} {c.currency}
          </div>
        </div>

        {/* Progress */}
        <div style={{ textAlign: "right", minWidth: 120 }}>
          <div style={{ fontSize: 12, color: C.gray500, marginBottom: 6 }}>
            Этапов пройдено: {approved}/{total}
          </div>
          <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden", width: 120 }}>
            <div style={{ height: "100%", width: `${pct}%`,
              background: c.status === "rejected" ? C.red : c.status === "approved" ? C.green : C.orange,
              borderRadius: 3, transition: "width .3s" }} />
          </div>
          <div style={{ marginTop: 6 }}>
            {c.approvals.map((a, i) => (
              <span key={i} style={{ display: "inline-block", width: 20, height: 20, borderRadius: "50%",
                background: a.status === "approved" ? C.green : a.status === "rejected" ? C.red : C.gray200,
                fontSize: 10, lineHeight: "20px", textAlign: "center", color: "#FFF",
                fontWeight: 700, marginLeft: 4 }}>
                {a.status === "approved" ? "✓" : a.status === "rejected" ? "✗" : i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Approval steps mini */}
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.gray100}` }}>
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          {c.approvals.map((a, i) => {
            const color = a.status === "approved" ? C.green : a.status === "rejected" ? C.red : a.status === "pending" && i === c.approvals.findIndex(x => x.status === "pending") ? C.orange : C.gray300;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: i < c.approvals.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#FFF", fontWeight: 700 }}>
                    {a.status === "approved" ? "✓" : a.status === "rejected" ? "✗" : i + 1}
                  </div>
                  <div style={{ fontSize: 9, color: color, marginTop: 3, whiteSpace: "nowrap" }}>
                    {a.label}
                  </div>
                </div>
                {i < c.approvals.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: a.status === "approved" ? C.green : C.gray200,
                    margin: "0 4px 14px" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
