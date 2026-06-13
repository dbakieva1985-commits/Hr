import { useState } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg:       "#F7F8FA",
  white:    "#FFFFFF",
  dark:     "#1C2B2B",
  green:    "#1F7A5C",
  greenMid: "#2E9B76",
  greenPale:"#EBF5F1",
  gray700:  "#3D4349",
  gray500:  "#6B7280",
  gray300:  "#D1D5DB",
  gray100:  "#F3F4F6",
  orange:   "#D97706",
  blue:     "#1D4ED8",
  red:      "#DC2626",
};

// ── Data ───────────────────────────────────────────────────────────────────
const SERVICES = [
  { id: 1, cat: "Кадровое администрирование", icon: "🏖", title: "Заявка на отпуск",        sla: "1 раб. день",  desc: "Оформление ежегодного, учебного или административного отпуска.", who: "Любой сотрудник", docs: "Заявление (заполняется на портале)" },
  { id: 2, cat: "Кадровое администрирование", icon: "🔄", title: "Заявка на перевод",       sla: "3 раб. дня",   desc: "Перевод на другую должность, в другое подразделение или регион.", who: "Сотрудник / руководитель", docs: "Заявка с обоснованием" },
  { id: 3, cat: "Кадровое администрирование", icon: "📄", title: "Справка с места работы",  sla: "1 раб. день",  desc: "Официальный документ о должности и зарплате для банка, визы, гос. органов.", who: "Любой сотрудник", docs: "Не требуются" },
  { id: 4, cat: "Подбор персонала",           icon: "🔍", title: "Заявка на подбор",        sla: "5 раб. дней",  desc: "Открытие вакансии и поиск кандидата силами HR Service Center.", who: "Руководитель подразделения", docs: "Описание вакансии, грейд" },
  { id: 5, cat: "Compensation & Benefits",    icon: "💰", title: "Заявка на премирование",   sla: "3 раб. дня",   desc: "Единовременная или регулярная премия для сотрудника или команды.", who: "Руководитель подразделения", docs: "Обоснование, сумма" },
  { id: 6, cat: "Обучение и развитие",        icon: "📚", title: "Заявка на обучение",       sla: "3 раб. дня",   desc: "Запись на внутренний или внешний курс, тренинг или сертификацию.", who: "Любой сотрудник / руководитель", docs: "Название курса, провайдер" },
  { id: 7, cat: "HR Analytics",               icon: "📊", title: "Запрос HR-отчёта",         sla: "2 раб. дня",   desc: "Любой аналитический отчёт: текучесть, headcount, ФОТ, SLA.", who: "Руководитель / HR", docs: "Описание нужных данных и периода" },
  { id: 8, cat: "Оценка и Performance",       icon: "🎯", title: "Запуск оценки 360",        sla: "5 раб. дней",  desc: "Организация цикла оценки для сотрудника или команды.", who: "Руководитель / HR", docs: "Список участников оценки" },
  { id: 9, cat: "Подбор персонала",           icon: "✅", title: "Согласование кандидата",    sla: "2 раб. дня",   desc: "Согласование финального кандидата на вакансию: руководитель → HR → директор. Фиксация оффера и старта.", who: "Руководитель подразделения", docs: "Резюме кандидата, условия оффера", isApproval: true },
];

const STATUSES = { draft:"Черновик", sent:"Отправлена", review:"Проверка", assigned:"Назначен исполнитель", inwork:"В работе", done:"Выполнено", closed:"Закрыто" };
const STATUS_COLOR = { draft:C.gray500, sent:C.blue, review:C.orange, assigned:C.green, inwork:C.green, done:C.green, closed:C.gray500 };

const CATS = [...new Set(SERVICES.map(s => s.cat))];

// ── Tiny helpers ────────────────────────────────────────────────────────────
const Badge = ({ text, color = C.green }) => (
  <span style={{ background: color + "18", color, border: `1px solid ${color}40`,
    borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
    {text}
  </span>
);

const Pill = ({ text, active, onClick }) => (
  <button onClick={onClick} style={{
    background: active ? C.green : C.white, color: active ? C.white : C.gray500,
    border: `1px solid ${active ? C.green : C.gray300}`, borderRadius: 20,
    padding: "5px 14px", fontSize: 12, cursor: "pointer", transition: "all .15s",
    fontFamily: "inherit"
  }}>{text}</button>
);

const Input = ({ label, value, onChange, placeholder, multiline }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.gray500, marginBottom: 4 }}>{label}</label>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={3} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`,
          borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
          color: C.dark, resize: "vertical", outline: "none" }} />
      : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`,
          borderRadius: 8, padding: "8px 12px", fontSize: 14, fontFamily: "inherit",
          color: C.dark, outline: "none" }} />
    }
  </div>
);

