// Halyk Bank brand colors
export const C = {
  bg:        "#F4F6F5",
  white:     "#FFFFFF",
  dark:      "#0D1C18",
  green:     "#0B6E3A",
  greenMid:  "#0F8A49",
  greenPale: "#E6F4EC",
  greenLight:"#F0FAF4",
  gray700:   "#374151",
  gray500:   "#6B7280",
  gray400:   "#9CA3AF",
  gray300:   "#D1D5DB",
  gray200:   "#E5E7EB",
  gray100:   "#F3F4F6",
  orange:    "#F59E0B",
  blue:      "#2563EB",
  red:       "#DC2626",
  purple:    "#7C3AED",
  teal:      "#0D9488",
  gold:      "#D97706",
};

export const COMPANIES = [
  { id: "halyk",         name: "Халык Банк",    short: "HB",  type: "A", color: "#0B6E3A" },
  { id: "halyk-life",    name: "Halyk-Life",    short: "HL",  type: "B", color: "#2563EB" },
  { id: "halyk-finance", name: "Halyk Finance", short: "HF",  type: "B", color: "#7C3AED" },
  { id: "halyk-leasing", name: "Halyk Leasing", short: "HLS", type: "B", color: "#D97706" },
];

export const USERS = [
  // Halyk Bank employees
  { id: "u1",  name: "Фируза Бакиева",     initials: "ФБ", role: "employee",       company: "halyk",         dept: "IT" },
  { id: "u2",  name: "Алмас Нуров",         initials: "АН", role: "manager",        company: "halyk",         dept: "IT" },
  { id: "u3",  name: "Айгуль Касымова",     initials: "АК", role: "hr_specialist",  company: "halyk",         dept: "HR Service Center" },
  { id: "u4",  name: "Дамир Ахметов",       initials: "ДА", role: "hr_specialist",  company: "halyk",         dept: "HR Service Center" },
  { id: "u5",  name: "Лаура Бекова",        initials: "ЛБ", role: "hr_analyst",     company: "halyk",         dept: "HR" },
  { id: "u6",  name: "Марат Сейткали",      initials: "МС", role: "hr_director",    company: "halyk",         dept: "HR" },
  // Subsidiaries
  { id: "u7",  name: "Асель Нурмаганбет",   initials: "АН", role: "hr_subsidiary",  company: "halyk-life",    dept: "HR" },
  { id: "u8",  name: "Бекзат Жумабеков",    initials: "БЖ", role: "manager",        company: "halyk-leasing", dept: "Продажи" },
  { id: "u9",  name: "Гульнара Сатпаева",   initials: "ГС", role: "hr_subsidiary",  company: "halyk-finance", dept: "HR" },
  // Approval chain — HB
  { id: "u10", name: "Серик Байтасов",      initials: "СБ", role: "deputy_msb",     company: "halyk",         dept: "Зампред МСБ" },
  { id: "u11", name: "Мария Колесникова",   initials: "МК", role: "deputy_rb",      company: "halyk",         dept: "Зампред РБ" },
  { id: "u12", name: "Тимур Кулибаев",      initials: "ТК", role: "chairman",       company: "halyk",         dept: "Блок Председателя" },
];

export const ROLE_LABELS = {
  employee:      "Сотрудник",
  manager:       "Руководитель",
  hr_specialist: "HR Специалист",
  hr_analyst:    "HR Аналитик",
  hr_director:   "HR Директор (ГБ)",
  hr_subsidiary: "HR Дочерней компании",
  deputy_msb:    "Зампред МСБ",
  deputy_rb:     "Зампред РБ",
  chairman:      "Председатель",
};

export const MANAGEMENT_BLOCKS = [
  { id: "msb",      label: "МСБ",              approver_role: "deputy_msb", approver_id: "u10", approver_label: "Зампред МСБ" },
  { id: "rb",       label: "РБ",               approver_role: "deputy_rb",  approver_id: "u11", approver_label: "Зампред РБ"  },
  { id: "chairman", label: "Блок Председателя",approver_role: "chairman",   approver_id: "u12", approver_label: "Председатель" },
];

