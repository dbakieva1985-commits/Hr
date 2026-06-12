export const C = {
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
  teal:     "#0891B2",
};

export const COMPANIES = [
  { id: 'halyk',         name: 'Халык Банк',    short: 'HB',  type: 'A', color: '#1F7A5C' },
  { id: 'halyk-life',    name: 'Halyk-Life',    short: 'HL',  type: 'B', color: '#1D4ED8' },
  { id: 'halyk-finance', name: 'Halyk Finance', short: 'HF',  type: 'B', color: '#7C3AED' },
  { id: 'halyk-leasing', name: 'Halyk Leasing', short: 'HLS', type: 'B', color: '#D97706' },
];

export const USERS = [
  { id: 'u1', name: 'Фируза Бакиева',    initials: 'ФБ', role: 'employee',      company: 'halyk',         dept: 'IT' },
  { id: 'u2', name: 'Алмас Нуров',        initials: 'АН', role: 'manager',       company: 'halyk',         dept: 'IT' },
  { id: 'u3', name: 'Айгуль Касымова',    initials: 'АК', role: 'hr_specialist', company: 'halyk',         dept: 'HR Service Center' },
  { id: 'u4', name: 'Дамир Ахметов',      initials: 'ДА', role: 'hr_specialist', company: 'halyk',         dept: 'HR Service Center' },
  { id: 'u5', name: 'Лаура Бекова',       initials: 'ЛБ', role: 'hr_analyst',    company: 'halyk',         dept: 'HR' },
  { id: 'u6', name: 'Марат Сейткали',     initials: 'МС', role: 'hr_director',   company: 'halyk',         dept: 'HR' },
  { id: 'u7', name: 'Асель Нурмаганбет',  initials: 'АН', role: 'employee',      company: 'halyk-life',    dept: 'Финансы' },
  { id: 'u8', name: 'Бекзат Жумабеков',   initials: 'БЖ', role: 'manager',       company: 'halyk-leasing', dept: 'Продажи' },
  { id: 'u9', name: 'Гульнара Сатпаева',  initials: 'ГС', role: 'employee',      company: 'halyk-finance', dept: 'Риски' },
];

export const ROLE_LABELS = {
  employee:      'Сотрудник',
  manager:       'Руководитель',
  hr_specialist: 'HR Специалист',
  hr_analyst:    'HR Аналитик',
  hr_director:   'HR Директор',
};

export const CATEGORIES = [
  { id: 'hr_admin',      label: 'Кадровое администрирование', icon: '📋', color: '#1F7A5C' },
  { id: 'recruitment',   label: 'Подбор персонала',            icon: '👥', color: '#1D4ED8' },
  { id: 'cb',            label: 'Compensation & Benefits',     icon: '💰', color: '#D97706' },
  { id: 'learning',      label: 'Обучение и развитие',         icon: '📚', color: '#7C3AED' },
  { id: 'performance',   label: 'Оценка и Performance',        icon: '🎯', color: '#DC2626' },
  { id: 'org_dev',       label: 'Организационное развитие',    icon: '🏢', color: '#0891B2' },
  { id: 'analytics_svc', label: 'HR Analytics',                icon: '📊', color: '#059669' },
];