const Btn = ({ children, onClick, variant = "primary", small }) => (
  <button onClick={onClick} style={{
    background: variant === "primary" ? C.green : variant === "ghost" ? "transparent" : C.gray100,
    color: variant === "primary" ? C.white : C.gray700,
    border: variant === "ghost" ? `1px solid ${C.gray300}` : "none",
    borderRadius: 8, padding: small ? "6px 14px" : "10px 20px",
    fontSize: small ? 12 : 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", transition: "opacity .15s"
  }}>{children}</button>
);

// ── Workflow steps ──────────────────────────────────────────────────────────
const STEPS = ["draft","sent","review","assigned","inwork","done","closed"];
const WorkflowBar = ({ status }) => {
  const cur = STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "16px 0" }}>
      {STEPS.map((st, i) => (
        <div key={st} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 52 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: i <= cur ? C.green : C.gray300,
              color: C.white, fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: i === cur ? `3px solid ${C.greenMid}` : "none"
            }}>{i < cur ? "✓" : i + 1}</div>
            <span style={{ fontSize: 9, color: i <= cur ? C.green : C.gray500, marginTop: 3, textAlign: "center", maxWidth: 50 }}>
              {STATUSES[st]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < cur ? C.green : C.gray300, margin: "0 2px", marginBottom: 14 }} />
          )}
        </div>
      ))}
    </div>
  );
};

// ── Approval stages (реальный маршрут) ──────────────────────────────────────
const APPROVAL_STAGES = [
  { id: "recruiter", label: "Рекрутер",         sub: "Запускает процесс",          icon: "🚀" },
  { id: "do",        label: "ДО",               sub: "Дочерняя организация",       icon: "🏛" },
  { id: "business",  label: "Рук. направления", sub: "Зампред / МСБ / РБ / Без-ть", icon: "⭐" },
  { id: "usot",      label: "Спец. УСОТ",       sub: "Специалист УСОТ",            icon: "👤" },
  { id: "hr_dir",    label: "Директор HR ГБ",   sub: "Директор по персоналу",      icon: "👔" },
  { id: "do_date",   label: "ДО: дата выхода",  sub: "Подтверждение даты",         icon: "📅" },
  { id: "uap",       label: "УАП ГБ",           sub: "Приказ о приёме",            icon: "📋" },
];

const BUSINESS_DIRS = [
  "Зампред ГБ",
  "МСБ",
  "РБ (Розничный бизнес)",
  "Безопасность",
  "Председатель",
];

