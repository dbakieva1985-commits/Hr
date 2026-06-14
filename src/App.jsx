import { useState } from "react";
const _v = "2.2";
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
  { id: 9, cat: "Подбор персонала",  icon: "✅", title: "Согласование кандидата",       sla: "2 раб. дня",  desc: "Согласование финального кандидата на вакансию: руководитель → HR → директор. Фиксация оффера и старта.", who: "Руководитель подразделения", docs: "Резюме кандидата, условия оффера", isApproval: true },
  { id: 10, cat: "Онбординг", icon: "🎉", title: "Онбординг нового сотрудника",   sla: "1 раб. день", desc: "Запуск персонального трека адаптации: Pre-boarding → День 1 → Месяц 1 → Месяц 3. Задачи, документы, цели на ИС.", who: "HR-менеджер", docs: "Не требуются", isOnboarding: true },
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
  { id: "recruiter", label: "Рекрутер",             sub: "ДО → запускает процесс",       icon: "🚀", org: "ДО"  },
  { id: "do",        label: "Согласование ДО",      sub: "Дочерняя организация",          icon: "🏛", org: "ДО"  },
  { id: "business",  label: "Рук. направления ГБ",  sub: "Зампред / МСБ / РБ / Без-ть",  icon: "⭐", org: "ГБ"  },
  { id: "usot",      label: "Спец. УСОТ ГБ",        sub: "Специалист УСОТ ГБ",            icon: "👤", org: "ГБ"  },
  { id: "hr_dir",    label: "HRD ГБ",               sub: "Директор HR ГБ",                icon: "👔", org: "ГБ"  },
  { id: "do_date",   label: "ДО: дата выхода",      sub: "Возврат в ДО, ставят дату",     icon: "📅", org: "ДО"  },
  { id: "uap",       label: "УАП ГБ",               sub: "Приказ о приёме",               icon: "📋", org: "ГБ"  },
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
    <div style={{ display: "flex", alignItems: "flex-start", minWidth: 620, margin: "16px 0" }}>
      {APPROVAL_STAGES.map((st, i) => {
        const dec = decisions[st.id];
        const isActive = !dec && APPROVAL_STAGES.slice(0, i).every(s => decisions[s.id] === "approved");
        const bg = dec === "approved" ? C.green : dec === "rejected" ? C.red : isActive ? C.orange : C.gray300;
        const statusLabel = dec === "approved" ? "✓ Одобрено" : dec === "rejected" ? "✗ Отклонено" : isActive ? "● Активно" : "Ожидает";
        const subLabel = st.id === "business" && businessDir ? businessDir : st.sub;
        const orgColor = st.org === "ГБ" ? C.blue : C.green;
        return (
          <div key={st.id} style={{ display: "flex", alignItems: "flex-start", flex: i < APPROVAL_STAGES.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 84 }}>
              {/* Плашка ГБ / ДО */}
              <div style={{ fontSize: 8, fontWeight: 800, color: orgColor, background: orgColor + "15",
                border: `1px solid ${orgColor}40`, borderRadius: 4, padding: "1px 6px", marginBottom: 4, letterSpacing: 0.5 }}>
                {st.org}
              </div>
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
              <div style={{ flex: 1, height: 2, background: dec === "approved" ? C.green : C.gray300, margin: "27px 2px 0", flexShrink: 0 }} />
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
  { id: "onboarding",icon: "🎉", label: "Онбординг" },
  { id: "analytics", icon: "📊", label: "Аналитика" },
];

// ── Onboarding data ─────────────────────────────────────────────────────────
const OB_PHASES = [
  { id: "pre",    label: "Pre-boarding", sub: "До выхода",   icon: "📨" },
  { id: "week1",  label: "День 1–7",     sub: "Неделя 1",    icon: "🚀" },
  { id: "month1", label: "Месяц 1",      sub: "День 8–30",   icon: "📚" },
  { id: "month3", label: "Месяцы 2–3",   sub: "День 31–90",  icon: "🎯" },
];

const OB_TASKS_INIT = [
  // Pre-boarding
  { id:1, phase:"pre",   title:"Получить welcome-письмо",                          who:"Сотрудник", done:true  },
  { id:2, phase:"pre",   title:"Загрузить фото для пропуска",                      who:"Сотрудник", done:true  },
  { id:3, phase:"pre",   title:"Загрузить копии документов (уд-ние, ИИН, диплом)", who:"Сотрудник", done:true  },
  { id:4, phase:"pre",   title:"Заполнить анкету нового сотрудника",               who:"Сотрудник", done:false },
  { id:5, phase:"pre",   title:"Ознакомиться с welcome-пакетом",                   who:"Сотрудник", done:false },
  // День 1
  { id:6,  phase:"week1", title:"Пройти знакомство с СБ / инструктаж", who:"Сотрудник", done:false, info:"Служба безопасности проводит инструктаж в первый рабочий день" },
  { id:7,  phase:"week1", title:"Встретиться с руководителем",          who:"Сотрудник", done:false, isManagerMeeting:true },
  { id:8,  phase:"week1", title:"Встретиться с наставником",            who:"Сотрудник", done:false },
  { id:9,  phase:"week1", title:"Получить рабочую технику",             who:"Сотрудник / ИТ", done:false, instruction:"Обратитесь к ответственному за рабочие места в вашем офисе с заявкой от HR" },
  { id:10, phase:"week1", title:"Получить IT-доступы",                  who:"Сотрудник / ИТ", done:false, instruction:"Доступы предоставляются через корпоративный портал ИТ-службы после получения приказа о приёме" },
  { id:11, phase:"week1", title:"Познакомиться с командой (1:1)",       who:"Сотрудник",      done:false },
  { id:12, phase:"week1", title:"Подписать трудовой договор и политики",who:"Сотрудник + HR", done:false },
  { id:13, phase:"week1", title:"Оформить пропуск",                     who:"HR",             done:false },
  // Месяц 1
  { id:14, phase:"month1", title:"Пройти обучение Compliance / AML / ИБ",  who:"Сотрудник",     done:false },
  { id:15, phase:"month1", title:"Ознакомиться с процессами подразделения", who:"Сотрудник",     done:false },
  { id:16, phase:"month1", title:"Check-in встреча с HR на 30-й день",      who:"HR + сотрудник", done:false },
  // Месяц 2-3
  { id:17, phase:"month3", title:"Заполнить опрос адаптации (2 мес.)",        who:"Сотрудник",          done:false, isSurvey:true },
  { id:18, phase:"month3", title:"Встреча 1:1 с руководителем (2-й месяц)",   who:"Рук-ль + сотрудник", done:false },
  { id:19, phase:"month3", title:"Check-in встреча с HR (90 дней)",            who:"HR + сотрудник",     done:false },
  { id:20, phase:"month3", title:"Встреча 1:1 с руководителем (3-й месяц)",   who:"Рук-ль + сотрудник", done:false },
  { id:21, phase:"month3", title:"Финальная оценка по итогам ИС",             who:"Рук-ль",             done:false },
  { id:22, phase:"month3", title:"Решение по ИС: принят / продлён / расстались", who:"Рук-ль + HR",     done:false },
];

const OB_MANAGER_TASKS_INIT = [
  { id:"m1", phase:"pre",    title:"Заказать орг. технику для нового сотрудника", sub:"За 1–3 дня до выхода",                done:false },
  { id:"m2", phase:"pre",    title:"Запросить IT-доступы для нового сотрудника",  sub:"Через портал ИТ-службы",              done:false },
  { id:"m3", phase:"week1",  title:"Познакомить с отделом / департаментом",       sub:"День 1",                              done:false },
  { id:"m4", phase:"week1",  title:"Познакомить с наставником",                   sub:"День 1",                              done:false },
  { id:"m5", phase:"week1",  title:"Поставить цели на испытательный срок",        sub:"Открывает редактор целей",            done:false, isGoals:true },
  { id:"m6", phase:"month3", title:"Встреча 1:1 с сотрудником (2-й месяц)",       sub:"~60-й день",                           done:false },
  { id:"m7", phase:"month3", title:"Заполнить опрос адаптации от HR",             sub:"На 60-й день",                         done:false, isSurvey:true },
  { id:"m8", phase:"month3", title:"Встреча 1:1 с сотрудником (3-й месяц)",       sub:"~90-й день",                           done:false },
  { id:"m9", phase:"month3", title:"Провести оценку по целям ИС",                 sub:"На 90-й день",                         done:false },
  { id:"m10",phase:"month3", title:"Принять решение по ИС",                       sub:"Продолжаем / продлеваем / расстаёмся", done:false },
];

const OB_MENTOR_TASKS_INIT = [
  { id:"me1", phase:"pre",    title:"Получить briefing от HR о новом сотруднике", done:false },
  { id:"me2", phase:"week1",  title:"Встретиться с новым сотрудником в День 1",   done:false },
  { id:"me3", phase:"week1",  title:"Провести экскурсию по офису",                done:false },
  { id:"me4", phase:"week1",  title:"Объяснить процессы отдела и договориться о регулярных встречах", done:false },
  { id:"me5", phase:"month3", title:"Заполнить опрос наставника от HR",           done:false, isSurvey:true },
];

const OB_GOALS_INIT = [
  { id:1, text:"Изучить внутренние процессы и регламенты подразделения", done:false },
  { id:2, text:"Наладить коммуникацию с командой и смежными отделами",  done:false },
  { id:3, text:"Выполнить первое самостоятельное задание",              done:false },
];

const SURVEY_MANAGER = [
  { id:"q1", q:"Как вы оцениваете прогресс адаптации сотрудника?",    opts:["Отлично 🟢","Хорошо","Средне","Плохо 🔴"] },
  { id:"q2", q:"Продолжаем работу с сотрудником?",                    opts:["Да, всё отлично","Есть вопросы, продолжаем","Скорее расстанемся","Нужно искать снова"] },
  { id:"q3", q:"Нужна ли дополнительная поддержка HR?",               opts:["Нет","Да, прошу связаться"] },
];
const SURVEY_EMPLOYEE = [
  { id:"q1", q:"Как вы оцениваете первые два месяца?",                opts:["Очень хорошо 🟢","Хорошо","Сложно","Очень сложно 🔴"] },
  { id:"q2", q:"Чувствуете ли поддержку от команды?",                opts:["Полностью да","В целом да","Не всегда","Нет"] },
  { id:"q3", q:"Понятны ли цели испытательного срока?",              opts:["Да, полностью","В основном да","Не совсем","Нет"] },
];
const SURVEY_MENTOR = [
  { id:"q1", q:"Как вы оцениваете прогресс нового сотрудника?",      opts:["Отлично 🟢","Хорошо","Средне","Сложно 🔴"] },
  { id:"q2", q:"Есть ли трудности с адаптацией?",                    opts:["Нет, всё хорошо","Небольшие вопросы","Есть сложности"] },
  { id:"q3", q:"Рекомендуете продолжить испытательный срок?",        opts:["Да","Нет"] },
];

const OB_DOCS_INIT = [
  { id:1, name:"Удостоверение личности",  status:"verified" },
  { id:2, name:"ИИН — свидетельство",     status:"verified" },
  { id:3, name:"Диплом об образовании",   status:"pending"  },
  { id:4, name:"Фото для пропуска",       status:"pending"  },
  { id:5, name:"Трудовой договор",        status:"waiting"  },
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
  const [currentRole, setCurrentRole] = useState("recruiter");
  const [obTasks, setObTasks]   = useState(OB_TASKS_INIT);
  const [obDocs,  setObDocs]    = useState(OB_DOCS_INIT);
  const [obPhase, setObPhase]   = useState("week1");
  const [obView,  setObView]    = useState("employee"); // employee | manager | mentor | hr
  const [obManagerTasks, setObManagerTasks] = useState(OB_MANAGER_TASKS_INIT);
  const [obMentorTasks,  setObMentorTasks]  = useState(OB_MENTOR_TASKS_INIT);
  const [obGoals,        setObGoals]        = useState(OB_GOALS_INIT);
  const [obSurveys,      setObSurveys]      = useState({ employee:{}, manager:{}, mentor:{} });
  const [newGoalText,    setNewGoalText]    = useState("");
  const [page, setPage] = useState("home");
  const [catFilter, setCatFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);   // service being applied to
  const [form, setForm] = useState({ name: "", dept: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [cvLoaded,    setCvLoaded]      = useState(false);
  const [approvalTab, setApprovalTab]   = useState("personal");
  const [recruitForm, setRecruitForm]   = useState({
    position: "", management: "", department: "",
    education: "", experience: "", skills: "", comment: "",
  });
  const [approvalForm, setApprovalForm] = useState({
    // Личные данные
    lastName: "", firstName: "", patronymic: "", dob: "", iin: "",
    passportNo: "", passportIssued: "", passportExpiry: "",
    // Вакансия / оффер
    position: "", dept: "", salary: "", businessDir: "", org: "ГБ",
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
      salary: "850 000 ₸", start: "", businessDir: "МСБ", org: "ГБ",
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
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  useState(() => {
    if(typeof window === "undefined") return;
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  });

  const sideW = isMobile ? 0 : 200;

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
          org:         approvalForm.org,
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
      position: "", dept: "", salary: "", businessDir: "", org: "ГБ",
      education:  [{ institution: "", degree: "", year: "" }],
      experience: [{ company: "", role: "", period: "", duties: "" }],
      relatives:  [{ lastName: "", firstName: "", patronymic: "", relation: "", address: "", workplace: "", iin: "", phone: "" }],
    });
    setRecruitForm({ position: "", management: "", department: "", education: "", experience: "", skills: "", comment: "" });
    setSubmitted(false);
  }

  // ── Layout shell ────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: C.bg }}>

      {/* Sidebar — desktop only */}
      <div style={{ width: sideW, background: C.dark, display: isMobile ? "none" : "flex", flexDirection: "column",
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

        {/* Role switcher */}
        {(() => {
          const ROLES = [
            { id: "recruiter", label: "Рекрутер",          org: "ДО" },
            { id: "do",        label: "Рук-ль ДО",         org: "ДО" },
            { id: "business",  label: "Рук. направления",  org: "ГБ" },
            { id: "usot",      label: "Спец. УСОТ",        org: "ГБ" },
            { id: "hr_dir",    label: "HRD",               org: "ГБ" },
            { id: "do_date",   label: "Рук-ль ДО (дата)",  org: "ДО" },
            { id: "uap",       label: "УАП специалист",    org: "ГБ" },
          ];
          const cur = ROLES.find(r => r.id === currentRole) || ROLES[0];
          return (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #FFFFFF18" }}>
              <div style={{ fontSize: 9, color: "#FFFFFF60", fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Текущая роль</div>
              <select value={currentRole} onChange={e => setCurrentRole(e.target.value)}
                style={{ width: "100%", background: "#FFFFFF15", color: C.white, border: "1px solid #FFFFFF30",
                  borderRadius: 8, padding: "6px 10px", fontSize: 11, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                {ROLES.map(r => <option key={r.id} value={r.id} style={{ background: C.dark }}>{r.org} · {r.label}</option>)}
              </select>
              <div style={{ fontSize: 10, color: C.green, marginTop: 6, fontWeight: 600 }}>
                {cur.org === "ГБ" ? "🏦 Головной банк" : "🏢 Дочерняя организация"}
              </div>
            </div>
          );
        })()}

        {/* User */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #FFFFFF18" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.green,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: C.white, fontWeight: 700, marginBottom: 6 }}>Ф</div>
          <div style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Фируза</div>
          <div style={{ fontSize: 11, color: "#FFFFFF60" }}>ДУП · HR Specialist</div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, height:58, background:C.white,
          borderTop:`1px solid ${C.gray300}`, display:"flex", zIndex:200, boxShadow:"0 -2px 10px #0000000F" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setDetail(null); }} style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              background:"none", border:"none", cursor:"pointer", fontFamily:"inherit",
              color: page===n.id ? C.green : C.gray500, padding:"6px 0",
            }}>
              <span style={{ fontSize:20, lineHeight:1 }}>{n.icon}</span>
              <span style={{ fontSize:9, fontWeight: page===n.id ? 700 : 400, marginTop:3 }}>{n.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Mobile top header */}
      {isMobile && (
        <div style={{ position:"fixed", top:0, left:0, right:0, height:52, background:C.dark,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 16px", zIndex:200 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.green, letterSpacing:2 }}>HALYK BANK</div>
            <div style={{ fontSize:12, fontWeight:700, color:C.white }}>HR Service Portal</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <select value={currentRole} onChange={e => setCurrentRole(e.target.value)}
              style={{ background:"#FFFFFF15", color:C.white, border:"1px solid #FFFFFF30",
                borderRadius:6, padding:"4px 8px", fontSize:10, fontFamily:"inherit", cursor:"pointer", outline:"none" }}>
              {[
                { id:"recruiter", label:"Рекрутер ДО" },
                { id:"do",        label:"Рук-ль ДО" },
                { id:"business",  label:"Рук. напр. ГБ" },
                { id:"usot",      label:"УСОТ ГБ" },
                { id:"hr_dir",    label:"HRD ГБ" },
                { id:"do_date",   label:"ДО (дата)" },
                { id:"uap",       label:"УАП ГБ" },
              ].map(r => <option key={r.id} value={r.id} style={{ background:C.dark }}>{r.label}</option>)}
            </select>
            <div style={{ width:30, height:30, borderRadius:"50%", background:C.green,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:C.white, fontWeight:700 }}>Ф</div>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ marginLeft: sideW, flex: 1,
        padding: isMobile ? "68px 14px 74px" : "32px 36px",
        maxWidth: isMobile ? "100vw" : `calc(100vw - ${sideW}px)`,
        boxSizing: "border-box" }}>

        {/* ── HOME ── */}
        {page === "home" && !selected && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: C.dark, margin: 0 }}>Добро пожаловать 👋</h1>
              <p style={{ color: C.gray500, marginTop: 4, fontSize: isMobile ? 13 : 14 }}>Здесь вы можете подать любую HR-заявку и отследить её статус</p>
            </div>

            {/* Онбординг banner */}
            <div onClick={() => setPage("onboarding")} style={{ background:`linear-gradient(135deg, ${C.green}, ${C.greenMid})`, borderRadius:14, padding:"16px 22px", marginBottom:20, cursor:"pointer", color:C.white, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, marginBottom:2 }}>🎉 Трек онбординга нового сотрудника</div>
                <div style={{ fontSize:12, opacity:0.9 }}>Задачи, документы, адрес HR, схема проезда, парковка, цели ИС</div>
              </div>
              <div style={{ fontSize:22, marginLeft:16 }}>→</div>
            </div>

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
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
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(1,1fr)" : "repeat(3,1fr)", gap: isMobile ? 10 : 14 }}>
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
                    <Btn small onClick={() => { if(s.isOnboarding){ setPage("onboarding"); } else { setSelected(s); setPage("form"); } }}>
                      {s.isOnboarding ? "Открыть" : "Подать заявку"}
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {page === "form" && selected && !submitted && (
          <div style={{ maxWidth: isMobile ? "100%" : 580 }}>
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
                <p style={{ fontSize: 13, color: C.gray500, marginBottom: 16 }}>
                  Маршрут: <span style={{color:C.green,fontWeight:600}}>ДО</span> Рекрутер →{" "}
                  <span style={{color:C.green,fontWeight:600}}>ДО</span> →{" "}
                  <span style={{color:C.blue,fontWeight:600}}>ГБ</span> Рук. направления →{" "}
                  <span style={{color:C.blue,fontWeight:600}}>ГБ</span> Спец. УСОТ →{" "}
                  <span style={{color:C.blue,fontWeight:600}}>ГБ</span> HRD →{" "}
                  <span style={{color:C.green,fontWeight:600}}>ДО</span> дата выхода →{" "}
                  <span style={{color:C.blue,fontWeight:600}}>ГБ</span> УАП
                </p>

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
                          <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.gray500, marginBottom: 6 }}>Организация кандидата *</label>
                            <div style={{ display: "flex", gap: 10 }}>
                              {["ГБ","ДО"].map(o => (
                                <button key={o} onClick={() => setAf(p => ({...p, org: o}))}
                                  style={{ padding: "8px 24px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
                                    border: `2px solid ${af.org === o ? C.green : C.gray300}`,
                                    background: af.org === o ? C.green : C.white,
                                    color: af.org === o ? C.white : C.gray700 }}>{o}</button>
                              ))}
                            </div>
                            <div style={{ fontSize: 11, color: C.gray500, marginTop: 6 }}>
                              {af.org === "ГБ" ? "Головной Банк — адрес приёма: пр. Аль-Фараби, 40" : "Дочерняя организация — адрес будет указан ДО"}
                            </div>
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
            ) : selected.id === 4 ? (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 6px" }}>Заявка на подбор персонала</h2>
                <p style={{ fontSize: 13, color: C.gray500, marginBottom: 20 }}>Заполните требования — HR сформирует job description на основе ваших данных</p>

                {/* Позиция */}
                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Позиция</div>
                  <Input label="Должность *" value={recruitForm.position} onChange={v => setRecruitForm(p => ({...p, position: v}))} placeholder="Senior Product Manager" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Input label="Управление" value={recruitForm.management} onChange={v => setRecruitForm(p => ({...p, management: v}))} placeholder="Управление цифровых продуктов" />
                    <Input label="Департамент" value={recruitForm.department} onChange={v => setRecruitForm(p => ({...p, department: v}))} placeholder="Цифровой бизнес" />
                  </div>
                </div>

                {/* Требования */}
                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Требования к кандидату</div>
                  <Input label="Образование" value={recruitForm.education} onChange={v => setRecruitForm(p => ({...p, education: v}))}
                    placeholder="Высшее, финансы / IT / менеджмент" multiline />
                  <Input label="Опыт работы" value={recruitForm.experience} onChange={v => setRecruitForm(p => ({...p, experience: v}))}
                    placeholder="От 3 лет в банке или fintech. Опыт запуска продуктов..." multiline />
                  <Input label="Навыки и компетенции" value={recruitForm.skills} onChange={v => setRecruitForm(p => ({...p, skills: v}))}
                    placeholder="Product roadmap, Jira, работа с данными, английский B2..." multiline />
                </div>

                {/* Комментарий */}
                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px", marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Дополнительно</div>
                  <Input label="Комментарий для рекрутера" value={recruitForm.comment} onChange={v => setRecruitForm(p => ({...p, comment: v}))}
                    placeholder="Пожелания по личным качествам, срочность, особые условия..." multiline />
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>Заполните заявку</h2>
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
            {detail.isApproval && detail.decisions && (() => {
              // Определяем активный шаг — первый без решения
              const activeStage = APPROVAL_STAGES.find(s => !detail.decisions[s.id]);
              const isMyTurn = activeStage && activeStage.id === currentRole;

              function makeDecision(decision) {
                setRequests(prev => prev.map(r => {
                  if (r.id !== detail.id) return r;
                  const newDec = { ...r.decisions, [activeStage.id]: decision };
                  const newStatus = Object.values(newDec).every(v => v === "approved") ? "done"
                    : Object.values(newDec).some(v => v === "rejected") ? "closed" : "inwork";
                  const updated = { ...r, decisions: newDec, status: newStatus };
                  setDetail(updated);
                  return updated;
                }));
              }

              return (
              <>
                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Статус согласования</h3>
                  <ApprovalBar decisions={detail.decisions} businessDir={detail.businessDir} />

                  {/* Блок действия для текущего согласующего */}
                  {isMyTurn && (
                    <div style={{ background: C.orange + "10", border: `1px solid ${C.orange}40`, borderRadius: 10, padding: "14px 16px", marginTop: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, marginBottom: 4 }}>
                        ● Ваша очередь согласовать
                      </div>
                      <div style={{ fontSize: 12, color: C.gray700, marginBottom: 12 }}>
                        Вы вошли как <b>{activeStage.label}</b>. Ознакомьтесь с анкетой кандидата и примите решение.
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => makeDecision("approved")} style={{
                          background: C.green, color: C.white, border: "none", borderRadius: 8,
                          padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          ✓ Одобрить
                        </button>
                        <button onClick={() => makeDecision("rejected")} style={{
                          background: C.white, color: C.red, border: `1px solid ${C.red}`, borderRadius: 8,
                          padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          ✗ Отклонить
                        </button>
                      </div>
                    </div>
                  )}

                  {!isMyTurn && activeStage && (
                    <div style={{ background: C.gray100, borderRadius: 10, padding: "10px 14px", marginTop: 8, fontSize: 12, color: C.gray500 }}>
                      Сейчас ожидается решение: <b style={{ color: C.dark }}>{activeStage.label}</b>.
                      Переключите роль в левом меню чтобы согласовать.
                    </div>
                  )}

                  {!activeStage && (
                    <div style={{ background: C.greenPale, borderRadius: 10, padding: "10px 14px", marginTop: 8, fontSize: 12, color: C.green, fontWeight: 600 }}>
                      ✓ Все этапы пройдены — заявка согласована
                    </div>
                  )}
                </div>

                <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: 1 }}>Кандидат</h3>
                  {[
                    ["ФИО кандидата",        detail.candidate],
                    ["Вакансия",              detail.position],
                    ["Подразделение ДО",      detail.dept],
                    ["Оффер",                 detail.salary],
                    ["Направление",           detail.businessDir],
                    ["Организация",           detail.org || "ГБ"],
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
              );
            })()}

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

        {/* ── ONBOARDING ── */}
        {page === "onboarding" && (() => {
          const phaseTasks   = obTasks.filter(t => t.phase === obPhase);
          const totalDone    = obTasks.filter(t => t.done).length;
          const pct          = Math.round((totalDone / obTasks.length) * 100);
          const managerMet   = obTasks.some(t => t.isManagerMeeting && t.done);
          const goalsSet     = obManagerTasks.some(t => t.isGoals && t.done);
          const candidateOrg = "ГБ"; // from approval: HR-004 is ГБ
          const hrAddress    = candidateOrg === "ГБ"
            ? "г. Алматы, пр. Аль-Фараби, 40 — офис HR"
            : "Адрес дочерней организации — уточните у вашего HR-координатора";

          const docStatusColor = { verified: C.green, pending: C.orange, waiting: C.gray300 };
          const docStatusLabel = { verified: "✓ Проверено HR", pending: "⏳ На проверке", waiting: "Ожидает загрузки" };

          const TaskRow = ({ task, onToggle }) => (
            <div onClick={() => onToggle(task.id)}
              style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 12px", borderRadius:8, cursor:"pointer", marginBottom:6,
                background: task.done ? C.greenPale : C.gray100, border:`1px solid ${task.done ? C.green+"40" : "transparent"}` }}>
              <div style={{ width:20, height:20, borderRadius:4, border:`2px solid ${task.done?C.green:C.gray300}`, background:task.done?C.green:C.white,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.white, fontSize:11, fontWeight:700, marginTop:2 }}>
                {task.done?"✓":""}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:task.done?C.gray500:C.dark, textDecoration:task.done?"line-through":"none", fontWeight:task.done?400:500 }}>{task.title}</div>
                {task.sub  && <div style={{ fontSize:11, color:C.gray500, marginTop:2 }}>{task.sub}</div>}
                {task.who  && <div style={{ fontSize:11, color:C.gray500, marginTop:2 }}>Отв.: {task.who}</div>}
                {task.info && <div style={{ fontSize:11, color:C.blue, marginTop:4, fontStyle:"italic" }}>ℹ {task.info}</div>}
                {task.instruction && !task.done && (
                  <div style={{ marginTop:6, padding:"7px 10px", background:C.blue+"10", border:`1px solid ${C.blue}25`, borderRadius:6, fontSize:12, color:C.blue }}>
                    📋 {task.instruction}
                  </div>
                )}
              </div>
            </div>
          );

          const SurveyBlock = ({ questions, answers, onAnswer, submitted, onSubmit }) => (
            <div style={{ padding:"14px 16px", background:C.white, border:`1px solid ${C.blue}30`, borderRadius:10, marginTop:8 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.dark, marginBottom:12 }}>📋 Опрос от HR</div>
              {questions.map(q => (
                <div key={q.id} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.gray700, marginBottom:6 }}>{q.q}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {q.opts.map(opt => (
                      <button key={opt} onClick={e => { e.stopPropagation(); onAnswer(q.id, opt); }} style={{
                        padding:"5px 12px", borderRadius:20, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                        background: answers[q.id]===opt ? C.blue : C.gray100,
                        color:      answers[q.id]===opt ? C.white : C.gray700,
                        border:     `1px solid ${answers[q.id]===opt ? C.blue : C.gray300}`,
                        fontWeight: answers[q.id]===opt ? 700 : 400,
                      }}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
              {!submitted
                ? <button onClick={e => { e.stopPropagation(); onSubmit(); }} style={{ padding:"7px 18px", background:C.blue, color:C.white, border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Отправить</button>
                : <div style={{ fontSize:12, color:C.green, fontWeight:700 }}>✓ Ответы отправлены в HR</div>
              }
            </div>
          );

          return (
            <div>
              {/* Header + view switcher */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:10 }}>
                <div>
                  <h1 style={{ fontSize:24, fontWeight:700, color:C.dark, margin:0 }}>Онбординг</h1>
                  <p style={{ color:C.gray500, fontSize:14, marginTop:6 }}>Трек адаптации нового сотрудника · {candidateOrg}</p>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[
                    {v:"employee", label:"👤 Новичок"},
                    {v:"manager",  label:"👨‍💼 Руководитель"},
                    {v:"mentor",   label:"🤝 Наставник"},
                    {v:"hr",       label:"🏢 HR"},
                  ].map(({v,label}) => (
                    <button key={v} onClick={() => setObView(v)} style={{
                      padding:"7px 14px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                      background: obView===v ? C.green : C.white, color: obView===v ? C.white : C.gray500,
                      border:`1px solid ${obView===v ? C.green : C.gray300}`, fontWeight: obView===v ? 700 : 400,
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* ── EMPLOYEE VIEW ── */}
              {obView === "employee" && (
                <>
                  {/* Welcome */}
                  <div style={{ background:`linear-gradient(135deg, ${C.green}, ${C.greenMid})`, borderRadius:16, padding:"20px 24px", marginBottom:14, color:C.white }}>
                    <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>Добро пожаловать в Халык Банк! 🎉</div>
                    <div style={{ fontSize:13, opacity:0.9, marginBottom:10 }}>Руководитель: <b>Нуржан Касымов</b> · Наставник: <b>Айгерим Бекова</b></div>
                    <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"10px 14px", fontSize:13 }}>
                      Первый рабочий день: <b>16 июня 2026 в 09:00</b> · Испытательный срок: 3 месяца
                    </div>
                  </div>

                  {/* ALWAYS VISIBLE: Documents to bring on Day 1 */}
                  <div style={{ background:C.white, border:`2px solid ${C.orange}60`, borderRadius:12, padding:"16px 20px", marginBottom:12 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.dark, marginBottom:2 }}>📋 Перечень документов при приёме в Halyk Bank</div>
                    <div style={{ fontSize:12, color:C.orange, fontWeight:600, marginBottom:4 }}>⚠ В первый рабочий день в 09:00 · {hrAddress}</div>
                    <div style={{ fontSize:11, color:C.gray500, marginBottom:10 }}>Сканы отправьте рекрутеру заранее. В первый день принесите оригиналы.</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                      {[
                        { n:"1", text:"Трудовая книжка или документы, подтверждающие трудовую деятельность. Копия приказа об увольнении при отсутствии записей в трудовой книжке с последнего места работы" },
                        { n:"2", text:"Медосмотр при приёме на работу (форма 075 с печатью флюорографии и подписью главного врача)" },
                        { n:"3", text:"Справка об инвалидности работника и/или ребёнка (при наличии)" },
                        { n:"4", text:"Для инвалидов — справка с прежнего места работы за весь период" },
                        { n:"5", text:"Для совместителей — справка о характере и условиях труда по основному месту работы" },
                        { n:"6", text:"Уведомление об открытии карточного счёта Halyk Bank (20-значный IBAN счёт)", highlight:true },
                        { n:"7", text:"Военный билет / приписное свидетельство (военнообязанные должны состоять на учёте в городе работы)" },
                        { n:"8", text:"Свидетельство о заключении / расторжении брака (при наличии)" },
                        { n:"9", text:"Свидетельства о рождении детей (при наличии)" },
                        { n:"10", text:"Цветная фотография 3×4 (если не вложена в онлайн-анкету)" },
                        { n:"11", text:"Дополнительные сведения к анкете (заполнялись ранее — оригинал из онлайн-анкеты)" },
                        { n:"12", text:"Согласие субъекта (заполнялось ранее — оригинал из онлайн-анкеты)" },
                        { n:"13", text:"Согласие на сбор и обработку персональных данных (заполнялось ранее — оригинал из онлайн-анкеты)" },
                      ].map((doc) => (
                        <div key={doc.n} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"7px 0", borderBottom:`1px solid ${C.gray100}`, fontSize:12 }}>
                          <span style={{ color:C.white, background:doc.highlight ? C.green : C.gray500, borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, flexShrink:0, marginTop:1 }}>{doc.n}</span>
                          <span style={{ color: doc.highlight ? C.dark : C.gray700, fontWeight: doc.highlight ? 600 : 400 }}>{doc.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ALWAYS VISIBLE: Address + directions + parking */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"16px 20px", marginBottom:14 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.dark, marginBottom:4 }}>📍 Куда прийти в первый день</div>
                    <div style={{ fontSize:13, color:C.dark, fontWeight:600, marginBottom:10 }}>{hrAddress}</div>
                    {candidateOrg === "ГБ" && (
                      <>
                        <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                          <div style={{ flex:1, minWidth:140, background:C.blue+"0D", border:`1px solid ${C.blue}25`, borderRadius:8, padding:"10px 12px", fontSize:12 }}>
                            <div style={{ fontWeight:700, color:C.blue, marginBottom:4 }}>🚌 Общественный транспорт</div>
                            <div style={{ color:C.gray700 }}>Автобусы 28, 65, 86, 97 — ост. «Нурлы Тау»</div>
                            <div style={{ color:C.gray700, marginTop:2 }}>Метро: ст. «Аль-Фараби» → 5 мин. пешком</div>
                          </div>
                          <div style={{ flex:1, minWidth:140, background:C.orange+"0D", border:`1px solid ${C.orange}25`, borderRadius:8, padding:"10px 12px", fontSize:12 }}>
                            <div style={{ fontWeight:700, color:C.orange, marginBottom:4 }}>🚗 На автомобиле</div>
                            <div style={{ color:C.gray700 }}>Въезд с ул. Тимирязева, паркинг P2 (подземный) и наземная парковка у входа</div>
                          </div>
                        </div>
                        <div style={{ background:"#f8f4ff", border:`1px solid #c4b5fd`, borderRadius:8, padding:"12px 14px", fontSize:12 }}>
                          <div style={{ fontWeight:700, color:"#7c3aed", marginBottom:6 }}>🅿 Парковка у БЦ «Нурлы Тау»</div>
                          <div style={{ display:"flex", flexDirection:"column", gap:4, color:C.gray700, marginBottom:6 }}>
                            <div>Тариф: <b>100 ₸/час</b> · Скидка сотруднику Halyk: <b>50%</b></div>
                            <div>Как получить скидку: <b>корпоративный ID на въезде</b></div>
                            <div>Оплата: <b>приложение Halyk или касса</b></div>
                          </div>
                          <div style={{ color:"#7c3aed", fontSize:11 }}>Корпоративная парковочная карта выдаётся в административном отделе (к. 108) после оформления</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Phase progress */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px", marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.dark }}>Общий прогресс</div>
                      <div style={{ fontSize:13, fontWeight:800, color:C.green }}>{pct}%</div>
                    </div>
                    <div style={{ height:7, background:C.gray100, borderRadius:4, marginBottom:18, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:C.green, borderRadius:4, transition:"width .4s" }} />
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-start" }}>
                      {OB_PHASES.map((ph, i) => {
                        const phDone  = obTasks.filter(t=>t.phase===ph.id && t.done).length;
                        const phTotal = obTasks.filter(t=>t.phase===ph.id).length;
                        const isActive = ph.id === obPhase;
                        const isDone   = phDone === phTotal && phTotal > 0;
                        const col = isDone ? C.green : isActive ? C.orange : C.gray300;
                        return (
                          <div key={ph.id} style={{ display:"flex", alignItems:"flex-start", flex: i<OB_PHASES.length-1 ? 1 : "none" }}>
                            <button onClick={() => setObPhase(ph.id)} style={{ background:"none", border:"none", padding:0, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", minWidth:80 }}>
                              <div style={{ width:40, height:40, borderRadius:"50%", background:col, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:C.white, border: isActive ? `3px solid ${C.orange}` : "none" }}>{ph.icon}</div>
                              <div style={{ fontSize:10, fontWeight:700, color:col, marginTop:5, textAlign:"center" }}>{ph.label}</div>
                              <div style={{ fontSize:9, color:C.gray500, textAlign:"center" }}>{phDone}/{phTotal}</div>
                            </button>
                            {i < OB_PHASES.length-1 && <div style={{ flex:1, height:2, background:isDone?C.green:C.gray300, margin:"19px 2px 0", flexShrink:0 }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px", marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>
                        {OB_PHASES.find(p=>p.id===obPhase)?.icon} {OB_PHASES.find(p=>p.id===obPhase)?.label} — задачи
                      </div>
                      <div style={{ fontSize:12, color:C.gray500 }}>{phaseTasks.filter(t=>t.done).length} / {phaseTasks.length} выполнено</div>
                    </div>
                    {phaseTasks.map(task => (
                      <TaskRow key={task.id} task={task}
                        onToggle={id => setObTasks(prev => prev.map(t => t.id===id ? {...t,done:!t.done} : t))}
                      />
                    ))}
                  </div>

                  {/* Goals — appear after meeting with manager */}
                  {managerMet && obPhase === "week1" && (
                    <div style={{ background:C.white, border:`2px solid ${C.green}40`, borderRadius:12, padding:"20px 24px", marginBottom:14 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:4 }}>🎯 Цели на испытательный срок</div>
                      <div style={{ fontSize:12, color:C.gray500, marginBottom:12 }}>Поставлены руководителем <b>Нуржан Касымов</b></div>
                      {obGoals.map(goal => (
                        <div key={goal.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:`1px solid ${C.gray100}` }}>
                          <div style={{ width:18, height:18, borderRadius:"50%", background:goal.done?C.green:C.gray300, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.white }}>
                            {goal.done?"✓":""}
                          </div>
                          <div style={{ fontSize:13, color:goal.done?C.gray500:C.dark, textDecoration:goal.done?"line-through":"none" }}>{goal.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Survey — month3 phase */}
                  {obPhase === "month3" && (
                    <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px", marginBottom:14 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:4 }}>📋 Опрос адаптации — 2 месяца</div>
                      <div style={{ fontSize:12, color:C.gray500, marginBottom:2 }}>HR собирает обратную связь от вас, руководителя и наставника</div>
                      <SurveyBlock
                        questions={SURVEY_EMPLOYEE}
                        answers={obSurveys.employee}
                        onAnswer={(qid, val) => setObSurveys(p => ({...p, employee:{...p.employee, [qid]:val}}))}
                        onSubmit={() => setObSurveys(p => ({...p, employeeSubmitted:true}))}
                        submitted={!!obSurveys.employeeSubmitted}
                      />
                    </div>
                  )}

                  {/* Documents */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:14 }}>📁 Документы</div>
                    {obDocs.map(doc => (
                      <div key={doc.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.gray100}`, fontSize:13 }}>
                        <span style={{ color:C.dark }}>{doc.name}</span>
                        <span style={{ fontSize:11, fontWeight:600, color:docStatusColor[doc.status] }}>{docStatusLabel[doc.status]}</span>
                      </div>
                    ))}
                    <div style={{ marginTop:14 }}><Btn small variant="ghost">📎 Загрузить документ</Btn></div>
                  </div>
                </>
              )}

              {/* ── MANAGER VIEW ── */}
              {obView === "manager" && (
                <>
                  <div style={{ background:`linear-gradient(135deg, ${C.blue}, #1a6fa8)`, borderRadius:16, padding:"20px 24px", marginBottom:16, color:C.white }}>
                    <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>Новый сотрудник в вашей команде 👋</div>
                    <div style={{ fontSize:13, opacity:0.9, marginBottom:10 }}>Алия Сейткали · Senior PM · Выход: 16 июня 2026</div>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>🤝 Наставник: <b>Айгерим Бекова</b></div>
                      <div style={{ background:"rgba(255,255,255,0.18)", borderRadius:8, padding:"8px 14px", fontSize:12 }}>⏱ ИС: 3 месяца</div>
                    </div>
                  </div>

                  {/* Pre-boarding manager tasks */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px", marginBottom:14 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:4 }}>📨 Pre-boarding — ваши задачи</div>
                    <div style={{ fontSize:12, color:C.orange, fontWeight:600, marginBottom:12 }}>Выполните за 1–3 дня до первого рабочего дня сотрудника</div>
                    {obManagerTasks.filter(t=>t.phase==="pre").map(task => (
                      <TaskRow key={task.id} task={task}
                        onToggle={id => setObManagerTasks(prev => prev.map(t => t.id===id ? {...t,done:!t.done} : t))}
                      />
                    ))}
                  </div>

                  {/* Day 1 manager tasks + goals */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px", marginBottom:14 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:4 }}>🚀 День 1 — ваши задачи</div>
                    <div style={{ fontSize:12, color:C.gray500, marginBottom:12 }}>Выполните в первый рабочий день</div>
                    {obManagerTasks.filter(t=>t.phase==="week1").map(task => (
                      <div key={task.id}>
                        <TaskRow task={task}
                          onToggle={id => setObManagerTasks(prev => prev.map(t => t.id===id ? {...t,done:!t.done} : t))}
                        />
                        {task.isGoals && (
                          <div style={{ marginLeft:32, marginBottom:8 }}>
                            {!task.done && (
                              <div style={{ fontSize:12, color:C.gray500, padding:"8px 12px", background:C.gray100, borderRadius:8 }}>
                                Отметьте задачу выполненной — откроется редактор целей ИС
                              </div>
                            )}
                            {task.done && (
                              <div style={{ background:C.greenPale, border:`1px solid ${C.green}40`, borderRadius:10, padding:"14px 16px" }}>
                                <div style={{ fontSize:13, fontWeight:700, color:C.dark, marginBottom:10 }}>🎯 Цели на испытательный срок</div>
                                {obGoals.map(goal => (
                                  <div key={goal.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 10px", borderRadius:6, marginBottom:4,
                                    background:goal.done?C.green+"15":C.white, border:`1px solid ${goal.done?C.green+"30":C.gray300}` }}>
                                    <button onClick={e => { e.stopPropagation(); setObGoals(prev=>prev.map(g=>g.id===goal.id?{...g,done:!g.done}:g)); }} style={{
                                      width:20, height:20, borderRadius:4, border:`2px solid ${goal.done?C.green:C.gray300}`, background:goal.done?C.green:C.white,
                                      display:"flex", alignItems:"center", justifyContent:"center", color:C.white, fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
                                      {goal.done?"✓":""}
                                    </button>
                                    <span style={{ fontSize:13, flex:1, color:goal.done?C.gray500:C.dark, textDecoration:goal.done?"line-through":"none" }}>{goal.text}</span>
                                  </div>
                                ))}
                                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                                  <input value={newGoalText} onChange={e=>setNewGoalText(e.target.value)}
                                    onClick={e=>e.stopPropagation()}
                                    placeholder="Добавить цель..."
                                    style={{ flex:1, border:`1px solid ${C.gray300}`, borderRadius:6, padding:"7px 10px", fontSize:12, fontFamily:"inherit", outline:"none" }}
                                  />
                                  <button onClick={e=>{e.stopPropagation();if(newGoalText.trim()){setObGoals(prev=>[...prev,{id:Date.now(),text:newGoalText.trim(),done:false}]);setNewGoalText("");}}} style={{
                                    padding:"7px 14px", background:C.green, color:C.white, border:"none", borderRadius:6, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                                  }}>+ Добавить</button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Month 3 manager tasks */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:4 }}>📊 Месяц 2–3</div>
                    <div style={{ fontSize:12, color:C.gray500, marginBottom:12 }}>Оценка прогресса и финальное решение по ИС</div>
                    {obManagerTasks.filter(t=>t.phase==="month3").map(task => (
                      <div key={task.id}>
                        <TaskRow task={task}
                          onToggle={id => setObManagerTasks(prev => prev.map(t => t.id===id ? {...t,done:!t.done} : t))}
                        />
                        {task.isSurvey && task.done && (
                          <div style={{ marginLeft:32, marginBottom:8 }}>
                            <SurveyBlock
                              questions={SURVEY_MANAGER}
                              answers={obSurveys.manager}
                              onAnswer={(qid,val) => setObSurveys(p=>({...p, manager:{...p.manager,[qid]:val}}))}
                              onSubmit={() => setObSurveys(p=>({...p, managerSubmitted:true}))}
                              submitted={!!obSurveys.managerSubmitted}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── MENTOR VIEW ── */}
              {obView === "mentor" && (
                <>
                  <div style={{ background:"linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius:16, padding:"20px 24px", marginBottom:16, color:C.white }}>
                    <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>Вы — наставник нового сотрудника 🤝</div>
                    <div style={{ fontSize:13, opacity:0.9 }}>Алия Сейткали · Senior PM · Выход: 16 июня 2026</div>
                  </div>
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:14 }}>📋 Ваши задачи</div>
                    {(()=>{
                      const groups = [
                        { phase:"pre",    label:"До выхода" },
                        { phase:"week1",  label:"День 1–7"  },
                        { phase:"month3", label:"Месяц 2–3" },
                      ];
                      return groups.map(g => {
                        const tasks = obMentorTasks.filter(t=>t.phase===g.phase);
                        if(!tasks.length) return null;
                        return (
                          <div key={g.phase} style={{ marginBottom:16 }}>
                            <div style={{ fontSize:11, fontWeight:700, color:C.gray500, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>{g.label}</div>
                            {tasks.map(task => (
                              <div key={task.id}>
                                <TaskRow task={task}
                                  onToggle={id => setObMentorTasks(prev => prev.map(t => t.id===id ? {...t,done:!t.done} : t))}
                                />
                                {task.isSurvey && task.done && (
                                  <div style={{ marginLeft:32, marginBottom:8 }}>
                                    <SurveyBlock
                                      questions={SURVEY_MENTOR}
                                      answers={obSurveys.mentor}
                                      onAnswer={(qid,val) => setObSurveys(p=>({...p, mentor:{...p.mentor,[qid]:val}}))}
                                      onSubmit={() => setObSurveys(p=>({...p, mentorSubmitted:true}))}
                                      submitted={!!obSurveys.mentorSubmitted}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              )}

              {/* ── HR VIEW ── */}
              {obView === "hr" && (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(1,1fr)":"repeat(3,1fr)", gap:12, marginBottom:16 }}>
                    {[
                      { label:"Активных онбордингов", value:"7",   color:C.green },
                      { label:"Просроченных задач",   value:"3",   color:C.red   },
                      { label:"Средний прогресс",      value:"54%", color:C.blue  },
                    ].map(k => (
                      <div key={k.label} style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"18px 20px" }}>
                        <div style={{ height:3, background:k.color, borderRadius:2, marginBottom:12 }} />
                        <div style={{ fontSize:28, fontWeight:800, color:k.color }}>{k.value}</div>
                        <div style={{ fontSize:12, color:C.gray500, marginTop:4 }}>{k.label}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    { name:"Алия Сейткали",  pos:"Senior PM", phase:"week1",  pct:18, overdue:2, org:"ГБ" },
                    { name:"Берик Омаров",   pos:"Аналитик",  phase:"month1", pct:55, overdue:0, org:"ДО" },
                    { name:"Дина Жакупова",  pos:"Юрист",     phase:"month3", pct:80, overdue:1, org:"ГБ" },
                  ].map(emp => (
                    <div key={emp.name} style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"16px 20px", marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:C.dark }}>{emp.name}</div>
                          <div style={{ fontSize:12, color:C.gray500 }}>{emp.pos} · {OB_PHASES.find(p=>p.id===emp.phase)?.label}
                            <span style={{ marginLeft:8, fontSize:10, background:emp.org==="ГБ"?C.blue+"15":"#dcfce7", color:emp.org==="ГБ"?C.blue:"#16a34a", border:`1px solid ${emp.org==="ГБ"?C.blue+"40":"#86efac"}`, borderRadius:4, padding:"1px 6px", fontWeight:700 }}>{emp.org}</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          {emp.overdue > 0 && <span style={{ fontSize:11, background:C.red+"15", color:C.red, border:`1px solid ${C.red}40`, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>⚠ {emp.overdue} просрочено</span>}
                          <span style={{ fontSize:13, fontWeight:800, color:C.green }}>{emp.pct}%</span>
                        </div>
                      </div>
                      <div style={{ height:6, background:C.gray100, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${emp.pct}%`, background:C.green, borderRadius:3 }} />
                      </div>
                    </div>
                  ))}

                  {/* Survey results */}
                  <div style={{ background:C.white, border:`1px solid ${C.gray300}`, borderRadius:12, padding:"20px 24px", marginTop:10 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.dark, marginBottom:14 }}>📋 Опросы адаптации — Алия Сейткали</div>
                    {[
                      { role:"Новичок",      icon:"👤",  submitted:obSurveys.employeeSubmitted, answers:obSurveys.employee, qs:SURVEY_EMPLOYEE },
                      { role:"Руководитель", icon:"👨‍💼", submitted:obSurveys.managerSubmitted,  answers:obSurveys.manager,  qs:SURVEY_MANAGER  },
                      { role:"Наставник",    icon:"🤝",  submitted:obSurveys.mentorSubmitted,   answers:obSurveys.mentor,   qs:SURVEY_MENTOR   },
                    ].map(s => (
                      <div key={s.role} style={{ padding:"12px 0", borderBottom:`1px solid ${C.gray100}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:s.submitted?8:0 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.dark }}>{s.icon} {s.role}</div>
                          <Badge text={s.submitted?"✓ Заполнено":"Ожидает"} color={s.submitted?C.green:C.orange} />
                        </div>
                        {s.submitted && s.qs.map(q => s.answers[q.id] && (
                          <div key={q.id} style={{ fontSize:12, color:C.gray700, marginBottom:3 }}>
                            <span style={{ color:C.gray500 }}>{q.q}</span>
                            <span style={{ fontWeight:700, color:C.dark, marginLeft:6 }}>→ {s.answers[q.id]}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* ── ANALYTICS ── */}
        {page === "analytics" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.dark, margin: 0 }}>Аналитика</h1>
              <p style={{ color: C.gray500, fontSize: 14, marginTop: 6 }}>HR Service Center · Июнь 2026</p>
            </div>

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: 24 }}>
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