export const SERVICES = [
  { id: 's1',  cat: 'hr_admin',      icon: '🏖️', title: 'Заявка на отпуск',             sla: '1 раб. день',   sla_days: 1,  desc: 'Оформление ежегодного, учебного или административного отпуска. Обрабатывается в течение одного рабочего дня.', who: 'Любой сотрудник',              docs: ['Заявление (заполняется на портале)'], for_all: true  },
  { id: 's2',  cat: 'hr_admin',      icon: '🔄', title: 'Заявка на перевод',            sla: '5 раб. дней',  sla_days: 5,  desc: 'Перевод на другую должность, в другое подразделение или регион. Требует согласования руководителя.',              who: 'Сотрудник / Руководитель',     docs: ['Заявление', 'Обоснование перевода', 'Согласие сотрудника'], for_all: true  },
  { id: 's3',  cat: 'hr_admin',      icon: '📄', title: 'Справка с места работы',       sla: '1 раб. день',   sla_days: 1,  desc: 'Официальный документ о должности и зарплате для банка, оформления визы, государственных органов.',                who: 'Любой сотрудник',              docs: [], for_all: true  },
  { id: 's4',  cat: 'hr_admin',      icon: '✈️', title: 'Командировка',                 sla: '2 раб. дня',   sla_days: 2,  desc: 'Оформление служебной командировки: приказ, суточные, отчётность.',                                                 who: 'Руководитель',                 docs: ['Служебная записка', 'Программа поездки'], for_all: true  },
  { id: 's5',  cat: 'recruitment',   icon: '🔍', title: 'Заявка на подбор персонала',   sla: '3 раб. дня',   sla_days: 3,  desc: 'Открытие вакансии и поиск кандидата силами HR Service Center. Включает подготовку должностной инструкции.',       who: 'Руководитель',                 docs: ['Описание позиции', 'Требуемый грейд', 'Бюджет ФОТ'], for_all: true  },
  { id: 's6',  cat: 'recruitment',   icon: '📝', title: 'Согласование вакансии',        sla: '2 раб. дня',   sla_days: 2,  desc: 'Согласование должностной инструкции и грейда новой позиции.',                                                     who: 'Руководитель',                 docs: ['Проект ДИ', 'Обоснование новой позиции'], for_all: false },
  { id: 's7',  cat: 'cb',            icon: '💵', title: 'Пересмотр заработной платы',   sla: '5 раб. дней',  sla_days: 5,  desc: 'Инициация внецикличного пересмотра оклада. Требует обоснования и одобрения HR Директора.',                        who: 'Руководитель',                 docs: ['Обоснование', 'Рыночный анализ'], for_all: false },
  { id: 's8',  cat: 'cb',            icon: '🎁', title: 'Заявка на премирование',        sla: '3 раб. дня',   sla_days: 3,  desc: 'Единовременная премия за выдающиеся достижения. Требует одобрения руководителя и HR.',                            who: 'Руководитель',                 docs: ['Обоснование', 'Подтверждение бюджета'], for_all: true  },
  { id: 's9',  cat: 'cb',            icon: '📈', title: 'Грейдирование позиции',         sla: '7 раб. дней',  sla_days: 7,  desc: 'Оценка и изменение грейда должности. Включает рыночное сравнение и согласование.',                                who: 'HR Директор',                  docs: ['Должностная инструкция', 'Рыночные данные'], for_all: false },
  { id: 's10', cat: 'learning',      icon: '🎓', title: 'Запись на обучение',            sla: '2 раб. дня',   sla_days: 2,  desc: 'Регистрация на корпоративный тренинг, внешний курс или онлайн-обучение.',                                         who: 'Любой сотрудник',              docs: ['Одобрение руководителя'], for_all: true  },
  { id: 's11', cat: 'learning',      icon: '📜', title: 'Запрос на сертификацию',        sla: '5 раб. дней',  sla_days: 5,  desc: 'Оплата профессиональной сертификации (PMP, CFA, ACCA и др.). Требует обоснования ROI.',                           who: 'Сотрудник',                    docs: ['Обоснование', 'Стоимость сертификации', 'Связь с должностью'], for_all: true  },
  { id: 's12', cat: 'performance',   icon: '🎯', title: 'Постановка целей',              sla: '3 раб. дня',   sla_days: 3,  desc: 'Согласование KPI и целей на квартал или год.',                                                                    who: 'Руководитель',                 docs: ['Перечень целей'], for_all: false },
  { id: 's13', cat: 'performance',   icon: '⭐', title: 'Запуск оценки 360',             sla: '5 раб. дней',  sla_days: 5,  desc: 'Организация цикла обратной связи для сотрудника от коллег, руководителя и подчинённых.',                         who: 'HR Специалист / Руководитель', docs: ['Список оцениваемых', 'Список оценщиков'], for_all: false },
  { id: 's14', cat: 'org_dev',       icon: '🏗️', title: 'Изменение оргструктуры',      sla: '10 раб. дней', sla_days: 10, desc: 'Реорганизация подразделения или бизнес-единицы. Включает обновление штатного расписания.',                        who: 'HR Директор',                  docs: ['Обоснование', 'Новая оргструктура', 'Бюджетный расчёт'], for_all: false },
  { id: 's15', cat: 'org_dev',       icon: '📌', title: 'Создание новой должности',      sla: '7 раб. дней',  sla_days: 7,  desc: 'Добавление позиции в штатное расписание с присвоением грейда и написанием ДИ.',                                 who: 'Руководитель',                 docs: ['Должностная инструкция', 'Обоснование', 'Грейд'], for_all: true  },
  { id: 's16', cat: 'analytics_svc', icon: '📊', title: 'Запрос аналитического отчёта', sla: '3 раб. дня',   sla_days: 3,  desc: 'Подготовка HR-отчёта: текучесть, Headcount, ФОТ, сравнение с рынком.',                                           who: 'Руководитель / HR',            docs: ['Параметры отчёта', 'Нужный период'], for_all: true  },
  { id: 's17', cat: 'analytics_svc', icon: '📉', title: 'Анализ текучести кадров',       sla: '5 раб. дней',  sla_days: 5,  desc: 'Детальный анализ причин увольнений с рекомендациями по снижению текучести.',                                     who: 'HR Директор / Руководитель',   docs: ['Период', 'Подразделения для анализа'], for_all: false },
];

export const STATUS_LABEL = {
  draft:    'Черновик',
  sent:     'Отправлена',
  review:   'Проверка',
  assigned: 'Назначен исп.',
  inwork:   'В работе',
  info:     'Нужна инфо',
  done:     'Выполнено',
  closed:   'Закрыто',
};