export const CATEGORIES = [
  { id: "hr_admin",      label: "Кадровое администрирование", icon: "📋", color: "#0B6E3A" },
  { id: "recruitment",   label: "Подбор персонала",            icon: "👥", color: "#2563EB" },
  { id: "cb",            label: "Compensation & Benefits",     icon: "💰", color: "#D97706" },
  { id: "learning",      label: "Обучение и развитие",         icon: "📚", color: "#7C3AED" },
  { id: "performance",   label: "Оценка и Performance",        icon: "🎯", color: "#DC2626" },
  { id: "org_dev",       label: "Организационное развитие",    icon: "🏢", color: "#0D9488" },
  { id: "analytics_svc", label: "HR Analytics",                icon: "📊", color: "#059669" },
];

export const SERVICES = [
  { id: "s1",  cat: "hr_admin",      icon: "🏖️", title: "Заявка на отпуск",             sla: "1 раб. день",   sla_days: 1,  desc: "Оформление ежегодного, учебного или административного отпуска.", who: "Любой сотрудник",              docs: ["Заявление (заполняется на портале)"], for_all: true  },
  { id: "s2",  cat: "hr_admin",      icon: "🔄", title: "Заявка на перевод",            sla: "5 раб. дней",  sla_days: 5,  desc: "Перевод на другую должность, в другое подразделение или регион.", who: "Сотрудник / Руководитель",     docs: ["Заявление", "Обоснование", "Согласие сотрудника"], for_all: true  },
  { id: "s3",  cat: "hr_admin",      icon: "📄", title: "Справка с места работы",       sla: "1 раб. день",   sla_days: 1,  desc: "Официальный документ о должности и зарплате для банка, визы, гос. органов.", who: "Любой сотрудник", docs: [], for_all: true  },
  { id: "s4",  cat: "hr_admin",      icon: "✈️", title: "Командировка",                 sla: "2 раб. дня",   sla_days: 2,  desc: "Оформление служебной командировки: приказ, суточные, отчётность.", who: "Руководитель", docs: ["Служебная записка", "Программа поездки"], for_all: true  },
  { id: "s5",  cat: "recruitment",   icon: "🔍", title: "Заявка на подбор персонала",   sla: "3 раб. дня",   sla_days: 3,  desc: "Открытие вакансии и поиск кандидата силами HR Service Center.", who: "Руководитель", docs: ["Описание позиции", "Грейд", "Бюджет ФОТ"], for_all: true  },
  { id: "s6",  cat: "recruitment",   icon: "📝", title: "Согласование вакансии",        sla: "2 раб. дня",   sla_days: 2,  desc: "Согласование должностной инструкции и грейда новой позиции.", who: "Руководитель", docs: ["Проект ДИ", "Обоснование"], for_all: false },
  { id: "s7",  cat: "cb",            icon: "💵", title: "Пересмотр заработной платы",   sla: "5 раб. дней",  sla_days: 5,  desc: "Инициация внецикличного пересмотра оклада. Требует обоснования.", who: "Руководитель", docs: ["Обоснование", "Рыночный анализ"], for_all: false },
  { id: "s8",  cat: "cb",            icon: "🎁", title: "Заявка на премирование",        sla: "3 раб. дня",   sla_days: 3,  desc: "Единовременная премия за выдающиеся достижения.", who: "Руководитель", docs: ["Обоснование", "Подтверждение бюджета"], for_all: true  },
  { id: "s9",  cat: "cb",            icon: "📈", title: "Грейдирование позиции",         sla: "7 раб. дней",  sla_days: 7,  desc: "Оценка и изменение грейда должности с рыночным сравнением.", who: "HR Директор", docs: ["ДИ", "Рыночные данные"], for_all: false },
  { id: "s10", cat: "learning",      icon: "🎓", title: "Запись на обучение",            sla: "2 раб. дня",   sla_days: 2,  desc: "Регистрация на корпоративный тренинг, внешний курс или онлайн-обучение.", who: "Любой сотрудник", docs: ["Одобрение руководителя"], for_all: true  },
  { id: "s11", cat: "learning",      icon: "📜", title: "Запрос на сертификацию",        sla: "5 раб. дней",  sla_days: 5,  desc: "Оплата профессиональной сертификации (PMP, CFA, ACCA и др.).", who: "Сотрудник", docs: ["Обоснование", "Стоимость"], for_all: true  },
  { id: "s12", cat: "performance",   icon: "🎯", title: "Постановка целей",              sla: "3 раб. дня",   sla_days: 3,  desc: "Согласование KPI и целей на квартал или год.", who: "Руководитель", docs: ["Перечень целей"], for_all: false },
  { id: "s13", cat: "performance",   icon: "⭐", title: "Запуск оценки 360",             sla: "5 раб. дней",  sla_days: 5,  desc: "Организация цикла обратной связи для сотрудника.", who: "HR / Руководитель", docs: ["Список оцениваемых"], for_all: false },
  { id: "s14", cat: "org_dev",       icon: "🏗️", title: "Изменение оргструктуры",      sla: "10 раб. дней", sla_days: 10, desc: "Реорганизация подразделения. Включает обновление штатного расписания.", who: "HR Директор", docs: ["Обоснование", "Новая оргструктура", "Бюджет"], for_all: false },
  { id: "s15", cat: "org_dev",       icon: "📌", title: "Создание новой должности",      sla: "7 раб. дней",  sla_days: 7,  desc: "Добавление позиции в штатное расписание с грейдом и ДИ.", who: "Руководитель", docs: ["ДИ", "Обоснование", "Грейд"], for_all: true  },
  { id: "s16", cat: "analytics_svc", icon: "📊", title: "Запрос аналитического отчёта", sla: "3 раб. дня",   sla_days: 3,  desc: "Подготовка HR-отчёта: текучесть, Headcount, ФОТ.", who: "Руководитель / HR", docs: ["Параметры", "Период"], for_all: true  },
  { id: "s17", cat: "analytics_svc", icon: "📉", title: "Анализ текучести кадров",       sla: "5 раб. дней",  sla_days: 5,  desc: "Детальный анализ причин увольнений с рекомендациями.", who: "HR Директор", docs: ["Период", "Подразделения"], for_all: false },
  { id: "s18", cat: "recruitment",   icon: "🤝", title: "Приём и согласование кандидата с ГБ", sla: "5 раб. дней", sla_days: 5, desc: "Направление кандидата на согласование в Головной Банк: HR ГБ → Зампред по блоку → HRD ГБ → решение дочке.", who: "HR дочерней компании", docs: ["Резюме кандидата"], for_all: true },
];

