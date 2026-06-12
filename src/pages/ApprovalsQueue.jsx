import { C, CAND_STATUS, MANAGEMENT_BLOCKS, COMPANIES, USERS } from "../data";

export default function ApprovalsQueue({ currentUser, candidates, onOpenDetail }) {
  // Filter based on role: HR sees all, deputies see their step
  const isDeputy = ["deputy_msb","deputy_rb","chairman"].includes(currentUser.role);
  const isHRDirector = currentUser.role === "hr_director";

  const visible = candidates.filter(c => {
    if (currentUser.role === "hr_specialist" || currentUser.role === "hr_analyst") return true;
    if (isHRDirector) return true;
    if (isDeputy) {
      return c.approvals.some(a => a.assigneeId === currentUser.id);
    }
    return true;
  });

  const myPending = visible.filter(c =>
    c.approvals.some(a => a.assigneeId === currentUser.id && a.status === "pending")
  );
  const pending = visible.filter(c => c.status.startsWith("pending"));
  const completed = visible.filter(c => ["approved","rejected"].includes(c.status));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: "0 0 6px" }}>
          Согласование кандидатов от дочек
        </h1>
        <p style={{ fontSize: 14, color: C.gray500, margin: 0 }}>
          Входящие заявки от дочерних компаний Halyk Group
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Требуют моего действия", value: myPending.length,  color: C.red,    icon: "🔔" },
          { label: "На рассмотрении",        value: pending.length,    color: C.orange, icon: "⏳" },
          { label: "Согласовано",            value: visible.filter(c => c.status === "approved").length, color: C.green, icon: "✅" },
          { label: "Всего заявок",           value: visible.length,    color: C.blue,   icon: "📋" },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, border: `1px solid ${C.gray200}`,
            borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ width: 4, height: 28, background: s.color, borderRadius: 2 }} />
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.gray500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My action required */}
      {myPending.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 10,
            display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, display: "inline-block" }} />
            Требуют вашего решения ({myPending.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {myPending.map(c => <ApprovalRow key={c.id} cand={c} onClick={() => onOpenDetail(c.id)} urgent />)}
          </div>
        </>
      )}

      {/* All pending */}
      {pending.filter(c => !myPending.includes(c)).length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray700, marginBottom: 10 }}>
            На рассмотрении
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {pending.filter(c => !myPending.includes(c)).map(c =>
              <ApprovalRow key={c.id} cand={c} onClick={() => onOpenDetail(c.id)} />
            )}
          </div>
        </>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gray700, marginBottom: 10 }}>
            Завершённые
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {completed.map(c => <ApprovalRow key={c.id} cand={c} onClick={() => onOpenDetail(c.id)} />)}
          </div>
        </>
      )}

      {visible.length === 0 && (
        <div style={{ background: C.white, border: `2px dashed ${C.gray300}`, borderRadius: 16,
          padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>Заявок нет</div>
          <div style={{ fontSize: 13, color: C.gray500, marginTop: 6 }}>Здесь появятся заявки от дочерних компаний</div>
        </div>
      )}
    </div>
  );
}

function ApprovalRow({ cand: c, onClick, urgent }) {
  const st = CAND_STATUS[c.status] || { label: c.status, color: C.gray500 };
  const block = MANAGEMENT_BLOCKS.find(b => b.id === c.block);
  const company = COMPANIES.find(co => co.id === c.company);
  const submitter = USERS.find(u => u.id === c.submitterId);
  const pendingStepIdx = c.approvals.findIndex(a => a.status === "pending");

  return (
    <div onClick={onClick}
      style={{
        background: urgent ? C.red + "04" : C.white,
        border: `1px solid ${urgent ? C.red + "30" : C.gray200}`,
        borderRadius: 14, padding: "18px 22px", cursor: "pointer", boxShadow: "0 1px 6px #0000000A",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px #0000001A"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 6px #0000000A"}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%",
          background: (company?.color || C.green) + "15",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{c.candidateName}</span>
            {urgent && <span style={{ padding: "1px 8px", borderRadius: 6, fontSize: 10,
              fontWeight: 700, background: C.red, color: "#FFF" }}>ТРЕБУЕТ ДЕЙСТВИЯ</span>}
          </div>
          <div style={{ fontSize: 13, color: C.gray700, marginBottom: 4 }}>
            {c.position} · {c.department}
          </div>
          <div style={{ fontSize: 11, color: C.gray500 }}>
            {c.id} · {company?.name} · {block?.label} · {c.expectedSalary} {c.currency}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ padding: "3px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
            background: st.color + "15", color: st.color, border: `1px solid ${st.color}30`,
            marginBottom: 6, whiteSpace: "nowrap" }}>
            {st.label}
          </div>
          {pendingStepIdx >= 0 && (
            <div style={{ fontSize: 11, color: C.gray500 }}>
              Этап {pendingStepIdx + 1}/{c.approvals.length}: {c.approvals[pendingStepIdx]?.label}
            </div>
          )}
        </div>
      </div>

      {/* Mini approval chain */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gray100}`,
        display: "flex", alignItems: "center", gap: 0 }}>
        {c.approvals.map((a, i) => {
          const col = a.status === "approved" ? C.green : a.status === "rejected" ? C.red
            : (i === pendingStepIdx ? C.orange : C.gray300);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < c.approvals.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: col,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#FFF" }}>
                  {a.status === "approved" ? "✓" : a.status === "rejected" ? "✗" : i + 1}
                </div>
                <div style={{ fontSize: 9, color: col, marginTop: 2, whiteSpace: "nowrap" }}>{a.label}</div>
              </div>
              {i < c.approvals.length - 1 && (
                <div style={{ flex: 1, height: 2, background: a.status === "approved" ? C.green : C.gray200,
                  margin: "0 4px 12px" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