const ApprovalBar = ({ decisions, businessDir }) => (
  <div style={{ overflowX: "auto", paddingBottom: 8 }}>
    <div style={{ display: "flex", alignItems: "flex-start", minWidth: 600, margin: "16px 0" }}>
      {APPROVAL_STAGES.map((st, i) => {
        const dec = decisions[st.id];
        const isActive = !dec && APPROVAL_STAGES.slice(0, i).every(s => decisions[s.id] === "approved");
        const bg = dec === "approved" ? C.green : dec === "rejected" ? C.red : isActive ? C.orange : C.gray300;
        const statusLabel = dec === "approved" ? "✓ Одобрено" : dec === "rejected" ? "✗ Отклонено" : isActive ? "● Активно" : "Ожидает";
        const subLabel = st.id === "business" && businessDir ? businessDir : st.sub;
        return (
          <div key={st.id} style={{ display: "flex", alignItems: "flex-start", flex: i < APPROVAL_STAGES.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 82 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: C.white,
                border: isActive ? `3px solid ${C.orange}` : !dec ? `2px dashed ${C.gray300}` : "none",
                boxShadow: isActive ? `0 0 0 4px ${C.orange}22` : "none",
              }}>{st.icon}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: bg, marginTop: 5, textAlign: "center", lineHeight: 1.3 }}>{st.label}</span>
              <span style={{ fontSize: 9, color: C.gray500, textAlign: "center", marginTop: 2, lineHeight: 1.3 }}>{subLabel}</span>
              <span style={{ fontSize: 9, color: bg, fontWeight: 600, marginTop: 3 }}>{statusLabel}</span>
            </div>
            {i < APPROVAL_STAGES.length - 1 && (
              <div style={{ flex: 1, height: 2, background: dec === "approved" ? C.green : C.gray300, margin: "19px 2px 0", flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// ── Sidebar nav ─────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",     icon: "⊞", label: "Главная" },
  { id: "catalog",  icon: "☰", label: "Каталог" },
  { id: "my",       icon: "📋", label: "Мои заявки" },
  { id: "analytics",icon: "📊", label: "Аналитика" },
];

// ── Analytics mock ──────────────────────────────────────────────────────────
const ANALYTICS = [
  { label: "Всего заявок", value: "124", sub: "за последние 30 дней", color: C.green },
  { label: "Соблюдение SLA", value: "91%", sub: "выполнено в срок", color: C.blue },
  { label: "Среднее время", value: "1.8 дн", sub: "от подачи до закрытия", color: C.orange },
  { label: "NPS сервиса", value: "4.6 / 5", sub: "оценок: 87", color: C.green },
];
const TOP_SERVICES = [
  { title: "Справка с места работы", count: 38, pct: 100 },
  { title: "Заявка на отпуск",       count: 31, pct: 82 },
  { title: "Заявка на подбор",       count: 18, pct: 47 },
  { title: "Заявка на обучение",     count: 14, pct: 37 },
  { title: "Заявка на премирование", count: 11, pct: 29 },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [catFilter, setCatFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);   // service being applied to
  const [form, setForm] = useState({ name: "", dept: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [approvalTab, setApprovalTab]   = useState("personal");
  const [cvLoaded,    setCvLoaded]      = useState(false);
  const [approvalForm, setApprovalForm] = useState({
    // Личные данные
    lastName: "", firstName: "", patronymic: "", dob: "", iin: "",
    passportNo: "", passportIssued: "", passportExpiry: "",
    // Вакансия / оффер
    position: "", dept: "", salary: "", businessDir: "",
    // Образование (из резюме)
    education: [{ institution: "", degree: "", year: "" }],
    // Опыт работы (из резюме)
    experience: [{ company: "", role: "", period: "", duties: "" }],
    // Родственники
    relatives: [{ lastName: "", firstName: "", patronymic: "", relation: "", address: "", workplace: "", iin: "", phone: "" }],
  });
  const [requests, setRequests] = useState([
    { id: "HR-001", title: "Справка с места работы", status: "inwork",  sla: "1 раб. день",  date: "09.06.2026", icon: "📄" },
    { id: "HR-002", title: "Заявка на отпуск",        status: "closed",  sla: "1 раб. день",  date: "02.06.2026", icon: "🏖" },
    { id: "HR-003", title: "Заявка на подбор",        status: "review",  sla: "5 раб. дней",  date: "11.06.2026", icon: "🔍" },
    { id: "HR-004", title: "Согласование кандидата",  status: "inwork",  sla: "2 раб. дня",   date: "12.06.2026", icon: "✅",
      isApproval: true,
      candidate: "Алия Сейткали", position: "Senior Product Manager", dept: "Цифровой бизнес",
      salary: "850 000 ₸", start: "", businessDir: "МСБ",
      decisions: { recruiter: "approved", do: "approved", business: "approved", usot: null, hr_dir: null, do_date: null, uap: null },
      personal: { lastName: "Сейткали", firstName: "Алия", patronymic: "Маратовна", dob: "15.03.1992", iin: "920315401234", passportNo: "N12345678", passportIssued: "10.05.2018", passportExpiry: "10.05.2028" },
      education: [{ institution: "КазНУ им. аль-Фараби", degree: "Магистр менеджмента", year: "2015" }],
      experience: [{ company: "Kaspi Bank", role: "Product Manager", period: "2019–2024", duties: "Запуск мобильных продуктов" }],
      relatives: [
        { lastName: "Сейткали", firstName: "Марат", patronymic: "Ахметович", relation: "Отец", address: "Алматы, ул. Абая 12", workplace: "АО «Казмунайгаз»", iin: "620510301234", phone: "+7 701 000 0001" },
        { lastName: "Сейткали", firstName: "Гульнара", patronymic: "Жаксыбековна", relation: "Мать", address: "Алматы, ул. Абая 12", workplace: "СШ №45", iin: "650820401235", phone: "+7 701 000 0002" },
      ],
    },
  ]);
  const [detail, setDetail] = useState(null);       // request detail view

  const sideW = 200;

  const filteredServices = SERVICES.filter(s => {
    const matchCat  = catFilter === "Все" || s.cat === catFilter;
    const matchSrch = s.title.toLowerCase().includes(search.toLowerCase()) || s.cat.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  function submitRequest() {
    const svc = selected;
    const newReq = svc.isApproval
      ? {
          id: `HR-00${requests.length + 4}`,
          title: svc.title, status: "sent",
          sla: svc.sla, date: new Date().toLocaleDateString("ru-RU"),
          icon: svc.icon, isApproval: true,
          candidate:   `${approvalForm.lastName} ${approvalForm.firstName} ${approvalForm.patronymic}`.trim(),
          position:    approvalForm.position,
          dept:        approvalForm.dept,
          salary:      approvalForm.salary,
          businessDir: approvalForm.businessDir,
          start:       "",
          personal:    { ...approvalForm },
          education:   approvalForm.education,
          experience:  approvalForm.experience,
          relatives:   approvalForm.relatives,
          decisions: { recruiter: "approved", do: null, business: null, usot: null, hr_dir: null, do_date: null, uap: null },
        }
      : {
          id: `HR-00${requests.length + 4}`,
          title: svc.title, status: "sent",
          sla: svc.sla, date: new Date().toLocaleDateString("ru-RU"),
          icon: svc.icon,
        };
    setRequests(prev => [newReq, ...prev]);
    setSubmitted(true);
  }

  function resetForm() {
    setSelected(null);
    setForm({ name: "", dept: "", comment: "" });
    setApprovalTab("personal");
    setCvLoaded(false);
    setApprovalForm({
      lastName: "", firstName: "", patronymic: "", dob: "", iin: "",
      passportNo: "", passportIssued: "", passportExpiry: "",
      position: "", dept: "", salary: "", businessDir: "",
      education:  [{ institution: "", degree: "", year: "" }],
      experience: [{ company: "", role: "", period: "", duties: "" }],
      relatives:  [{ lastName: "", firstName: "", patronymic: "", relation: "", address: "", workplace: "", iin: "", phone: "" }],
    });
    setSubmitted(false);
  }

  // ── Layout shell ────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: C.bg }}>

      {/* Sidebar */}
      <div style={{ width: sideW, background: C.dark, display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 2, marginBottom: 4 }}>HALYK BANK</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.white, lineHeight: 1.2 }}>HR Service<br/>Portal</div>
        </div>
        <div style={{ height: 1, background: "#FFFFFF18", margin: "0 16px" }} />

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setDetail(null); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: page === n.id ? C.green + "30" : "transparent",
              color: page === n.id ? C.white : "#FFFFFF99",
              fontSize: 13, fontWeight: page === n.id ? 600 : 400,
              cursor: "pointer", fontFamily: "inherit", marginBottom: 2, transition: "all .15s",
              borderLeft: page === n.id ? `3px solid ${C.green}` : "3px solid transparent"
            }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #FFFFFF18" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: C.white, fontWeight: 700, marginBottom: 6 }}>Ф</div>
          <div style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Фируза</div>
          <div style={{ fontSize: 11, color: "#FFFFFF60" }}>ДУП · HR Specialist</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: sideW, flex: 1, padding: "32px 36px", maxWidth: "calc(100vw - 200px)" }}>

        {/* ── HOME ── */}
        {page === "home" && !selected && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, margin: 0 }}>Добро пожаловать 👋</h1>
              <p style={{ color: C.gray500, marginTop: 6, fontSize: 14 }}>Здесь вы можете подать любую HR-заявку и отследить её статус</p>
            </div>

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
              {SERVICES.slice(0,4).map(s => (
                <div key={s.id} onClick={() => { setSelected(s); setPage("form"); }}
                  style={{ background: C.white, border: `1px solid ${C.gray300}`,
                    borderRadius: 12, padding: "18px 16px", cursor: "pointer",
                    transition: "box-shadow .15s", boxShadow: "0 1px 4px #0000000A" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>SLA: {s.sla}</div>
                  <div style={{ height: 2, background: C.green, borderRadius: 2, marginTop: 12, width: 32 }} />
                </div>
              ))}
            </div>

            {/* Recent requests */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>Последние заявки</h2>
              <Btn variant="ghost" small onClick={() => setPage("my")}>Все заявки →</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {requests.slice(0,3).map(r => (
                <div key={r.id} onClick={() => { setDetail(r); setPage("my"); }}
                  style={{ background: C.white, border: `1px solid ${C.gray300}`,
                    borderRadius: 10, padding: "14px 18px", display: "flex",
                    alignItems: "center", gap: 14, cursor: "pointer",
                    boxShadow: "0 1px 3px #0000000A" }}>
                  <span style={{ fontSize: 22 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: C.gray500 }}>{r.id} · {r.date}</div>
                  </div>
                  <Badge text={STATUSES[r.status]} color={STATUS_COLOR[r.status]} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CATALOG ── */}
        {page === "catalog" && !selected && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.dark, margin: 0 }}>Каталог HR-сервисов</h1>
              <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>Выберите нужную услугу и подайте заявку</p>
            </div>

            {/* Search + filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍  Поиск сервиса..."
                style={{ flex: 1, minWidth: 200, border: `1px solid ${C.gray300}`,
                  borderRadius: 8, padding: "8px 14px", fontSize: 13,
                  fontFamily: "inherit", color: C.dark, outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["Все", ...CATS].map(c => (
                <Pill key={c} text={c} active={catFilter === c} onClick={() => setCatFilter(c)} />
              ))}
            </div>

            {/* Service cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {filteredServices.map(s => (
                <div key={s.id} style={{
                  background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12,
                  padding: "20px", cursor: "pointer", transition: "box-shadow .15s",
                  boxShadow: "0 1px 4px #0000000A", display: "flex", flexDirection: "column"
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
                  <div style={{ height: 3, background: C.green, borderRadius: 2, marginBottom: 14 }} />
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{s.cat}</div>
                  <div style={{ fontSize: 16, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: C.gray500, flex: 1, marginBottom: 14 }}>{s.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.gray500 }}>⏱ {s.sla}</span>
                    <Btn small onClick={() => { setSelected(s); setPage("form"); }}>Подать заявку</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {page === "form" && selected && !submitted && (
          <div style={{ maxWidth: 580 }}>
            <button onClick={() => { setSelected(null); setPage("catalog"); }}
              style={{ background: "none", border: "none", color: C.green, fontSize: 13,
                cursor: "pointer", marginBottom: 20, padding: 0, fontFamily: "inherit" }}>
              ← Назад в каталог
            </button>

            {/* Service info card */}
            <div style={{ background: C.greenPale, border: `1px solid ${C.green}30`,
              borderRadius: 12, padding: "16px 20px", marginBottom: 24,
              display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 28 }}>{selected.icon}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{selected.title}</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{selected.desc}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <Badge text={`SLA: ${selected.sla}`} />
                  <Badge text={selected.who} color={C.gray500} />
                </div>
              </div>
            </div>

            {selected.isApproval ? (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 4px" }}>Анкета кандидата</h2>
                <p style={{ fontSize: 13, color: C.gray500, marginBottom: 16 }}>Маршрут: Рекрутер → ДО → Рук. направления → Спец. УСОТ → Директор HR ГБ → ДО (дата) → УАП ГБ</p>

                {/* Вкладки */}
                {(() => {
                  const TABS = [
                    { id: "personal",    label: "👤 Личные данные" },
                    { id: "vacancy",     label: "💼 Вакансия" },
                    { id: "cv",          label: "📄 Резюме" },
                    { id: "relatives",   label: "👨‍👩‍👧 Родственники" },
                  ];
                  const af = approvalForm;
                  const setAf = setApprovalForm;

                  const tabStyle = (id) => ({
                    padding: "8px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                    border: "none", borderBottom: approvalTab === id ? `2px solid ${C.green}` : "2px solid transparent",
                    background: "transparent", color: approvalTab === id ? C.green : C.gray500,
                    fontWeight: approvalTab === id ? 700 : 400,
                  });

                  const fieldRow = (label, value, key, placeholder) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.gray500, marginBottom: 3 }}>{label}</label>
                      <input value={value} onChange={e => setAf(p => ({...p, [key]: e.target.value}))} placeholder={placeholder}
                        style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 8,
                          padding: "8px 12px", fontSize: 13, fontFamily: "inherit", color: C.dark, outline: "none" }} />
                    </div>
                  );

                  return (
                    <>
                      {/* Tab bar */}
                      <div style={{ display: "flex", borderBottom: `1px solid ${C.gray300}`, marginBottom: 20, overflowX: "auto" }}>
                        {TABS.map(t => <button key={t.id} style={tabStyle(t.id)} onClick={() => setApprovalTab(t.id)}>{t.label}</button>)}
                      </div>

                      {/* ── TAB: Личные данные ── */}
                      {approvalTab === "personal" && (
                        <div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                            {fieldRow("Фамилия *",   af.lastName,   "lastName",   "Сейткали")}
                            {fieldRow("Имя *",        af.firstName,  "firstName",  "Алия")}
                            {fieldRow("Отчество",     af.patronymic, "patronymic", "Маратовна")}
                            {fieldRow("Дата рождения", af.dob,       "dob",        "15.03.1992")}
                            {fieldRow("ИИН *",        af.iin,        "iin",        "920315401234")}
                            {fieldRow("№ паспорта",   af.passportNo, "passportNo", "N12345678")}
                            {fieldRow("Дата выдачи",  af.passportIssued, "passportIssued", "10.05.2018")}
                            {fieldRow("Срок действия", af.passportExpiry, "passportExpiry", "10.05.2028")}
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                            <Btn small onClick={() => setApprovalTab("vacancy")}>Далее: Вакансия →</Btn>
                          </div>
                        </div>
                      )}

                      {/* ── TAB: Вакансия ── */}
                      {approvalTab === "vacancy" && (
                        <div>
                          {fieldRow("Должность / Вакансия *", af.position, "position", "Senior Product Manager")}
                          {fieldRow("Подразделение ДО *",      af.dept,     "dept",     "Цифровой бизнес")}
                          {fieldRow("Оффер (зарплата)",         af.salary,   "salary",   "850 000 ₸")}
                          <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.gray500, marginBottom: 6 }}>Направление согласования *</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {BUSINESS_DIRS.map(d => (
                                <button key={d} onClick={() => setAf(p => ({...p, businessDir: d}))}
                                  style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                                    border: `1px solid ${af.businessDir === d ? C.green : C.gray300}`,
                                    background: af.businessDir === d ? C.green : C.white,
                                    color: af.businessDir === d ? C.white : C.gray700,
                                    fontFamily: "inherit", fontWeight: af.businessDir === d ? 700 : 400 }}>{d}</button>
                              ))}
                            </div>
                            <div style={{ fontSize: 11, color: C.gray500, marginTop: 6 }}>Дата выхода устанавливается в ДО после согласования</div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Btn small variant="ghost" onClick={() => setApprovalTab("personal")}>← Назад</Btn>
                            <Btn small onClick={() => setApprovalTab("cv")}>Далее: Резюме →</Btn>
                          </div>
                        </div>
                      )}

                      {/* ── TAB: Резюме ── */}
                      {approvalTab === "cv" && (
                        <div>
                          {/* Загрузка резюме */}
                          <div style={{ border: `2px dashed ${C.gray300}`, borderRadius: 12, padding: "20px", textAlign: "center", marginBottom: 20,
                            background: cvLoaded ? C.greenPale : C.white, borderColor: cvLoaded ? C.green : C.gray300 }}>
                            {cvLoaded ? (
                              <div>
                                <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Резюме загружено — данные заполнены автоматически</div>
                                <div style={{ fontSize: 11, color: C.gray500, marginTop: 4 }}>Образование и опыт работы подтянуты из файла</div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                                <div style={{ fontSize: 13, color: C.gray700, marginBottom: 12 }}>Загрузите резюме — образование и опыт заполнятся автоматически</div>
                                <Btn small onClick={() => {
                                  setCvLoaded(true);
                                  setAf(p => ({...p,
                                    education: [
                                      { institution: "КазНУ им. аль-Фараби", degree: "Магистр менеджмента", year: "2015" },
                                      { institution: "Университет КИМЭП", degree: "Бакалавр экономики", year: "2013" },
                                    ],
                                    experience: [
                                      { company: "Kaspi Bank", role: "Product Manager", period: "2019–2024", duties: "Запуск мобильных продуктов, рост MAU" },
                                      { company: "Kolesa Group", role: "Analyst", period: "2015–2019", duties: "Аналитика данных, A/B тесты" },
                                    ],
                                  }));
                                }}>📎 Загрузить резюме (PDF/DOCX)</Btn>
                                <div style={{ fontSize: 11, color: C.gray500, marginTop: 8 }}>В будущем — интеграция с eGov для автозаполнения данных</div>
                              </div>
                            )}
                          </div>

                          {/* Образование */}
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>Образование</div>
                              <Btn small variant="ghost" onClick={() => setAf(p => ({...p, education: [...p.education, { institution: "", degree: "", year: "" }]}))}>+ Добавить</Btn>
                            </div>
                            {af.education.map((edu, i) => (
                              <div key={i} style={{ background: C.gray100, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "grid", gridTemplateColumns: "2fr 1fr 80px", gap: 8, alignItems: "end" }}>
                                <div>
                                  <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>Учебное заведение</div>
                                  <input value={edu.institution} onChange={e => setAf(p => { const ed=[...p.education]; ed[i]={...ed[i],institution:e.target.value}; return {...p,education:ed}; })}
                                    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>Степень</div>
                                  <input value={edu.degree} onChange={e => setAf(p => { const ed=[...p.education]; ed[i]={...ed[i],degree:e.target.value}; return {...p,education:ed}; })}
                                    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>Год</div>
                                  <input value={edu.year} onChange={e => setAf(p => { const ed=[...p.education]; ed[i]={...ed[i],year:e.target.value}; return {...p,education:ed}; })}
                                    style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Опыт работы */}
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>Опыт работы</div>
                              <Btn small variant="ghost" onClick={() => setAf(p => ({...p, experience: [...p.experience, { company: "", role: "", period: "", duties: "" }]}))}>+ Добавить</Btn>
                            </div>
                            {af.experience.map((exp, i) => (
                              <div key={i} style={{ background: C.gray100, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                                  {[["Компания","company","Kaspi Bank"],["Должность","role","Product Manager"],["Период","period","2019–2024"]].map(([lbl,key,ph]) => (
                                    <div key={key}>
                                      <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>{lbl}</div>
                                      <input value={exp[key]} onChange={e => setAf(p => { const ex=[...p.experience]; ex[i]={...ex[i],[key]:e.target.value}; return {...p,experience:ex}; })}
                                        placeholder={ph} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>Обязанности</div>
                                  <input value={exp.duties} onChange={e => setAf(p => { const ex=[...p.experience]; ex[i]={...ex[i],duties:e.target.value}; return {...p,experience:ex}; })}
                                    placeholder="Основные задачи и достижения" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Btn small variant="ghost" onClick={() => setApprovalTab("vacancy")}>← Назад</Btn>
                            <Btn small onClick={() => setApprovalTab("relatives")}>Далее: Родственники →</Btn>
                          </div>
                        </div>
                      )}

                      {/* ── TAB: Родственники ── */}
                      {approvalTab === "relatives" && (
                        <div>
                          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#1E40AF" }}>
                            🔮 <b>В разработке:</b> интеграция с eGov API — данные родственников будут подтягиваться по ИИН кандидата автоматически. Сейчас заполняется вручную.
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>Сведения о родственниках</div>
                            <Btn small variant="ghost" onClick={() => setAf(p => ({...p, relatives: [...p.relatives, { lastName: "", firstName: "", patronymic: "", relation: "", address: "", workplace: "", iin: "", phone: "" }]}))}>+ Добавить</Btn>
                          </div>
                          {af.relatives.map((rel, i) => (
                            <div key={i} style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>Родственник {i + 1}</div>
                                {af.relatives.length > 1 && (
                                  <button onClick={() => setAf(p => ({...p, relatives: p.relatives.filter((_,j)=>j!==i)}))}
                                    style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕ Удалить</button>
                                )}
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                                {[["Фамилия","lastName","Иванов"],["Имя","firstName","Иван"],["Отчество","patronymic","Иванович"]].map(([lbl,key,ph]) => (
                                  <div key={key}>
                                    <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>{lbl}</div>
                                    <input value={rel[key]} onChange={e => setAf(p => { const r=[...p.relatives]; r[i]={...r[i],[key]:e.target.value}; return {...p,relatives:r}; })}
                                      placeholder={ph} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                                <div>
                                  <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>Степень родства</div>
                                  <select value={rel.relation} onChange={e => setAf(p => { const r=[...p.relatives]; r[i]={...r[i],relation:e.target.value}; return {...p,relatives:r}; })}
                                    style={{ width: "100%", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit", background: C.white }}>
                                    <option value="">Выберите...</option>
                                    {["Отец","Мать","Брат","Сестра","Сын","Дочь","Супруг","Супруга","Дедушка","Бабушка"].map(r=><option key={r} value={r}>{r}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>ИИН родственника</div>
                                  <input value={rel.iin} onChange={e => setAf(p => { const r=[...p.relatives]; r[i]={...r[i],iin:e.target.value}; return {...p,relatives:r}; })}
                                    placeholder="620510301234" style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                </div>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                {[["Место проживания","address","г. Алматы, ул. Абая 12"],["Место работы","workplace","АО Казмунайгаз"],["Телефон","phone","+7 701 000 0001"]].map(([lbl,key,ph]) => (
                                  <div key={key} style={key==="address"?{gridColumn:"1/-1"}:{}}>
                                    <div style={{ fontSize: 10, color: C.gray500, marginBottom: 3 }}>{lbl}</div>
                                    <input value={rel[key]} onChange={e => setAf(p => { const r=[...p.relatives]; r[i]={...r[i],[key]:e.target.value}; return {...p,relatives:r}; })}
                                      placeholder={ph} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`, borderRadius: 6, padding: "6px 10px", fontSize: 12, fontFamily: "inherit" }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <Btn small variant="ghost" onClick={() => setApprovalTab("cv")}>← Назад</Btn>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>Заполните заявку</h2>
                <Input label="Ваше имя и фамилия" value={form.name} onChange={v => setForm(p => ({...p, name: v}))} placeholder="Иванов Иван Иванович" />
                <Input label="Подразделение" value={form.dept} onChange={v => setForm(p => ({...p, dept: v}))} placeholder="Департамент управления персоналом" />
                {selected.docs !== "Не требуются" && (
                  <div style={{ background: C.gray100, border: `1px solid ${C.gray300}`,
                    borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: C.gray700 }}>
                    📎 <b>Необходимые документы:</b> {selected.docs}
                  </div>
                )}
                <Input label="Комментарий (необязательно)" value={form.comment} onChange={v => setForm(p => ({...p, comment: v}))}
                  placeholder="Укажите любые дополнительные детали..." multiline />
              </>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Btn onClick={submitRequest} variant="primary">Отправить заявку</Btn>
              <Btn onClick={resetForm} variant="ghost">Отмена</Btn>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {page === "form" && submitted && (
          <div style={{ maxWidth: 500, textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Заявка отправлена</h2>
            <p style={{ color: C.gray500, fontSize: 14, marginBottom: 24 }}>
              Вашу заявку <b>«{selected?.title}»</b> получил HR Service Center.<br />
              Мы уведомим вас при изменении статуса. SLA: {selected?.sla}.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn onClick={() => { resetForm(); setPage("my"); }}>Мои заявки</Btn>
              <Btn variant="ghost" onClick={() => { resetForm(); setPage("catalog"); }}>В каталог</Btn>
            </div>
          </div>
        )}

        {/* ── MY REQUESTS ── */}
        {page === "my" && !detail && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.dark, margin: 0 }}>Мои заявки</h1>
              <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>История всех ваших обращений в HR Service Center</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {requests.map(r => (
                <div key={r.id} onClick={() => setDetail(r)}
                  style={{ background: C.white, border: `1px solid ${C.gray300}`,
                    borderRadius: 12, padding: "16px 20px", cursor: "pointer",
                    boxShadow: "0 1px 4px #0000000A", transition: "box-shadow .15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px #0000001A"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenPale,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{r.id} · Подана {r.date} · SLA {r.sla}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Badge text={STATUSES[r.status]} color={STATUS_COLOR[r.status]} />
                      <span style={{ color: C.gray300, fontSize: 16 }}>›</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {requests.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: C.gray500 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Заявок пока нет</div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>Подайте первую заявку через каталог</div>
                <Btn onClick={() => setPage("catalog")}>Открыть каталог</Btn>
              </div>
            )}
          </div>
        )}

        {/* ── REQUEST DETAIL ── */}
        {page === "my" && detail && (
          <div style={{ maxWidth: 640 }}>
            <button onClick={() => setDetail(null)}
              style={{ background: "none", border: "none", color: C.green, fontSize: 13,
                cursor: "pointer", marginBottom: 20, padding: 0, fontFamily: "inherit" }}>
              ← Все заявки
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: C.greenPale,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{detail.icon}</div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: C.dark, margin: 0 }}>{detail.title}</h1>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 3 }}>{detail.id} · Подана {detail.date}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Badge text={STATUSES[detail.status]} color={STATUS_COLOR[detail.status]} />
              </div>
            </div>

            {/* Специальный блок для согласования кандидата */}
            {detail.isApproval && detail.decisions && (
              <>
                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Статус согласования</h3>
                  <ApprovalBar decisions={detail.decisions} businessDir={detail.businessDir} />
                </div>

                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 }}>Кандидат</h3>
                  {[
                    ["ФИО кандидата",        detail.candidate],
                    ["Вакансия",              detail.position],
                    ["Подразделение ДО",      detail.dept],
                    ["Оффер",                 detail.salary],
                    ["Направление",           detail.businessDir],
                    ["Дата выхода",           detail.start || "Устанавливается в ДО после согласования"],
                    ["Номер заявки",          detail.id],
                    ["Дата подачи",           detail.date],
                    ["SLA",                   detail.sla],
                  ].map(([k, v]) => v && (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between",
                      padding: "8px 0", borderBottom: `1px solid ${C.gray100}`, fontSize: 13 }}>
                      <span style={{ color: C.gray500 }}>{k}</span>
                      <span style={{ color: C.dark, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Стандартный workflow для остальных заявок */}
            {!detail.isApproval && (
              <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Прогресс</h3>
                <WorkflowBar status={detail.status} />
              </div>
            )}

            {!detail.isApproval && (
              <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 }}>Детали</h3>
                {[
                  ["Номер заявки", detail.id],
                  ["Дата подачи", detail.date],
                  ["SLA", detail.sla],
                  ["Статус", STATUSES[detail.status]],
                  ["Исполнитель", "HR Service Center"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between",
                    padding: "8px 0", borderBottom: `1px solid ${C.gray100}`, fontSize: 13 }}>
                    <span style={{ color: C.gray500 }}>{k}</span>
                    <span style={{ color: C.dark, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Комментарии</h3>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.green,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: C.white, fontWeight: 700, flexShrink: 0 }}>HR</div>
                <div style={{ background: C.gray100, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.gray700 }}>
                  {detail.isApproval
                    ? "Заявка передана на согласование в ДО. После прохождения всех этапов УАП создаст приказ о приёме."
                    : "Заявка принята в работу. Ожидайте уведомления."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {page === "analytics" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.dark, margin: 0 }}>Аналитика</h1>
              <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>HR Service Center · Июнь 2026</p>
            </div>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
              {ANALYTICS.map(a => (
                <div key={a.label} style={{ background: C.white, border: `1px solid ${C.gray300}`,
                  borderRadius: 12, padding: "20px 18px", boxShadow: "0 1px 4px #0000000A" }}>
                  <div style={{ height: 3, background: a.color, borderRadius: 2, marginBottom: 14 }} />
                  <div style={{ fontSize: 28, fontWeight: 800, color: a.color, marginBottom: 4 }}>{a.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 2 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: C.gray500 }}>{a.sub}</div>
                </div>
              ))}
            </div>

            {/* Top services */}
            <div style={{ background: C.white, border: `1px solid ${C.gray300}`,
              borderRadius: 12, padding: "20px 24px" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: "0 0 18px" }}>Топ-5 сервисов</h3>
              {TOP_SERVICES.map(t => (
                <div key={t.title} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: C.gray700 }}>{t.title}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{t.count}</span>
                  </div>
                  <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${t.pct}%`, background: C.green, borderRadius: 3, transition: "width .4s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