export const STATUS_LABEL = {
  draft:    "Черновик",
  sent:     "Отправлена",
  review:   "Проверка",
  assigned: "Назначен исп.",
  inwork:   "В работе",
  info:     "Нужна инфо",
  done:     "Выполнено",
  closed:   "Закрыто",
};

export const STATUS_COLOR = {
  draft:    "#9CA3AF",
  sent:     "#2563EB",
  review:   "#F59E0B",
  assigned: "#7C3AED",
  inwork:   "#0B6E3A",
  info:     "#DC2626",
  done:     "#059669",
  closed:   "#9CA3AF",
};

export const WORKFLOW_STEPS = ["draft", "sent", "review", "assigned", "inwork", "done", "closed"];

// Candidate approval statuses
export const CAND_STATUS = {
  draft:          { label: "Черновик",            color: "#9CA3AF" },
  pending_hr:     { label: "Ожидает HR ГБ",       color: "#F59E0B" },
  pending_deputy: { label: "Ожидает Зампреда",    color: "#7C3AED" },
  pending_hrd:    { label: "Ожидает HRD ГБ",      color: "#2563EB" },
  approved:       { label: "Согласовано",          color: "#059669" },
  rejected:       { label: "Отклонено",            color: "#DC2626" },
  changes:        { label: "Нужны правки",         color: "#F59E0B" },
};

function d(n) {
  const dt = new Date("2026-06-12");
  dt.setDate(dt.getDate() - n);
  return dt.toLocaleDateString("ru-RU");
}

