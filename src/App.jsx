import { useState, useEffect } from "react";

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  green:       "#00B156",
  greenDark:   "#007A3D",
  greenLight:  "#E8F5EE",
  white:       "#FFFFFF",
  bg:          "#F2F2F7",
  dark:        "#1C1C1E",
  gray2:       "#636366",
  gray4:       "#C7C7CC",
  gray6:       "#F2F2F7",
  orange:      "#FF9500",
  blue:        "#007AFF",
  purple:      "#7C3AED",
  purpleLight: "#F3EEFF",
};

// ── Country helpers ────────────────────────────────────────────────────────
function isRu(c) {
  const raw = (c.country || "").toLowerCase();
  return (
    raw.includes("россия") ||
    raw.includes("москва") ||
    raw.includes("\u{1F1F7}\u{1F1FA}") ||
    /\bрф\b/.test(raw) ||
    /\bru\b/.test(raw)
  );
}
function isKz(c) {
  const raw = (c.country || "").toLowerCase();
  return (
    raw.includes("казахстан") ||
    raw.includes("алматы") ||
    raw.includes("\u{1F1F0}\u{1F1FF}") ||
    /\bкз\b/.test(raw) ||
    /\bkz\b/.test(raw)
  );
}
function isRfKz(c) { return isRu(c) || isKz(c); }

