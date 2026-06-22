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
  purple:   "#7C3AED",
};

// ── Data ───────────────────────────────────────────────────────────────────
const SERVICES = [
  // ── Кадровое администрирование: Заявки ────────────────────────────────
  { id: 1,  cat: "Кадровое администрирование", icon: "🔄", title: "Перевод",                                                        sla: "3 раб. дня",  desc: "Перевод на другую должность, в другое подразделение или регион.", who: "Сотрудник / руководитель", docs: "Заявка с обоснованием" },
  { id: 2,  cat: "Кадровое администрирование", icon: "🏖", title: "Заявка на отпуск",                                               sla: "1 раб. день", desc: "Оформление ежегодного, учебного или административного отпуска.", who: "Любой сотрудник", docs: "Заявление (заполняется на портале)" },
  { id: 3,  cat: "Кадровое администрирование", icon: "📅", title: "Планируемый график отпусков",                                    sla: "2 раб. дня",  desc: "Формирование и согласование планового графика отпусков подразделения.", who: "Руководитель", docs: "График отпусков по подразделению" },
  { id: 4,  cat: "Кадровое администрирование", icon: "👶", title: "Отпуск без сохранения заработной платы по уходу за детьми",     sla: "2 раб. дня",  desc: "Оформление отпуска без сохранения заработной платы для ухода за детьми.", who: "Любой сотрудник", docs: "Заявление, свидетельство о рождении ребёнка" },
  { id: 5,  cat: "Кадровое администрирование", icon: "🤱", title: "Заявка на выход из декретного отпуска",                         sla: "3 раб. дня",  desc: "Оформление досрочного или планового выхода сотрудника из декретного отпуска.", who: "Руководитель", docs: "Заявление сотрудника", tag: "рук" },
  { id: 6,  cat: "Кадровое администрирование", icon: "📝", title: "Заявка на изменение персональных данных",                       sla: "2 раб. дня",  desc: "Обновление персональных данных сотрудника (ФИО, адрес, документы и др.).", who: "Любой сотрудник", docs: "Подтверждающие документы" },
  { id: 7,  cat: "Кадровое администрирование", icon: "🔃", title: "Актуализация данных",                                           sla: "2 раб. дня",  desc: "Актуализация сведений о сотруднике в кадровых системах.", who: "Любой сотрудник / HR", docs: "Подтверждающие документы" },
  { id: 8,  cat: "Кадровое администрирование", icon: "🔁", title: "Заявка на замещение / совмещение / возложение",                 sla: "3 раб. дня",  desc: "Временное замещение, совмещение должностей или возложение обязанностей.", who: "Руководитель", docs: "Обоснование, период замещения", tag: "рук" },
  { id: 9,  cat: "Кадровое администрирование", icon: "✈️", title: "Заявка на командировку",                                         sla: "2 раб. дня",  desc: "Оформление служебной командировки сотрудника.", who: "Любой сотрудник / руководитель", docs: "Цель командировки, даты, место" },
  { id: 10, cat: "Кадровое администрирование", icon: "🧾", title: "Авансовый отчёт по командировке",                               sla: "3 раб. дня",  desc: "Подача авансового отчёта по итогам служебной командировки.", who: "Любой сотрудник", docs: "Чеки, билеты, подтверждающие документы" },
  { id: 11, cat: "Кадровое администрирование", icon: "📆", title: "Заявка на работу в выходные дни",                               sla: "1 раб. день", desc: "Согласование выхода сотрудника на работу в выходной или праздничный день.", who: "Любой сотрудник / руководитель", docs: "Обоснование выхода" },
  { id: 12, cat: "Кадровое администрирование", icon: "📋", title: "Приказ на выход в выходные / праздничные дни",                  sla: "2 раб. дня",  desc: "Оформление приказа на работу в выходные и праздничные дни.", who: "Руководитель / HR", docs: "Список сотрудников, даты, обоснование" },
  { id: 13, cat: "Кадровое администрирование", icon: "🚪", title: "Заявка на отсутствие работника на рабочем месте",              sla: "1 раб. день", desc: "Фиксация и согласование отсутствия сотрудника на рабочем месте.", who: "Руководитель", docs: "Причина отсутствия, даты", tag: "рук" },
  { id: 14, cat: "Кадровое администрирование", icon: "💻", title: "Заявка по определению формата работ",                           sla: "2 раб. дня",  desc: "Определение формата работы сотрудника: офис, удалённо, гибрид.", who: "Руководитель", docs: "Обоснование формата", tag: "рук" },
  { id: 15, cat: "Кадровое администрирование", icon: "📄", title: "Процесс выдачи справок с места работы",                         sla: "1 раб. день", desc: "Оформление и выдача официальных справок с места работы для различных целей.", who: "Любой сотрудник", docs: "Не требуются" },
  { id: 16, cat: "Кадровое администрирование", icon: "🗓", title: "График",                                                         sla: "2 раб. дня",  desc: "Формирование и согласование рабочего графика сотрудников.", who: "Руководитель / HR", docs: "Данные по графику работы" },
  { id: 17, cat: "Кадровое администрирование", icon: "🏛", title: "Заявка на изменение состава Совета Филиала",                    sla: "5 раб. дней", desc: "Внесение изменений в состав Совета Филиала.", who: "Секретарь", docs: "Обоснование изменений, список участников", tag: "секретари" },
  { id: 18, cat: "Кадровое администрирование", icon: "⭐", title: "Заявка на кадровый резерв",                                      sla: "5 раб. дней", desc: "Включение сотрудника в кадровый резерв компании.", who: "Руководитель / HR", docs: "Профиль кандидата, обоснование" },
  { id: 19, cat: "Кадровое администрирование", icon: "📑", title: "Обходной лист",                                                  sla: "3 раб. дня",  desc: "Оформление обходного листа при увольнении или переводе сотрудника.", who: "Любой сотрудник", docs: "Не требуются" },
  { id: 20, cat: "Кадровое администрирование", icon: "👋", title: "Заявка на увольнение",                                           sla: "3 раб. дня",  desc: "Инициирование процедуры увольнения по собственному желанию.", who: "Любой сотрудник", docs: "Заявление об увольнении" },
  { id: 21, cat: "Кадровое администрирование", icon: "📚", title: "Заявка на обучение",                                             sla: "3 раб. дня",  desc: "Запись на внутренний или внешний курс, тренинг или сертификацию.", who: "Любой сотрудник / руководитель", docs: "Название курса, провайдер" },
  { id: 22, cat: "Кадровое администрирование", icon: "📊", title: "Мониторинг заявок",                                              sla: "1 раб. день", desc: "Просмотр и контроль статусов текущих заявок в системе.", who: "Любой сотрудник / руководитель / HR", docs: "Не требуются" },
  { id: 23, cat: "Кадровое администрирование", icon: "🤝", title: "Материальная помощь",                                            sla: "5 раб. дней", desc: "Подача заявления на получение материальной помощи.", who: "Любой сотрудник", docs: "Заявление, подтверждающие документы" },
  { id: 24, cat: "Кадровое администрирование", icon: "🅿️", title: "Распределение парковочных мест",                               sla: "3 раб. дня",  desc: "Заявка на выделение или изменение парковочного места.", who: "Любой сотрудник", docs: "Данные автомобиля" },
  { id: 25, cat: "Кадровое администрирование", icon: "💳", title: "Заявка на субсидирование",                                       sla: "5 раб. дней", desc: "Подача заявки на получение субсидии от компании.", who: "Любой сотрудник", docs: "Заявление, подтверждающие документы" },
  // ── Отчеты ────────────────────────────────────────────────────────────────
  { id: 26, cat: "Отчеты", icon: "🧮", title: "Расчетный листок",                                   sla: "1 раб. день", desc: "Расчётный листок по заработной плате за выбранный период.", who: "Любой сотрудник", docs: "Не требуются" },
  { id: 27, cat: "Отчеты", icon: "📈", title: "OTK 3.0",                                            sla: "2 раб. дня",  desc: "Отчёт OTK 3.0 по показателям качества работы.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 28, cat: "Отчеты", icon: "🏢", title: "Отчет по трайбам",                                   sla: "2 раб. дня",  desc: "Аналитический отчёт по трайбам для руководителей.", who: "Руководитель", docs: "Не требуются", tag: "рук" },
  { id: 29, cat: "Отчеты", icon: "🕐", title: "Портал: Отчёт Лимиты отсутствий",                   sla: "1 раб. день", desc: "Отчёт по лимитам и фактическим отсутствиям сотрудников.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 30, cat: "Отчеты", icon: "📋", title: "Портал: Отчёт ШДС",                                  sla: "1 раб. день", desc: "Отчёт по штатно-должностному составу (ШДС) подразделения.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 31, cat: "Отчеты", icon: "🎓", title: "Портал: Отчёт по обучению работников",              sla: "1 раб. день", desc: "Отчёт по пройденному обучению сотрудников за период.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 32, cat: "Отчеты", icon: "✈️", title: "Портал: Отчёт по командировкам",                    sla: "1 раб. день", desc: "Сводный отчёт по командировкам сотрудников.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 33, cat: "Отчеты", icon: "🚷", title: "Отчет об отсутствии работника на рабочем месте",    sla: "1 раб. день", desc: "Отчёт о фактическом отсутствии сотрудников на рабочем месте.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 34, cat: "Отчеты", icon: "💰", title: "Расчёт среднего заработка",                          sla: "2 раб. дня",  desc: "Расчёт среднего заработка сотрудника для различных целей.", who: "Любой сотрудник / HR", docs: "Не требуются" },
  { id: 35, cat: "Отчеты", icon: "🗓", title: "Отчет по графикам отпусков",                         sla: "1 раб. день", desc: "Отчёт по плановым и фактическим графикам отпусков.", who: "Руководитель / HR", docs: "Не требуются" },
  { id: 36, cat: "Отчеты", icon: "👤", title: "Отчет — Персональные данные работника",              sla: "1 раб. день", desc: "Отчёт с персональными данными сотрудника из кадровой системы.", who: "HR / Руководитель", docs: "Не требуются" },
  // ── Подбор персонала ──────────────────────────────────────────────────────
  { id: 37, cat: "Подбор персонала",        icon: "🔍", title: "Заявка на подбор",       sla: "5 раб. дней", desc: "Открытие вакансии и поиск кандидата силами HR Service Center.", who: "Руководитель подразделения", docs: "Описание вакансии, грейд" },
  // ── Compensation & Benefits ───────────────────────────────────────────────
  { id: 38, cat: "Compensation & Benefits", icon: "💰", title: "Заявка на премирование", sla: "3 раб. дня",  desc: "Единовременная или регулярная премия для сотрудника или команды.", who: "Руководитель подразделения", docs: "Обоснование, сумма" },
  // ── HR Analytics ─────────────────────────────────────────────────────────
  { id: 39, cat: "HR Analytics",            icon: "📊", title: "Запрос HR-отчёта",      sla: "2 раб. дня",  desc: "Любой аналитический отчёт: текучесть, headcount, ФОТ, SLA.", who: "Руководитель / HR", docs: "Описание нужных данных и периода" },
  // ── Оценка и Performance ─────────────────────────────────────────────────
  { id: 40, cat: "Оценка и Performance",    icon: "🎯", title: "Запуск оценки 360",     sla: "5 раб. дней", desc: "Организация цикла оценки для сотрудника или команды.", who: "Руководитель / HR", docs: "Список участников оценки" },
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

const TagBadge = ({ tag }) => {
  if (!tag) return null;
  const colors = { "рук": C.purple, "секретари": C.orange };
  const color = colors[tag] || C.gray500;
  return (
    <span style={{ background: color + "18", color, border: `1px solid ${color}40`,
      borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 4 }}>
      {tag}
    </span>
  );
};

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

const isReport = s => s.cat === "Отчеты";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [catFilter, setCatFilter] = useState("Все");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", dept: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([
    { id: "HR-001", title: "Процесс выдачи справок с места работы", status: "inwork",  sla: "1 раб. день", date: "09.06.2026", icon: "📄" },
    { id: "HR-002", title: "Заявка на отпуск",                       status: "closed",  sla: "1 раб. день", date: "02.06.2026", icon: "🏖" },
    { id: "HR-003", title: "Заявка на подбор",                        status: "review",  sla: "5 раб. дней", date: "11.06.2026", icon: "🔍" },
  ]);
  const [detail, setDetail] = useState(null);

  const sideW = 200;

  const filteredServices = SERVICES.filter(s => {
    const matchCat  = catFilter === "Все" || s.cat === catFilter;
    const matchSrch = s.title.toLowerCase().includes(search.toLowerCase()) || s.cat.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  // group filtered services by category for display
  const groupedServices = filteredServices.reduce((acc, s) => {
    if (!acc[s.cat]) acc[s.cat] = [];
    acc[s.cat].push(s);
    return acc;
  }, {});

  function submitRequest() {
    const svc = selected;
    const newReq = {
      id: `HR-00${requests.length + 4}`,
      title: svc.title, status: "sent",
      sla: svc.sla, date: new Date().toLocaleDateString("ru-RU"),
      icon: svc.icon
    };
    setRequests(prev => [newReq, ...prev]);
    setSubmitted(true);
  }

  function resetForm() {
    setSelected(null); setForm({ name: "", dept: "", comment: "" }); setSubmitted(false);
  }

  function openService(s) {
    setSelected(s);
    setPage("form");
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
              {SERVICES.slice(0, 4).map(s => (
                <div key={s.id} onClick={() => openService(s)}
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
              {requests.slice(0, 3).map(r => (
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
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {["Все", ...CATS].map(c => (
                <Pill key={c} text={c} active={catFilter === c} onClick={() => setCatFilter(c)} />
              ))}
            </div>

            {/* Service cards grouped by category */}
            {Object.entries(groupedServices).map(([cat, services]) => (
              <div key={cat} style={{ marginBottom: 36 }}>
                {/* Category header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ height: 3, width: 24, background: cat === "Отчеты" ? C.purple : C.green, borderRadius: 2 }} />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>{cat}</h2>
                  <span style={{ fontSize: 12, color: C.gray500, background: C.gray100, borderRadius: 10, padding: "2px 8px" }}>
                    {services.length}
                  </span>
                  <div style={{ flex: 1, height: 1, background: C.gray300 }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                  {services.map(s => (
                    <div key={s.id} style={{
                      background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12,
                      padding: "20px", cursor: "pointer", transition: "box-shadow .15s",
                      boxShadow: "0 1px 4px #0000000A", display: "flex", flexDirection: "column"
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0000001A"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px #0000000A"}>
                      <div style={{ height: 3, background: isReport(s) ? C.purple : C.green, borderRadius: 2, marginBottom: 14 }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isReport(s) ? C.purple : C.green, letterSpacing: 1, textTransform: "uppercase" }}>{s.cat}</span>
                        {s.tag && <TagBadge tag={s.tag} />}
                      </div>
                      <div style={{ fontSize: 16, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.gray500, flex: 1, marginBottom: 14 }}>{s.desc}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.gray500 }}>⏱ {s.sla}</span>
                        <button onClick={() => openService(s)} style={{
                          background: isReport(s) ? C.purple : C.green,
                          color: C.white, border: "none", borderRadius: 8,
                          padding: "6px 14px", fontSize: 12, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit"
                        }}>
                          {isReport(s) ? "Получить отчёт" : "Подать заявку"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: C.gray500 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Ничего не найдено</div>
              </div>
            )}
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
            <div style={{
              background: isReport(selected) ? C.purple + "0D" : C.greenPale,
              border: `1px solid ${isReport(selected) ? C.purple : C.green}30`,
              borderRadius: 12, padding: "16px 20px", marginBottom: 24,
              display: "flex", gap: 14, alignItems: "flex-start"
            }}>
              <div style={{ fontSize: 28 }}>{selected.icon}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{selected.title}</div>
                  {selected.tag && <TagBadge tag={selected.tag} />}
                </div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{selected.desc}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <Badge text={`SLA: ${selected.sla}`} color={isReport(selected) ? C.purple : C.green} />
                  <Badge text={selected.who} color={C.gray500} />
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.dark, margin: "0 0 20px" }}>
              {isReport(selected) ? "Запросить отчёт" : "Заполните заявку"}
            </h2>

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

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={submitRequest} style={{
                background: isReport(selected) ? C.purple : C.green,
                color: C.white, border: "none", borderRadius: 8,
                padding: "10px 20px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit"
              }}>
                {isReport(selected) ? "Запросить отчёт" : "Отправить заявку"}
              </button>
              <Btn onClick={resetForm} variant="ghost">Отмена</Btn>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {page === "form" && submitted && (
          <div style={{ maxWidth: 500, textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>
              {isReport(selected) ? "Запрос отправлен" : "Заявка отправлена"}
            </h2>
            <p style={{ color: C.gray500, fontSize: 14, marginBottom: 24 }}>
              {isReport(selected)
                ? <>Ваш запрос <b>«{selected?.title}»</b> принят в обработку.<br />Отчёт будет подготовлен в течение {selected?.sla}.</>
                : <>Вашу заявку <b>«{selected?.title}»</b> получил HR Service Center.<br />Мы уведомим вас при изменении статуса. SLA: {selected?.sla}.</>
              }
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

            <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Прогресс</h3>
              <WorkflowBar status={detail.status} />
            </div>

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

            <div style={{ background: C.white, border: `1px solid ${C.gray300}`, borderRadius: 12, padding: "20px 24px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.gray500, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Комментарии</h3>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.green,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: C.white, fontWeight: 700, flexShrink: 0 }}>HR</div>
                <div style={{ background: C.gray100, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.gray700 }}>
                  Заявка принята в работу. Ожидайте уведомления.
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