export const INITIAL_REQUESTS = [
  { id: "HR-001", serviceId: "s3", icon: "📄", title: "Справка с места работы",     status: "inwork",   sla: "1 раб. день",  sla_days: 1, date: d(0),  company: "halyk",         submitterId: "u1",  assigneeId: "u3", dept: "IT",     comment: "Для оформления визы в Великобританию.",          messages: [{ from: "hr", name: "Айгуль К.", text: "Заявка принята в работу. Справка готова к концу дня.", time: "09:30" }], cat: "hr_admin" },
  { id: "HR-002", serviceId: "s1", icon: "🏖️", title: "Заявка на отпуск",           status: "closed",   sla: "1 раб. день",  sla_days: 1, date: d(12), company: "halyk",         submitterId: "u1",  assigneeId: "u3", dept: "IT",     comment: "Ежегодный отпуск с 20 июня по 4 июля.",          messages: [{ from: "hr", name: "Айгуль К.", text: "Отпуск согласован. Приказ подписан. Хорошего отдыха!", time: "10:15" }], cat: "hr_admin", rating: 5 },
  { id: "HR-003", serviceId: "s5", icon: "🔍", title: "Заявка на подбор персонала", status: "review",   sla: "3 раб. дня",   sla_days: 3, date: d(0),  company: "halyk",         submitterId: "u2",  assigneeId: null, dept: "IT",    comment: "Senior React Developer, грейд G11.",              messages: [], cat: "recruitment" },
  { id: "HR-004", serviceId: "s8", icon: "🎁", title: "Заявка на премирование",     status: "assigned", sla: "3 раб. дня",   sla_days: 3, date: d(1),  company: "halyk-life",    submitterId: "u7",  assigneeId: "u4", dept: "Финансы", comment: "Квартальная премия за KPI 130%.",                messages: [{ from: "hr", name: "Дамир А.", text: "Заявка назначена. Проверяем бюджет.", time: "14:00" }], cat: "cb" },
  { id: "HR-005", serviceId: "s10",icon: "🎓", title: "Запись на обучение",          status: "inwork",   sla: "2 раб. дня",   sla_days: 2, date: d(1),  company: "halyk-leasing", submitterId: "u8",  assigneeId: "u4", dept: "Продажи", comment: "Тренинг «Техники продаж» — 15 июня 2026.",      messages: [], cat: "learning" },
  { id: "HR-006", serviceId: "s2", icon: "🔄", title: "Заявка на перевод",          status: "info",     sla: "5 раб. дней",  sla_days: 5, date: d(2),  company: "halyk",         submitterId: "u1",  assigneeId: "u3", dept: "IT",     comment: "Перевод в Департамент Digital.",                  messages: [{ from: "hr", name: "Айгуль К.", text: "Нам нужно согласие вашего руководителя. Приложите подписанный документ.", time: "11:00" }], cat: "hr_admin" },
];

export const INITIAL_CANDIDATES = [
  {
    id: "CA-001",
    submitterId: "u7",
    company: "halyk-life",
    date: d(3),
    candidateName: "Алексей Петров",
    position: "Директор по продажам МСБ",
    department: "Продажи",
    block: "msb",
    expectedSalary: "950 000",
    currency: "KZT",
    resumeFile: "petrov_cv.pdf",
    notes: "Опыт 10 лет в банковском секторе. Ранее работал в Kaspi.",
    status: "pending_deputy",
    approvals: [
      { step: "hr",     label: "HR ГБ",       assigneeId: "u3",  status: "approved",  comment: "Кандидат соответствует требованиям.", date: d(2) },
      { step: "deputy", label: "Зампред МСБ", assigneeId: "u10", status: "pending",   comment: "", date: null },
      { step: "hrd",    label: "HRD ГБ",      assigneeId: "u6",  status: "pending",   comment: "", date: null },
    ],
    messages: [
      { from: "hr", name: "Айгуль К.", text: "Резюме получено. Кандидат направлен на рассмотрение Зампреду МСБ.", time: "10:00" },
    ],
  },
  {
    id: "CA-002",
    submitterId: "u9",
    company: "halyk-finance",
    date: d(7),
    candidateName: "Зарина Муратова",
    position: "Руководитель отдела розничного кредитования",
    department: "Розничный кредит",
    block: "rb",
    expectedSalary: "750 000",
    currency: "KZT",
    resumeFile: "muratova_cv.pdf",
    notes: "Опыт 7 лет. Хорошо знает продукты РБ.",
    status: "approved",
    approvals: [
      { step: "hr",     label: "HR ГБ",      assigneeId: "u3",  status: "approved", comment: "Рекомендована к рассмотрению.", date: d(6) },
      { step: "deputy", label: "Зампред РБ", assigneeId: "u11", status: "approved", comment: "Согласовано.", date: d(5) },
      { step: "hrd",    label: "HRD ГБ",     assigneeId: "u6",  status: "approved", comment: "Финально согласовано. Можете делать оффер.", date: d(4) },
    ],
    messages: [
      { from: "hr", name: "Айгуль К.", text: "Кандидат согласован на всех уровнях. Можете выходить с оффером.", time: "15:30" },
    ],
  },
];