export const STATUS_COLOR = {
  draft:    '#6B7280',
  sent:     '#1D4ED8',
  review:   '#D97706',
  assigned: '#7C3AED',
  inwork:   '#1F7A5C',
  info:     '#DC2626',
  done:     '#059669',
  closed:   '#6B7280',
};

export const WORKFLOW_STEPS = ['draft', 'sent', 'review', 'assigned', 'inwork', 'done', 'closed'];

function d(daysBack) {
  const dt = new Date('2026-06-12');
  dt.setDate(dt.getDate() - daysBack);
  return dt.toLocaleDateString('ru-RU');
}

export const INITIAL_REQUESTS = [
  {
    id: 'HR-001', serviceId: 's3', icon: '📄', title: 'Справка с места работы',
    status: 'inwork', sla: '1 раб. день', sla_days: 1,
    date: d(0), company: 'halyk', submitterId: 'u1', assigneeId: 'u3',
    dept: 'IT', comment: 'Для оформления визы в Великобританию.',
    messages: [{ from: 'hr', name: 'Айгуль К.', text: 'Заявка принята в работу. Справка будет готова сегодня.', time: '09:30' }],
    cat: 'hr_admin',
  },
  {
    id: 'HR-002', serviceId: 's1', icon: '🏖️', title: 'Заявка на отпуск',
    status: 'closed', sla: '1 раб. день', sla_days: 1,
    date: d(12), company: 'halyk', submitterId: 'u1', assigneeId: 'u3',
    dept: 'IT', comment: 'Ежегодный отпуск с 20 июня по 4 июля.',
    messages: [{ from: 'hr', name: 'Айгуль К.', text: 'Отпуск согласован. Приказ подписан. Хорошего отдыха!', time: '10:15' }],
    cat: 'hr_admin', rating: 5,
  },
  {
    id: 'HR-003', serviceId: 's5', icon: '🔍', title: 'Заявка на подбор персонала',
    status: 'review', sla: '3 раб. дня', sla_days: 3,
    date: d(0), company: 'halyk', submitterId: 'u2', assigneeId: null,
    dept: 'IT', comment: 'Senior React Developer, грейд G11. Опыт от 4 лет.',
    messages: [], cat: 'recruitment',
  },
  {
    id: 'HR-004', serviceId: 's8', icon: '🎁', title: 'Заявка на премирование',
    status: 'assigned', sla: '3 раб. дня', sla_days: 3,
    date: d(1), company: 'halyk-life', submitterId: 'u7', assigneeId: 'u4',
    dept: 'Финансы', comment: 'Квартальная премия за перевыполнение KPI на 130%.',
    messages: [{ from: 'hr', name: 'Дамир А.', text: 'Заявка назначена. Проверяем бюджет.', time: '14:00' }],
    cat: 'cb',
  },
  {
    id: 'HR-005', serviceId: 's10', icon: '🎓', title: 'Запись на обучение',
    status: 'inwork', sla: '2 раб. дня', sla_days: 2,
    date: d(1), company: 'halyk-leasing', submitterId: 'u8', assigneeId: 'u4',
    dept: 'Продажи', comment: 'Тренинг «Техники продаж» — 15 июня 2026.',
    messages: [], cat: 'learning',
  },
  {
    id: 'HR-006', serviceId: 's2', icon: '🔄', title: 'Заявка на перевод',
    status: 'info', sla: '5 раб. дней', sla_days: 5,
    date: d(2), company: 'halyk', submitterId: 'u1', assigneeId: 'u3',
    dept: 'IT', comment: 'Перевод в Департамент Digital на позицию Tech Lead.',
    messages: [{ from: 'hr', name: 'Айгуль К.', text: 'Нам необходимо согласие вашего текущего руководителя. Пожалуйста, приложите подписанный документ.', time: '11:00' }],
    cat: 'hr_admin',
  },
  {
    id: 'HR-007', serviceId: 's16', icon: '📊', title: 'Запрос аналитического отчёта',
    status: 'done', sla: '3 раб. дня', sla_days: 3,
    date: d(5), company: 'halyk-finance', submitterId: 'u9', assigneeId: 'u5',
    dept: 'Риски', comment: 'Headcount и ФОТ за Q1 2026 по всей группе.',
    messages: [{ from: 'hr', name: 'Лаура Б.', text: 'Отчёт подготовлен и отправлен на ваш корпоративный email.', time: '15:30' }],
    cat: 'analytics_svc',
  },
  {
    id: 'HR-008', serviceId: 's11', icon: '📜', title: 'Запрос на сертификацию',
    status: 'review', sla: '5 раб. дней', sla_days: 5,
    date: d(0), company: 'halyk', submitterId: 'u1', assigneeId: null,
    dept: 'IT', comment: 'AWS Solutions Architect Professional. Стоимость: 300 USD.',
    messages: [], cat: 'learning',
  },
];