// ── All candidates ─────────────────────────────────────────────────────────
const CANDIDATES = [
  // ── Зарубежные: Revolut ──
  {
    id:"vlad-yatsenko", level:1, company:"Revolut", country:"🇬🇧 Великобритания",
    name:"Vlad Yatsenko", title:"Co-founder & CTO",
    url:"https://www.linkedin.com/in/yatsenko/", status:null,
    desc:"Глобальный необанк: банкинг, инвестиции, криптовалюта, международные платежи.",
    bio:"Сооснователь и технический директор Revolut — одной из самых дорогих финтех-компаний Европы. Выходец из Goldman Sachs, создал с нуля технологическую платформу, которой сегодня пользуются 50+ млн человек."
  },
  {
    id:"ilya-vorobiev", level:1, company:"Revolut", country:"🇺🇸 Калифорния",
    name:"Ilya Vorobiev", title:"CPO / CTO",
    url:"https://www.linkedin.com/in/ivorobiev/", status:"написала в LinkedIn",
    desc:null,
    bio:"Продуктовый и технологический лидер Revolut в США. Строит мобильный банкинг нового поколения для американского рынка, используя опыт топовых кремниевых технологических компаний."
  },
  {
    id:"nik-storonsky", level:1, company:"Revolut", country:"🇬🇧 Лондон",
    name:"Nik Storonsky", title:"Founder & CEO",
    url:"https://www.linkedin.com/in/nstoronsky/", status:null,
    desc:null,
    bio:"Основатель и CEO Revolut — финтех-компании с оценкой $45 млрд. Бывший трейдер Credit Suisse и Lehman Brothers, создал самый быстрорастущий цифровой банк в мире за 10 лет."
  },
  {
    id:"siddhartha-jajodia", level:1, company:"Revolut", country:"🇬🇧 Великобритания",
    name:"Siddhartha Jajodia", title:"Group Chief Banking Officer",
    url:"https://www.linkedin.com/in/siddhartha-jajodia-09a6421/", status:null,
    desc:null,
    bio:"Главный банковский директор Revolut. Более 20 лет опыта в банковском секторе — руководил банковскими операциями в Barclays и Standard Chartered перед переходом в финтех."
  },
  {
    id:"dmytro-strelchuk", level:1, company:"Revolut", country:"🇬🇧 Лондон",
    name:"Dmytro Strelchuk", title:null,
    url:"https://www.linkedin.com/in/dmytro-strelchuk/", status:null,
    desc:null,
    bio:"Топ-менеджер Revolut с глубоким опытом в масштабировании технологических команд. Участвует в построении глобальной инфраструктуры одного из крупнейших необанков мира."
  },
  {
    id:"paulo-pereira", level:1, company:"Revolut", country:"🇬🇧 Лондон",
    name:"Paulo Pereira", title:"Director, Global Head of Product",
    url:"https://www.linkedin.com/in/paulo-gpereira/", status:"написала в LinkedIn",
    desc:null,
    bio:"Глобальный директор по продукту Revolut. Отвечает за продуктовую стратегию всего банковского и платёжного портфеля на 40+ рынках, ранее работал в Google и ведущих европейских финтех-компаниях."
  },
  {
    id:"michal-laube", level:1, company:"Revolut", country:"🇱🇺 Люксембург",
    name:"Michal Laube", title:"COO",
    url:"https://www.linkedin.com/in/michals/", status:null,
    desc:null,
    bio:"Операционный директор Revolut. Выстраивает операционную модель для масштабирования бизнеса на рынках ЕС, обеспечивая соответствие регуляторным требованиям при работе с банковской лицензией."
  },
  {
    id:"matt-baxby", level:1, company:"Revolut", country:"🇦🇺 Австралия",
    name:"Matt Baxby", title:"Partner, CEO Australia / NZ & APAC",
    url:"https://www.linkedin.com/in/mattbaxby/", status:null,
    desc:null,
    bio:"Генеральный директор Revolut в Австралии, Новой Зеландии и Азиатско-Тихоокеанском регионе. Построил один из самых быстрорастущих цифровых банков в APAC, до Revolut — руководил в Virgin Money."
  },
  {
    id:"carlos-selonke", level:1, company:"Revolut", country:"🇬🇧 Лондон",
    name:"Carlos Selonke", title:"Chief Information Officer",
    url:"https://www.linkedin.com/in/carlosselonke/", status:null,
    desc:null,
    bio:"Директор по информационным технологиям Revolut. Отвечает за кибербезопасность, IT-инфраструктуру и технологическую устойчивость системы, обслуживающей 50+ млн пользователей."
  },
  {
    id:"donato-lucia", level:1, company:"Revolut", country:"🇬🇧 Великобритания",
    name:"Donato Lucia", title:"Partner & VP of Technology",
    url:"https://www.linkedin.com/in/donatolucia/", status:null,
    desc:null,
    bio:"Вице-президент по технологиям Revolut. Строит высоконагруженные системы обработки платежей и backend-инфраструктуру для одной из наиболее технологичных финтех-компаний в мире."
  },
  {
    id:"francesca-carlesi", level:1, company:"Revolut", country:"🇬🇧 Великобритания",
    name:"Francesca Carlesi", title:"CEO",
    url:"https://www.linkedin.com/in/francesca-carlesi-b326922/", status:null,
    desc:null,
    bio:"CEO Revolut UK (банковская лицензия). Опытный банковский руководитель с карьерой в McKinsey и ведущих европейских банках — возглавила регулируемое банковское направление Revolut."
  },
  {
    id:"beatrice-cossa", level:1, company:"Revolut", country:"🇫🇷 Париж",
    name:"Beatrice Cossa-Dumurgier", title:"CEO Western Europe",
    url:"https://www.linkedin.com/in/beatrice-cossa-dumurgier-b30b2b7/", status:null,
    desc:null,
    bio:"CEO Revolut для Западной Европы. Руководит ростом бизнеса во Франции, Испании, Германии и Италии — до Revolut занимала руководящие позиции в Credit Agricole и Orange Bank."
  },
  {
    id:"nicola-vicino", level:1, company:"Revolut", country:"🇮🇹 Милан",
    name:"Nicola Vicino", title:"General Manager Italy",
    url:"https://www.linkedin.com/in/nicolavicino/", status:null,
    desc:null,
    bio:"Генеральный директор Revolut в Италии. Вывел Revolut в топ-3 самых скачиваемых финансовых приложений Италии, выстраивая локальные партнёрства и продуктовую адаптацию."
  },
  {
    id:"james-gibson", level:1, company:"Revolut", country:"🇬🇧 Великобритания",
    name:"James Gibson", title:"Head of Revolut Business & Partner",
    url:"https://www.linkedin.com/in/james-gibson-94364b65/", status:null,
    desc:null,
    bio:"Руководитель B2B направления Revolut Business. Развивает банковский продукт для малого и среднего бизнеса с 500 000+ корпоративных клиентов по всему миру."
  },
  {
    id:"yana-shkrebenkova", level:1, company:"Revolut", country:"🇬🇧 Великобритания",
    name:"Yana Shkrebenkova", title:"Head of Wealth & Trading UK",
    url:"https://www.linkedin.com/in/shkrebenkova/", status:null,
    desc:null,
    bio:"Руководитель направления Wealth & Trading в Revolut UK. Развивает инвестиционные продукты — акции, ETF, золото и криптовалюту — для миллионов розничных инвесторов."
  },
  {
    id:"jonathan-beaney-rev", level:1, company:"Revolut | Ex-Amazon", country:"🇪🇸 Испания",
    name:"Jonathan Beaney", title:null,
    url:"https://www.linkedin.com/in/jonathan-beaney-10b3b75b/", status:null,
    desc:null,
    bio:"Топ-менеджер с опытом в Amazon и Revolut. Объединяет экспертизу в e-commerce и цифровом банкинге, работал над продуктами для глобальных рынков."
  },

  // ── Зарубежные: Wise ──
  {
    id:"harsh-sinha", level:1, company:"Wise", country:"🇬🇧 Великобритания",
    name:"Harsh Sinha", title:"Chief Technology Officer",
    url:"https://www.linkedin.com/in/harshsinha/", status:null,
    desc:"Международная платформа для дешёвых трансграничных переводов и мультивалютных счетов.",
    bio:"Технический директор Wise (бывш. TransferWise). Построил глобальную платёжную инфраструктуру, через которую ежегодно проходит более $100 млрд, до этого — CTO PayPal."
  },
  {
    id:"diana-avila", level:1, company:"Wise", country:"🇬🇧 Лондон",
    name:"Diana Avila", title:"Chief Banking and Expansion Officer",
    url:"https://www.linkedin.com/in/diana-avila-g/", status:null,
    desc:null,
    bio:"Директор по банкингу и развитию Wise. Отвечает за получение банковских лицензий и регуляторное расширение на новые рынки, обеспечивая рост Wise в 80+ странах."
  },

  // ── Зарубежные: Yandex (США) ──
  {
    id:"madina-seisengaliyeva", level:1, company:"Yandex", country:"🇺🇸 США",
    name:"Madina Seisengaliyeva", title:"Commercial Strategy Leader, FMCG & AdTech",
    url:"https://www.linkedin.com/in/madina-seisengaliyeva/", status:"написала, встреча с 29.06",
    desc:null,
    bio:"Руководитель коммерческой стратегии Yandex в сегментах FMCG и AdTech. Связывает крупнейшие потребительские бренды с рекламной экосистемой Яндекса на рынках СНГ, ранее работала в P&G."
  },

  // ── Зарубежные: Neobanks ──
  {
    id:"maximilian-tayenthal", level:1, company:"N26", country:"🇩🇪 Берлин",
    name:"Maximilian Tayenthal", title:"Co-founder",
    url:"https://www.linkedin.com/in/maximilian-tayenthal/", status:null,
    desc:"Мобильный банк для простого управления личными финансами в Европе.",
    bio:"Сооснователь N26 — одного из ведущих европейских необанков с 8 млн клиентами. Юрист по образованию, построил с нуля полностью цифровой банк с банковской лицензией ЕС."
  },
  {
    id:"andy-smart", level:1, company:"Monzo", country:"🇬🇧 Великобритания",
    name:"Andy Smart", title:"Chief Product Officer",
    url:"https://www.linkedin.com/in/andysmart/", status:null,
    desc:"Цифровой банк с акцентом на мобильное приложение и бюджетирование.",
    bio:"Директор по продукту Monzo — одного из самых любимых банков Великобритании с 10+ млн клиентов. Создаёт инновационные функции бюджетирования и аналитики расходов для нового поколения пользователей."
  },
  {
    id:"joe-gordon", level:1, company:"Starling Bank", country:"🇬🇧 Великобритания",
    name:"Joe Gordon", title:"Chief Operating Officer",
    url:"https://www.linkedin.com/in/joe-gordon/", status:null,
    desc:"Необанк с банковской лицензией для физических лиц и бизнеса.",
    bio:"Операционный директор Starling Bank — многократного победителя UK Banking Awards. Отвечает за операции прибыльного необанка с полной банковской лицензией и 3+ млн клиентов."
  },
  {
    id:"bianca-zwart", level:1, company:"bunq", country:"🇳🇱 Амстердам",
    name:"Bianca Zwart", title:"Chief Strategy Officer",
    url:"https://www.linkedin.com/in/bianca-zwart/", status:null,
    desc:"Европейский мобильный банк с мультивалютными счетами.",
    bio:"Директор по стратегии bunq — европейского «банка свободы» с акцентом на устойчивое развитие. Формирует долгосрочное позиционирование bunq как второй банковской лицензии ЕС для эспатов и цифровых кочевников."
  },
  {
    id:"cristina-junqueira", level:1, company:"Nubank", country:"🇧🇷 Сан-Паулу",
    name:"Cristina Junqueira", title:"Co-founder",
    url:"https://www.linkedin.com/in/crisjunqueira/", status:null,
    desc:"Крупнейший цифровой банк Латинской Америки с десятками миллионов клиентов.",
    bio:"Сооснователь Nubank — крупнейшего цифрового банка в мире по числу клиентов (100+ млн). Бывший директор Itaú Unibanco, создала банк, который перевернул финансовую систему Латинской Америки."
  },
  {
    id:"ryan-king", level:1, company:"Chime", country:"🇺🇸 Сан-Франциско",
    name:"Ryan King", title:"Co-founder",
    url:"https://www.linkedin.com/in/ryanaking/", status:null,
    desc:"Популярная цифровая банковская платформа для повседневных финансов.",
    bio:"Сооснователь Chime — одного из крупнейших необанков США с 22+ млн клиентами. Построил платформу, ориентированную на рабочий класс Америки, с оценкой $25 млрд."
  },
  {
    id:"jason-zhang", level:1, company:"Mercury", country:"🇺🇸 Сан-Франциско",
    name:"Jason Zhang", title:"Co-founder & COO",
    url:"https://www.linkedin.com/in/jason-zhang-5645a860/", status:null,
    desc:"Цифровая банковская платформа для стартапов и технологических компаний.",
    bio:"Сооснователь и операционный директор Mercury. Создал цифровой банк, ставший стандартом для стартапов Кремниевой долины, — оборот $50+ млрд, более 200 000 клиентов-компаний."
  },
  {
    id:"pedro-franceschi", level:1, company:"Brex", country:"🇺🇸 Сан-Франциско",
    name:"Pedro Franceschi", title:"Founder",
    url:"https://www.linkedin.com/in/pfranceschi/", status:null,
    desc:"Финансовая платформа для бизнеса: корпоративные карты и управление расходами.",
    bio:"Основатель Brex — ведущей финансовой платформы для корпоративных клиентов с оценкой $12 млрд. Создал компанию в 19 лет, превратив её в обязательный инструмент для американских стартапов."
  },
  {
    id:"trevor-marshall", level:1, company:"Current", country:"🇺🇸 Нью-Йорк",
    name:"Trevor Marshall", title:"Chief Technology Officer",
    url:"https://www.linkedin.com/in/trevor-kurth-marshall/", status:null,
    desc:"Мобильный необанк для молодой аудитории и персональных финансов.",
    bio:"Технический директор Current — мобильного банка нового поколения. Строит продукты для молодёжной аудитории, включая платёжные карты для подростков и быстрые переводы без комиссий."
  },
  {
    id:"soren-kyhl", level:1, company:"Lunar", country:"🇩🇰 Копенгаген",
    name:"Søren Kyhl", title:"Chief Operating Officer",
    url:"https://www.linkedin.com/in/soerenkyhl/", status:null,
    desc:"Крупнейший цифровой банк Скандинавии.",
    bio:"Операционный директор Lunar — крупнейшего скандинавского необанка с операциями в Дании, Швеции и Норвегии. Прежде занимал позиции в Danske Bank и Saxo Bank."
  },
  {
    id:"gavin-michael", level:1, company:"Varo Bank", country:"🇺🇸 США",
    name:"Gavin Michael", title:"President",
    url:"https://www.linkedin.com/in/gavincmichael/", status:null,
    desc:"Один из первых необанков США с собственной банковской лицензией.",
    bio:"Президент Varo Bank — первого потребительского необанка в США, получившего полную национальную банковскую лицензию. Экс-CTO Citigroup и Accenture, специализируется на цифровой трансформации в банкинге."
  },
  {
    id:"lauren-stafford-webb", level:1, company:"SoFi", country:"🇺🇸 Сан-Франциско",
    name:"Lauren Stafford Webb", title:"Chief Marketing Officer",
    url:"https://www.linkedin.com/in/lauren-stafford-webb/", status:null,
    desc:"Финтех: банкинг, инвестиции, кредиты и финансовое планирование.",
    bio:"Директор по маркетингу SoFi — американского финансового суперприложения с банковской лицензией. Выстраивает бренд, охватывающий банкинг, инвестиции, студенческие кредиты и ипотеку."
  },
  {
    id:"david-sandstrom", level:1, company:"Klarna", country:"🇸🇪 Стокгольм",
    name:"David Sandström", title:"Chief Marketing Officer",
    url:"https://www.linkedin.com/in/davidsandstrom/", status:null,
    desc:"Глобальный финтех-лидер в сфере BNPL и онлайн-платежей.",
    bio:"Директор по маркетингу Klarna — мирового лидера в сфере BNPL с 150+ млн клиентами. Создал один из самых узнаваемых финтех-брендов мира, сочетая смелый дизайн и культурные коллаборации."
  },

  // ── Зарубежные: прочие ──
  {
    id:"valentin-morozov", level:1, company:"Kuda", country:"🇦🇿 Баку",
    name:"Valentin Morozov", title:"CEO / Board Member",
    url:null, status:null,
    desc:"Оператор банков на развивающихся рынках, бэкграунд McKinsey.",
    bio:"CEO и член совета директоров в сфере банкинга на развивающихся рынках. Консультант McKinsey, специализирующийся на цифровой трансформации финансовых институтов в СНГ и Африке."
  },
  {
    id:"jonathan-g", level:1, company:"ex-HSBC / Bank of England", country:"🇬🇧 Лондон",
    name:"Jonathan G.", title:"Head of Wise UK",
    url:"https://www.linkedin.com/in/jonathan-beaney-10b3b75b/", status:null,
    desc:null,
    bio:"Руководитель Wise UK с богатым институциональным бэкграундом — HSBC и Банк Англии. Сочетает глубокое понимание регуляторной среды с опытом масштабирования финтех-продукта в Великобритании."
  },
  {
    id:"aziz-tulaganov", level:1, company:"ex-Yandex / ex-PwC", country:"🇩🇪 Берлин",
    name:"Aziz Tulaganov", title:"Discovery, Growth & AI — CSPO, CSM, PMP",
    url:"https://www.linkedin.com/in/aziz-tulaganov/", status:null,
    desc:null,
    bio:"Сертифицированный продуктовый и проектный лидер (CSPO, CSM, PMP) с опытом в Яндексе и PwC. Специализируется на product discovery, growth-метриках и внедрении ИИ в продуктовые процессы."
  },

  // ── Зарубежные: T-Bank Dubai ──
  {
    id:"dmitry-vorobey", level:2, company:"T-Bank", country:"🇦🇪 Дубай",
    name:"Dmitry Vorobey", title:"CPO, Tinkoff Travel",
    url:"https://www.linkedin.com/in/dmitry-vorobey-334b991b4/", status:"написала в LinkedIn, готова встречаться",
    desc:null,
    bio:"Директор по продукту Tinkoff Travel — одной из крупнейших тревел-платформ России в экосистеме Т-Банка. Сейчас базируется в Дубае, строит международные продуктовые команды."
  },

  // ── Кандидаты РФ и КЗ: T-Bank ──
  {
    id:"pavel-fedorov", level:2, company:"T-Bank", country:"🇷🇺 Россия",
    name:"Pavel Fedorov", title:"Экс-вице-президент",
    url:"https://www.linkedin.com/in/pavel-fedorov/", status:null,
    desc:"Один из крупнейших цифровых банков: банкинг, страхование и инвестиции без отделений.",
    bio:"Бывший вице-президент Т-Банка — одного из крупнейших цифровых банков России с 40+ млн клиентов. Отвечал за масштабирование ключевых банковских продуктов и стратегическое развитие."
  },
  {
    id:"maxim-savchenko", level:2, company:"T-Bank", country:"🇷🇺 Россия",
    name:"Maxim Savchenko", title:"CPO, T-Data & Transactions",
    url:"https://www.linkedin.com/in/maxim-savchenko-5b1a6196/", status:"написала в LinkedIn",
    desc:null,
    bio:"Директор по продукту в направлении Data & Transactions Т-Банка. Отвечает за продуктовую стратегию в области данных и транзакционных сервисов для десятков миллионов активных пользователей."
  },
  {
    id:"fedor-moroz", level:2, company:"T-Bank", country:"🇷🇺 Россия",
    name:"Федор Мороз", title:"Head of Business Protection",
    url:"https://www.linkedin.com/in/fedor-moroz-29b20781/", status:"написала в LinkedIn",
    desc:null,
    bio:"Руководитель направления защиты бизнеса в Т-Банке. Выстраивает систему противодействия мошенничеству и управления рисками для одного из наиболее технологически зрелых банков России."
  },
  {
    id:"dmitriy-bogachev", level:2, company:"T-Bank", country:"🇷🇺 Россия",
    name:"Dmitriy Bogachev", title:"CPO of Loyalty and Cashback",
    url:"https://www.linkedin.com/in/dmitriy-bogachev/", status:null,
    desc:null,
    bio:"Директор по продукту программ лояльности и кэшбэка Т-Банка. Создаёт одну из самых популярных программ вознаграждений в России — более 30 млн активных участников."
  },

  // ── Кандидаты КЗ: Yandex ──
  {
    id:"timur-shalekenov", level:2, company:"Yandex Qazaqstan", country:"🇰🇿 Алматы",
    name:"Timur Shalekenov", title:"CEO",
    url:"https://www.linkedin.com/in/timur-shalekenov-80a07037/", status:null,
    desc:null,
    bio:"Генеральный директор Yandex Qazaqstan. Руководит всей экосистемой Яндекса в Казахстане — от поиска и карт до такси и e-commerce."
  },
  {
    id:"yerzhan-bazarbay", level:2, company:"Yandex Delivery KZ", country:"🇰🇿 Алматы",
    name:"Yerzhan Bazarbay", title:"General Manager",
    url:"https://www.linkedin.com/in/bazarbayyerzhan/", status:null,
    desc:null,
    bio:"Генеральный менеджер Yandex Delivery в Казахстане. Развивает логистическую платформу последней мили в казахстанских городах, интегрируя её с ритейл-партнёрами и e-commerce."
  },
  {
    id:"alex-zakharov", level:2, company:"Yandex", country:"🇷🇺 Россия",
    name:"Алексей Захаров", title:"CPO",
    url:"https://www.linkedin.com/in/alex-zakharov-/", status:"написала в LinkedIn",
    desc:null,
    bio:"Директор по продукту Яндекса. Один из ключевых продуктовых лидеров компании с 100+ млн ежемесячных пользователей — формирует продуктовую стратегию для всей экосистемы сервисов."
  },
  {
    id:"goran-groza", level:2, company:"Yandex Eats", country:"🇰🇿 Казахстан",
    name:"Goran Groza", title:"General Manager",
    url:"https://www.linkedin.com/in/goran-groza/", status:"написала в LinkedIn",
    desc:null,
    bio:"Генеральный менеджер Яндекс Еды в Казахстане. Масштабирует food-delivery платформу на казахстанском рынке, выстраивая партнёрства с ресторанами и сети доставки."
  },
  {
    id:"mikhail-chizhikov", level:2, company:"Avito / ex-VK / ex-Yandex", country:"🇷🇺 Москва",
    name:"Mikhail Chizhikov", title:"Chief Product Officer",
    url:"https://www.linkedin.com/in/mikhail-chizhikov-48b792a8/", status:null,
    desc:null,
    bio:"Директор по продукту Avito — крупнейшего сайта объявлений России. Прежде занимал продуктовые позиции в ВКонтакте и Яндексе, формируя опыт на топовых платформах рунета."
  },
  {
    id:"kirill-n", level:2, company:"Ozon Bank | ex-Yandex", country:"🇷🇺 Россия",
    name:"Kirill N.", title:"Коммерческий директор",
    url:"https://www.linkedin.com/in/kirillnepomnyashchiy/", status:"написала в LinkedIn",
    desc:null,
    bio:"Коммерческий директор Ozon Bank, экс-Яндекс. Строит банковскую вертикаль внутри крупнейшего российского маркетплейса, интегрируя финансовые сервисы с e-commerce экосистемой."
  },

  // ── Кандидаты РФ: прочие ──
  {
    id:"mike-zharchev", level:2, company:"ex-Revolut / VividMoney", country:"🇷🇺 Россия",
    name:"Mike Zharchev", title:"CPO at MWS AI | Co-Founder Untitled Bank",
    url:"https://www.linkedin.com/in/mike-zharchev-24b92094/", status:null,
    desc:null,
    bio:"Директор по продукту MWS AI и сооснователь Untitled Bank. Экс-Revolut, специализируется на ИИ-продуктах и строит следующее поколение цифрового банкинга для российского рынка."
  },
  {
    id:"artem-suslov", level:2, company:"ex-MTS Fintech / Raiffeisen", country:"🇷🇺 Москва",
    name:"Artem Suslov", title:"Head of PMO",
    url:"https://www.linkedin.com/in/artem-suslov-898b9a27/", status:null,
    desc:null,
    bio:"Руководитель PMO с опытом в MTS Fintech и Raiffeisen Bank. Специализируется на управлении крупными цифровыми трансформациями в банковском секторе России."
  },
  {
    id:"maxim-ivanov", level:2, company:"Untitled Bank", country:"🇷🇺 Россия",
    name:"Maxim Ivanov", title:"CBDO / CSO",
    url:"https://www.linkedin.com/in/mike-zharchev-24b92094/", status:null,
    desc:null,
    bio:"Директор по развитию бизнеса и стратегии Untitled Bank — нового цифрового банка. Строит бизнес-модель и коммерческие партнёрства для стартапа нового поколения банкинга."
  },
  {
    id:"alexander-nedospasov", level:2, company:"ex-T-Bank / Yandex", country:"🇷🇺 Россия",
    name:"Alexander Nedospasov", title:"CPO",
    url:"https://www.linkedin.com/in/alexandernedospasov/", status:null,
    desc:null,
    bio:"Директор по продукту с опытом в Т-Банке и Яндексе. Строил продуктовые функции в двух ведущих цифровых компаниях России, специализируясь на финансовых и потребительских сервисах."
  },

  // ── Кандидаты КЗ ──
  {
    id:"andrey-timchenko", level:2, company:"Bereke Bank", country:"🇰🇿 Казахстан",
    name:"Andrey Timchenko", title:"CEO",
    url:"https://www.linkedin.com/in/andrey-timchenko-4371676/", status:null,
    desc:null,
    bio:"Генеральный директор Bereke Bank — системообразующего казахстанского банка. Ведёт цифровую трансформацию банка с фокусом на развитие мобильного банкинга и транзакционного бизнеса."
  },
  {
    id:"zhumabek-m", level:2, company:"Halyk Group / DNA Payments", country:"🇰🇿 Казахстан",
    name:"Zhumabek M.", title:null,
    url:null, status:null,
    desc:null,
    bio:"Финтех-руководитель в экосистеме Halyk Group и DNA Payments. Работает над развитием платёжной инфраструктуры Казахстана изнутри крупнейшей банковской группы страны."
  },
  {
    id:"ali-rakhymov", level:2, company:"Yandex Lavka KZ", country:"🇰🇿 Алматы",
    name:"Ali Rakhymov", title:"Head of Fresh",
    url:"https://www.linkedin.com/in/ali-rakhymov-087502200/", status:null,
    desc:null,
    bio:"Руководитель направления Fresh в Яндекс Лавке Казахстан. Управляет категорией свежих продуктов в быстрорастущем сегменте экспресс-доставки продуктов питания."
  },
  {
    id:"anastassiya-maistrenko", level:2, company:"Yandex Lavka Qazaqstan", country:"🇰🇿 Алматы",
    name:"Anastassiya Maistrenko", title:"Head of Commerce & Category",
    url:"https://www.linkedin.com/in/anastassiyamaistrenko/", status:null,
    desc:null,
    bio:"Руководитель коммерческого направления и категорийного менеджмента Яндекс Лавки в Казахстане. Формирует ассортиментную стратегию и развивает партнёрские отношения с поставщиками."
  },
  {
    id:"tigran-manukyan", level:2, company:"Yandex Kazakhstan", country:"🇰🇿 Казахстан",
    name:"Tigran Manukyan", title:"CCO",
    url:"https://www.linkedin.com/in/tigran-manukyan-b204b0139/", status:null,
    desc:null,
    bio:"Коммерческий директор Яндекс Казахстан. Отвечает за монетизацию и партнёрства по всему портфелю продуктов Яндекса на казахстанском рынке."
  },
  {
    id:"vitaly-tumanov", level:2, company:"ex-Google / Yandex / Avito", country:"🇰🇿 Казахстан",
    name:"Vitaly Tumanov", title:"CEO",
    url:"https://www.linkedin.com/in/vitaly-tumanov-291ab746/", status:null,
    desc:null,
    bio:"Серийный tech-руководитель с опытом в Google, Яндексе и Avito. Сейчас строит бизнес в Казахстане, привнося международный опыт в развитие цифровых продуктов региона."
  },
  {
    id:"igor-boyko", level:2, company:"Freedom Travel", country:"🇰🇿 Казахстан",
    name:"Igor Boyko", title:null,
    url:"https://www.linkedin.com/in/igor-boyko/", status:null,
    desc:null,
    bio:"Руководитель Freedom Travel в составе Freedom Group. Развивает онлайн-трэвел платформу в Казахстане в рамках экосистемы одного из крупнейших финансовых холдингов страны."
  },
  {
    id:"kseniya-sokolova", level:2, company:"Freedom Ticketon", country:"🇰🇿 Казахстан",
    name:"Ксения Соколова", title:"CEO",
    url:"https://www.linkedin.com/in/roksu/", status:null,
    desc:null,
    bio:"Генеральный директор Freedom Ticketon — ведущей казахстанской платформы продажи билетов на события и развлечения. Обеспечивает цифровизацию тикетинга в Entertainment-сегменте страны."
  },
  {
    id:"dmitriy-gue-khao", level:2, company:"Freedom Lifestyle", country:"🇰🇿 Казахстан",
    name:"Дмитрий Гуэ-Хао", title:"Управляющий директор",
    url:"https://www.linkedin.com/in/dmitriy-gue-khao-584522162/", status:null,
    desc:null,
    bio:"Управляющий директор Freedom Lifestyle — подразделения по premium-сервисам и стилю жизни в Freedom Group. Выстраивает экосистему lifestyle-продуктов для состоятельной аудитории Казахстана."
  },
];

// ── Storage ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "manager-review-v1";
function loadData()  { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; } }
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

function initials(name) {
  return (name || "?").trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ══════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [data, setData]               = useState(() => loadData());
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("all");
  const [openComment, setOpenComment] = useState(null);

  useEffect(() => { saveData(data); }, [data]);

  function toggle(id) {
    setData(prev => ({ ...prev, [id]: { ...(prev[id] || {}), selected: !prev[id]?.selected } }));
  }
  function setComment(id, v) {
    setData(prev => ({ ...prev, [id]: { ...(prev[id] || {}), comment: v } }));
  }

  const totalSelected = CANDIDATES.filter(c => data[c.id]?.selected).length;
  const totalComments = CANDIDATES.filter(c => data[c.id]?.comment?.trim()).length;

  const ruCount       = CANDIDATES.filter(c => isRu(c)).length;
  const kzCount       = CANDIDATES.filter(c => isKz(c)).length;
  const zarubezhCount = CANDIDATES.filter(c => !isRfKz(c)).length;

  const displayed = CANDIDATES.filter(c => {
    if (filter === "zarubezh" && isRfKz(c))  return false;
    if (filter === "ru"       && !isRu(c))   return false;
    if (filter === "kz"       && !isKz(c))   return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [c.name, c.company, c.country, c.title, c.bio].some(v => v?.toLowerCase().includes(q));
  });

  return (
    <div style={{ minHeight:"100vh", background:"#1A1A1A", display:"flex", justifyContent:"center",
      fontFamily:"-apple-system,'SF Pro Text','Inter',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:430, minHeight:"100vh", background:C.bg, position:"relative",
        display:"flex", flexDirection:"column", boxShadow:"0 0 60px rgba(0,0,0,0.5)", overflow:"hidden" }}>

        {/* ── Header ── */}
        <div style={{ background:`linear-gradient(160deg,${C.green} 0%,${C.greenDark} 100%)`,
          padding:"18px 20px 20px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.65)", letterSpacing:2 }}>HALYK BANK</div>
              <div style={{ fontSize:22, fontWeight:800, color:C.white, lineHeight:1.1 }}>Candidate Review</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", marginTop:3 }}>
                {CANDIDATES.length} кандидатов · {totalSelected} выбрано · {totalComments} с комментарием
              </div>
            </div>
            {totalSelected > 0 && (
              <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"7px 16px",
                fontSize:14, fontWeight:800, color:C.white, border:"1px solid rgba(255,255,255,0.4)" }}>
                ✓ {totalSelected}
              </div>
            )}
          </div>
          <div style={{ marginTop:14, height:4, background:"rgba(255,255,255,0.2)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:2, background:C.white, transition:"width .4s",
              width:`${(totalSelected / CANDIDATES.length) * 100}%` }} />
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 80px" }}>

          {/* Search */}
          <div style={{ background:C.white, borderRadius:13, padding:"2px 14px", marginBottom:12,
            display:"flex", alignItems:"center", gap:8, boxShadow:"0 1px 4px rgba(0,0,0,0.07)" }}>
            <span style={{ fontSize:15, color:C.gray4 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени, компании, стране…"
              style={{ flex:1, border:"none", outline:"none", background:"transparent",
                fontSize:15, color:C.dark, fontFamily:"inherit", padding:"11px 0" }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ width:18, height:18, borderRadius:"50%",
                background:C.gray4, border:"none", color:C.white, fontSize:12, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
            )}
          </div>

          {/* Filter tabs */}
          <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
            {[
              { key:"all",       label:`Все (${CANDIDATES.length})` },
              { key:"zarubezh", label:`🌍 Зарубежные (${zarubezhCount})` },
              { key:"ru",       label:`🇷🇺 Россия (${ruCount})` },
              { key:"kz",       label:`🇰🇿 Казахстан (${kzCount})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                background: filter === tab.key ? C.green : C.white,
                color:      filter === tab.key ? C.white : C.gray2,
                border:     `1px solid ${filter === tab.key ? C.green : C.gray4}`,
                borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:600,
                cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0,
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Card list */}
          {displayed.map(c => (
            <CandidateCard key={c.id} candidate={c}
              selected={!!data[c.id]?.selected}
              comment={data[c.id]?.comment || ""}
              commentOpen={openComment === c.id}
              onToggle={() => toggle(c.id)}
              onCommentChange={v => setComment(c.id, v)}
              onToggleComment={() => setOpenComment(openComment === c.id ? null : c.id)}
            />
          ))}

          {displayed.length === 0 && (
            <div style={{ textAlign:"center", padding:"50px 20px", color:C.gray2 }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
              <div style={{ fontSize:15, fontWeight:600 }}>Ничего не найдено</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CANDIDATE CARD
// ══════════════════════════════════════════════════════════════════════════
function CandidateCard({ candidate: c, selected, comment, commentOpen, onToggle, onCommentChange, onToggleComment }) {
  const [bioOpen, setBioOpen] = useState(false);
  const ini        = initials(c.name);
  const hasComment = comment.trim().length > 0;
  const lvlColor   = C.green;
  const avatarBg   = `linear-gradient(135deg,${C.green},${C.greenDark})`;

  return (
    <div style={{ background: selected ? C.greenLight : C.white, borderRadius:16, marginBottom:10,
      border:`1px solid ${selected ? C.green+"60" : C.gray4}`, overflow:"hidden",
      boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"background .2s,border .2s" }}>

      {/* Level stripe */}
      <div style={{ height:3, background: selected ? C.green : lvlColor }} />

      {/* Main row */}
      <div style={{ padding:"14px 14px 12px", display:"flex", gap:12, alignItems:"flex-start" }}>

        {/* Avatar */}
        <div style={{ width:46, height:46, borderRadius:"50%", flexShrink:0,
          background: selected ? `linear-gradient(135deg,${C.green},${C.greenDark})` : avatarBg,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:C.white, fontWeight:700, fontSize:15 }}>
          {ini}
        </div>

        {/* Info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.dark, lineHeight:1.2 }}>{c.name}</div>
          {c.title && (
            <div style={{ fontSize:12, color:C.gray2, marginTop:2, marginBottom:5, lineHeight:1.3 }}>{c.title}</div>
          )}
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, alignItems:"center" }}>
            <span style={{ fontSize:11, fontWeight:600, color:C.green,
              background:C.greenLight, borderRadius:6, padding:"2px 8px" }}>{c.company}</span>
            {c.country && (
              <span style={{ fontSize:11, color:C.gray2 }}>{c.country}</span>
            )}
          </div>
          {c.desc && (
            <div style={{ fontSize:11, color:C.gray2, lineHeight:1.4, marginTop:5,
              borderLeft:`2px solid ${C.gray4}`, paddingLeft:8, fontStyle:"italic" }}>
              {c.desc}
            </div>
          )}

          {/* Bio toggle */}
          {c.bio && (
            <div style={{ marginTop:7 }}>
              <button onClick={() => setBioOpen(v => !v)} style={{
                background:"transparent", border:"none", padding:0, cursor:"pointer",
                fontSize:11, fontWeight:600, color:C.blue, fontFamily:"inherit",
                display:"flex", alignItems:"center", gap:3
              }}>
                <span>{bioOpen ? "▲" : "▼"}</span>
                <span>{bioOpen ? "Скрыть профиль" : "Мини-профиль"}</span>
              </button>
              {bioOpen && (
                <div style={{ marginTop:6, padding:"9px 11px", background:C.bg,
                  borderRadius:10, fontSize:12, color:C.dark, lineHeight:1.55 }}>
                  {c.bio}
                </div>
              )}
            </div>
          )}

          {/* Status badge */}
          {c.status && (
            <div style={{ marginTop:6, display:"inline-flex", alignItems:"center", gap:4,
              background:"#FFF3CD", borderRadius:8, padding:"3px 8px",
              fontSize:10, fontWeight:600, color:"#856404" }}>
              📩 {c.status}
            </div>
          )}
        </div>

        {/* Checkbox */}
        <div onClick={onToggle} style={{ width:28, height:28, borderRadius:8, flexShrink:0,
          background: selected ? C.green : C.white,
          border:`2px solid ${selected ? C.green : C.gray4}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all .15s", marginTop:2 }}>
          {selected && <span style={{ color:C.white, fontSize:15, fontWeight:800, lineHeight:1 }}>✓</span>}
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display:"flex", borderTop:`1px solid ${C.bg}`,
        background: selected ? "#D1FAE5" : C.bg }}>
        {c.url ? (
          <a href={c.url} target="_blank" rel="noopener noreferrer"
            style={{ flex:1, textAlign:"center", padding:"8px 8px", fontSize:12, fontWeight:600,
              color:C.blue, textDecoration:"none", borderRight:`1px solid rgba(0,0,0,0.08)`,
              display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span>LinkedIn ↗</span>
            <span style={{ fontSize:9, fontWeight:400, color:C.gray2 }}>нажмите чтоб посмотреть</span>
          </a>
        ) : (
          <div style={{ flex:1, textAlign:"center", padding:"10px 8px", fontSize:12, color:C.gray4 }}>
            нет ссылки
          </div>
        )}
        <button onClick={onToggleComment} style={{ flex:1, border:"none", background:"transparent",
          padding:"8px 8px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
          color: hasComment ? C.green : commentOpen ? C.dark : C.gray2,
          display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <span>{hasComment ? "💬 Комментарий ✓" : "💬 Комментарий"}</span>
          <span style={{ fontSize:9, fontWeight:400, color:C.gray2 }}>
            {commentOpen ? "нажмите чтоб закрыть" : "нажмите, чтоб оставить комментарий"}
          </span>
        </button>
      </div>

      {/* Comment field */}
      {commentOpen && (
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.bg}` }}>
          <textarea value={comment} onChange={e => onCommentChange(e.target.value)}
            placeholder="Ваш комментарий по кандидату…"
            autoFocus
            style={{ width:"100%", boxSizing:"border-box", height:80,
              border:`1.5px solid ${C.gray4}`, borderRadius:10,
              padding:"10px 12px", fontSize:14, fontFamily:"inherit",
              color:C.dark, resize:"none", outline:"none", background:C.bg, lineHeight:1.5 }}
            onFocus={e => (e.target.style.borderColor = C.green)}
            onBlur={e => (e.target.style.borderColor = C.gray4)}
          />
        </div>
      )}
    </div>
  );
}
