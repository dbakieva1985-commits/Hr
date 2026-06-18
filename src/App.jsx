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

// ── All candidates (pre-populated from Excel) ──────────────────────────────
const CANDIDATES = [
  // ── Revolut ──
  { id:"vlad-yatsenko",         level:1, company:"Revolut",                   country:"🇬🇧 Великобритания",  name:"Vlad Yatsenko",            title:"Co-founder & CTO",                        url:"https://www.linkedin.com/in/yatsenko/",                   status:null,                                     desc:"Глобальный необанк: банкинг, инвестиции, криптовалюта, международные платежи." },
  { id:"ilya-vorobiev",         level:1, company:"Revolut",                   country:"🇺🇸 Калифорния",       name:"Ilya Vorobiev",             title:"CPO / CTO",                               url:"https://www.linkedin.com/in/ivorobiev/",                  status:"написала в LinkedIn",                    desc:null },
  { id:"nik-storonsky",         level:1, company:"Revolut",                   country:"🇬🇧 Лондон",           name:"Nik Storonsky",             title:"Founder & CEO",                           url:"https://www.linkedin.com/in/nstoronsky/",                 status:null,                                     desc:null },
  { id:"siddhartha-jajodia",    level:1, company:"Revolut",                   country:"🇬🇧 Великобритания",  name:"Siddhartha Jajodia",        title:"Group Chief Banking Officer",             url:"https://www.linkedin.com/in/siddhartha-jajodia-09a6421/", status:null,                                     desc:null },
  { id:"dmytro-strelchuk",      level:1, company:"Revolut",                   country:"🇬🇧 Лондон",           name:"Dmytro Strelchuk",          title:null,                                      url:"https://www.linkedin.com/in/dmytro-strelchuk/",           status:null,                                     desc:null },
  { id:"paulo-pereira",         level:1, company:"Revolut",                   country:"🇬🇧 Лондон",           name:"Paulo Pereira",             title:"Director, Global Head of Product",        url:"https://www.linkedin.com/in/paulo-gpereira/",             status:"написала в LinkedIn",                    desc:null },
  { id:"michal-laube",          level:1, company:"Revolut",                   country:"🇱🇺 Люксембург",       name:"Michal Laube",              title:"COO",                                     url:"https://www.linkedin.com/in/michals/",                    status:null,                                     desc:null },
  { id:"matt-baxby",            level:1, company:"Revolut",                   country:"🇦🇺 Австралия",        name:"Matt Baxby",                title:"Partner, CEO Australia / NZ & APAC",      url:"https://www.linkedin.com/in/mattbaxby/",                  status:null,                                     desc:null },
  { id:"carlos-selonke",        level:1, company:"Revolut",                   country:"🇬🇧 Лондон",           name:"Carlos Selonke",            title:"Chief Information Officer",               url:"https://www.linkedin.com/in/carlosselonke/",              status:null,                                     desc:null },
  { id:"donato-lucia",          level:1, company:"Revolut",                   country:"🇬🇧 Великобритания",  name:"Donato Lucia",              title:"Partner & VP of Technology",              url:"https://www.linkedin.com/in/donatolucia/",                status:null,                                     desc:null },
  { id:"francesca-carlesi",     level:1, company:"Revolut",                   country:"🇬🇧 Великобритания",  name:"Francesca Carlesi",         title:"CEO",                                     url:"https://www.linkedin.com/in/francesca-carlesi-b326922/",  status:null,                                     desc:null },
  { id:"beatrice-cossa",        level:1, company:"Revolut",                   country:"🇫🇷 Париж",            name:"Beatrice Cossa-Dumurgier",  title:"CEO Western Europe",                      url:"https://www.linkedin.com/in/beatrice-cossa-dumurgier-b30b2b7/", status:null,                             desc:null },
  { id:"nicola-vicino",         level:1, company:"Revolut",                   country:"🇮🇹 Милан",            name:"Nicola Vicino",             title:"General Manager Italy",                   url:"https://www.linkedin.com/in/nicolavicino/",               status:null,                                     desc:null },
  { id:"james-gibson",          level:1, company:"Revolut",                   country:"🇬🇧 Великобритания",  name:"James Gibson",              title:"Head of Revolut Business & Partner",      url:"https://www.linkedin.com/in/james-gibson-94364b65/",      status:null,                                     desc:null },
  { id:"yana-shkrebenkova",     level:1, company:"Revolut",                   country:"🇬🇧 Великобритания",  name:"Yana Shkrebenkova",         title:"Head of Wealth & Trading UK",             url:"https://www.linkedin.com/in/shkrebenkova/",               status:null,                                     desc:null },
  { id:"mike-zharchev",         level:1, company:"ex-Revolut / VividMoney",   country:"🇷🇺 Россия",           name:"Mike Zharchev",             title:"CPO at MWS AI | Co-Founder Untitled Bank", url:"https://www.linkedin.com/in/mike-zharchev-24b92094/",    status:null,                                     desc:null },
  { id:"jonathan-beaney-rev",   level:1, company:"Revolut | Ex-Amazon",       country:"🇪🇸 Испания",          name:"Jonathan Beaney",           title:null,                                      url:"https://www.linkedin.com/in/jonathan-beaney-10b3b75b/",  status:null,                                     desc:null },
  // ── T-Bank ──
  { id:"pavel-fedorov",         level:1, company:"T-Bank",                    country:"🇷🇺 Россия",           name:"Pavel Fedorov",             title:"Экс-вице-президент",                      url:"https://www.linkedin.com/in/pavel-fedorov/",              status:null,                                     desc:"Один из крупнейших цифровых банков: банкинг, страхование и инвестиции без отделений." },
  { id:"dmitry-vorobey",        level:1, company:"T-Bank",                    country:"🇦🇪 Дубай",            name:"Dmitry Vorobey",            title:"CPO, Tinkoff Travel",                     url:"https://www.linkedin.com/in/dmitry-vorobey-334b991b4/",  status:"написала в LinkedIn, готова встречаться", desc:null },
  { id:"maxim-savchenko",       level:1, company:"T-Bank",                    country:"🇷🇺 Россия",           name:"Maxim Savchenko",           title:"CPO, T-Data & Transactions",              url:"https://www.linkedin.com/in/maxim-savchenko-5b1a6196/",  status:"написала в LinkedIn",                    desc:null },
  { id:"fedor-moroz",           level:1, company:"T-Bank",                    country:"🇷🇺 Россия",           name:"Федор Мороз",               title:"Head of Business Protection",             url:"https://www.linkedin.com/in/fedor-moroz-29b20781/",       status:"написала в LinkedIn",                    desc:null },
  { id:"dmitriy-bogachev",      level:1, company:"T-Bank",                    country:"🇷🇺 Россия",           name:"Dmitriy Bogachev",          title:"CPO of Loyalty and Cashback",             url:"https://www.linkedin.com/in/dmitriy-bogachev/",           status:null,                                     desc:null },
  // ── Yandex ──
  { id:"timur-shalekenov",      level:1, company:"Yandex Qazaqstan",          country:"🇰🇿 Алматы",           name:"Timur Shalekenov",          title:"CEO",                                     url:"https://www.linkedin.com/in/timur-shalekenov-80a07037/",  status:null,                                     desc:null },
  { id:"madina-seisengaliyeva", level:1, company:"Yandex",                    country:"🇺🇸 США",              name:"Madina Seisengaliyeva",     title:"Commercial Strategy Leader, FMCG & AdTech", url:"https://www.linkedin.com/in/madina-seisengaliyeva/",    status:"написала, встреча с 29.06",              desc:null },
  { id:"yerzhan-bazarbay",      level:1, company:"Yandex Delivery KZ",        country:"🇰🇿 Алматы",           name:"Yerzhan Bazarbay",          title:"General Manager",                         url:"https://www.linkedin.com/in/bazarbayyerzhan/",            status:null,                                     desc:null },
  { id:"alex-zakharov",         level:1, company:"Yandex",                    country:"🇷🇺 Россия",           name:"Алексей Захаров",           title:"CPO",                                     url:"https://www.linkedin.com/in/alex-zakharov-/",             status:"написала в LinkedIn",                    desc:null },
  { id:"goran-groza",           level:1, company:"Yandex Eats",               country:"🇰🇿 Казахстан",        name:"Goran Groza",               title:"General Manager",                         url:"https://www.linkedin.com/in/goran-groza/",                status:"написала в LinkedIn",                    desc:null },
  { id:"mikhail-chizhikov",     level:1, company:"Avito / ex-VK / ex-Yandex", country:"🇷🇺 Москва",           name:"Mikhail Chizhikov",         title:"Chief Product Officer",                   url:"https://www.linkedin.com/in/mikhail-chizhikov-48b792a8/", status:null,                                     desc:null },
  { id:"kirill-n",              level:1, company:"Ozon Bank | ex-Yandex",     country:"🇷🇺 Россия",           name:"Kirill N.",                 title:"Коммерческий директор",                   url:"https://www.linkedin.com/in/kirillnepomnyashchiy/",       status:"написала в LinkedIn",                    desc:null },
  // ── Wise ──
  { id:"harsh-sinha",           level:1, company:"Wise",                      country:"🇬🇧 Великобритания",  name:"Harsh Sinha",               title:"Chief Technology Officer",                url:"https://www.linkedin.com/in/harshsinha/",                 status:null,                                     desc:"Международная платформа для дешёвых трансграничных переводов и мультивалютных счетов." },
  { id:"diana-avila",           level:1, company:"Wise",                      country:"🇬🇧 Лондон",           name:"Diana Avila",               title:"Chief Banking and Expansion Officer",      url:"https://www.linkedin.com/in/diana-avila-g/",              status:null,                                     desc:null },
  // ── Neobanks ──
  { id:"maximilian-tayenthal",  level:1, company:"N26",                       country:"🇩🇪 Берлин",           name:"Maximilian Tayenthal",      title:"Co-founder",                              url:"https://www.linkedin.com/in/maximilian-tayenthal/",       status:null,                                     desc:"Мобильный банк для простого управления личными финансами в Европе." },
  { id:"andy-smart",            level:1, company:"Monzo",                     country:"🇬🇧 Великобритания",  name:"Andy Smart",                title:"Chief Product Officer",                   url:"https://www.linkedin.com/in/andysmart/",                  status:null,                                     desc:"Цифровой банк с акцентом на мобильное приложение и бюджетирование." },
  { id:"joe-gordon",            level:1, company:"Starling Bank",             country:"🇬🇧 Великобритания",  name:"Joe Gordon",                title:"Chief Operating Officer",                 url:"https://www.linkedin.com/in/joe-gordon/",                 status:null,                                     desc:"Необанк с банковской лицензией для физических лиц и бизнеса." },
  { id:"bianca-zwart",          level:1, company:"bunq",                      country:"🇳🇱 Амстердам",        name:"Bianca Zwart",              title:"Chief Strategy Officer",                  url:"https://www.linkedin.com/in/bianca-zwart/",               status:null,                                     desc:"Европейский мобильный банк с мультивалютными счетами." },
  { id:"cristina-junqueira",    level:1, company:"Nubank",                    country:"🇧🇷 Сан-Паулу",        name:"Cristina Junqueira",        title:"Co-founder",                              url:"https://www.linkedin.com/in/crisjunqueira/",              status:null,                                     desc:"Крупнейший цифровой банк Латинской Америки с десятками миллионов клиентов." },
  { id:"ryan-king",             level:1, company:"Chime",                     country:"🇺🇸 Сан-Франциско",   name:"Ryan King",                 title:"Co-founder",                              url:"https://www.linkedin.com/in/ryanaking/",                  status:null,                                     desc:"Популярная цифровая банковская платформа для повседневных финансов." },
  { id:"jason-zhang",           level:1, company:"Mercury",                   country:"🇺🇸 Сан-Франциско",   name:"Jason Zhang",               title:"Co-founder & COO",                        url:"https://www.linkedin.com/in/jason-zhang-5645a860/",       status:null,                                     desc:"Цифровая банковская платформа для стартапов и технологических компаний." },
  { id:"pedro-franceschi",      level:1, company:"Brex",                      country:"🇺🇸 Сан-Франциско",   name:"Pedro Franceschi",          title:"Founder",                                 url:"https://www.linkedin.com/in/pfranceschi/",                status:null,                                     desc:"Финансовая платформа для бизнеса: корпоративные карты и управление расходами." },
  { id:"trevor-marshall",       level:1, company:"Current",                   country:"🇺🇸 Нью-Йорк",        name:"Trevor Marshall",           title:"Chief Technology Officer",                url:"https://www.linkedin.com/in/trevor-kurth-marshall/",      status:null,                                     desc:"Мобильный необанк для молодой аудитории и персональных финансов." },
  { id:"soren-kyhl",            level:1, company:"Lunar",                     country:"🇩🇰 Копенгаген",       name:"Søren Kyhl",                title:"Chief Operating Officer",                 url:"https://www.linkedin.com/in/soerenkyhl/",                 status:null,                                     desc:"Крупнейший цифровой банк Скандинавии." },
  { id:"gavin-michael",         level:1, company:"Varo Bank",                 country:"🇺🇸 США",              name:"Gavin Michael",             title:"President",                               url:"https://www.linkedin.com/in/gavincmichael/",              status:null,                                     desc:"Один из первых необанков США с собственной банковской лицензией." },
  { id:"lauren-stafford-webb",  level:1, company:"SoFi",                      country:"🇺🇸 Сан-Франциско",   name:"Lauren Stafford Webb",      title:"Chief Marketing Officer",                 url:"https://www.linkedin.com/in/lauren-stafford-webb/",       status:null,                                     desc:"Финтех: банкинг, инвестиции, кредиты и финансовое планирование." },
  { id:"david-sandstrom",       level:1, company:"Klarna",                    country:"🇸🇪 Стокгольм",        name:"David Sandström",           title:"Chief Marketing Officer",                 url:"https://www.linkedin.com/in/davidsandstrom/",             status:null,                                     desc:"Глобальный финтех-лидер в сфере BNPL и онлайн-платежей." },
  // ── Others ──
  { id:"valentin-morozov",      level:1, company:"Kuda",                      country:"🇦🇿 Баку",             name:"Valentin Morozov",          title:"CEO / Board Member",                      url:null,                                                      status:null,                                     desc:"Оператор банков на развивающихся рынках, бэкграунд McKinsey." },
  { id:"artem-suslov",          level:1, company:"ex-MTS Fintech / Raiffeisen",country:"🇷🇺 Москва",           name:"Artem Suslov",              title:"Head of PMO",                             url:"https://www.linkedin.com/in/artem-suslov-898b9a27/",      status:null,                                     desc:null },
  { id:"maxim-ivanov",          level:1, company:"Untitled Bank",             country:"🇷🇺 Россия",           name:"Maxim Ivanov",              title:"CBDO / CSO",                              url:"https://www.linkedin.com/in/mike-zharchev-24b92094/",    status:null,                                     desc:null },
  { id:"andrey-timchenko",      level:1, company:"Bereke Bank",               country:"🇰🇿 Казахстан",        name:"Andrey Timchenko",          title:"CEO",                                     url:"https://www.linkedin.com/in/andrey-timchenko-4371676/",  status:null,                                     desc:null },
  { id:"jonathan-g",            level:1, company:"ex-HSBC / Bank of England", country:"🇬🇧 Лондон",           name:"Jonathan G.",               title:"Head of Wise UK",                         url:"https://www.linkedin.com/in/jonathan-beaney-10b3b75b/",  status:null,                                     desc:null },
  { id:"zhumabek-m",            level:1, company:"Halyk Group / DNA Payments", country:"🇰🇿 Казахстан",       name:"Zhumabek M.",               title:null,                                      url:null,                                                      status:null,                                     desc:null },
  // ── Level 2 ──
  { id:"ali-rakhymov",          level:2, company:"Yandex Lavka KZ",           country:"🇰🇿 Алматы",           name:"Ali Rakhymov",              title:"Head of Fresh",                           url:"https://www.linkedin.com/in/ali-rakhymov-087502200/",    status:null,                                     desc:null },
  { id:"aziz-tulaganov",        level:2, company:"ex-Yandex / ex-PwC",        country:"🇩🇪 Берлин",           name:"Aziz Tulaganov",            title:"Discovery, Growth & AI — CSPO, CSM, PMP", url:"https://www.linkedin.com/in/aziz-tulaganov/",             status:null,                                     desc:null },
  { id:"alexander-nedospasov",  level:2, company:"ex-T-Bank / Yandex",        country:"🇷🇺 Россия",           name:"Alexander Nedospasov",      title:"CPO",                                     url:"https://www.linkedin.com/in/alexandernedospasov/",        status:null,                                     desc:null },
  { id:"anastassiya-maistrenko",level:2, company:"Yandex Lavka Qazaqstan",    country:"🇰🇿 Алматы",           name:"Anastassiya Maistrenko",    title:"Head of Commerce & Category",             url:"https://www.linkedin.com/in/anastassiyamaistrenko/",      status:null,                                     desc:null },
  { id:"igor-boyko",            level:2, company:"Freedom Travel",            country:null,                   name:"Igor Boyko",                title:null,                                      url:"https://www.linkedin.com/in/igor-boyko/",                 status:null,                                     desc:null },
  { id:"tigran-manukyan",       level:2, company:"Yandex Kazakhstan",         country:"🇰🇿 Казахстан",        name:"Tigran Manukyan",           title:"CCO",                                     url:"https://www.linkedin.com/in/tigran-manukyan-b204b0139/", status:null,                                     desc:null },
  { id:"vitaly-tumanov",        level:2, company:"ex-Google / Yandex / Avito",country:"🇰🇿 Казахстан",        name:"Vitaly Tumanov",            title:"CEO",                                     url:"https://www.linkedin.com/in/vitaly-tumanov-291ab746/",    status:null,                                     desc:null },
  { id:"kseniya-sokolova",      level:2, company:"Freedom Ticketon",          country:null,                   name:"Ксения Соколова",           title:"CEO",                                     url:"https://www.linkedin.com/in/roksu/",                      status:null,                                     desc:null },
  { id:"dmitriy-gue-khao",      level:2, company:"Freedom Lifestyle",         country:null,                   name:"Дмитрий Гуэ-Хао",          title:"Управляющий директор",                    url:"https://www.linkedin.com/in/dmitriy-gue-khao-584522162/",status:null,                                     desc:null },
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

  const displayed = CANDIDATES.filter(c => {
    if (filter === "selected" && !data[c.id]?.selected) return false;
    if (filter === "l1" && c.level !== 1) return false;
    if (filter === "l2" && c.level !== 2) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [c.name, c.company, c.country, c.title].some(v => v?.toLowerCase().includes(q));
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
              { key:"all",      label:`Все (${CANDIDATES.length})` },
              { key:"selected", label:`Избранные${totalSelected ? ` (${totalSelected})` : ""}` },
              { key:"l1",       label:"Уровень 1" },
              { key:"l2",       label:"Уровень 2" },
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
              <div style={{ fontSize:36, marginBottom:10 }}>
                {filter === "selected" ? "⭐" : "🔍"}
              </div>
              <div style={{ fontSize:15, fontWeight:600 }}>
                {filter === "selected" && totalSelected === 0
                  ? "Нет избранных кандидатов"
                  : "Ничего не найдено"}
              </div>
              {filter === "selected" && totalSelected === 0 &&
                <div style={{ fontSize:13, color:C.gray4, marginTop:6 }}>
                  Отметьте кандидатов галочкой ✓
                </div>}
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
  const ini       = initials(c.name);
  const hasComment = comment.trim().length > 0;
  const lvlColor  = c.level === 1 ? C.green : C.purple;
  const avatarBg  = c.level === 1
    ? `linear-gradient(135deg,${C.green},${C.greenDark})`
    : `linear-gradient(135deg,${C.purple},#5B21B6)`;

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
            <span style={{ fontSize:11, fontWeight:600,
              color: c.level === 1 ? C.green : C.purple,
              background: c.level === 1 ? C.greenLight : C.purpleLight,
              borderRadius:6, padding:"2px 8px" }}>{c.company}</span>
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
          {c.status && (
            <div style={{ marginTop:5 }}>
              <span style={{ fontSize:10, fontWeight:600, color:C.orange,
                background:"#FFF7ED", borderRadius:6, padding:"2px 8px" }}>
                {c.status}
              </span>
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
            style={{ flex:1, textAlign:"center", padding:"10px 8px", fontSize:12, fontWeight:600,
              color:C.blue, textDecoration:"none", borderRight:`1px solid rgba(0,0,0,0.08)` }}>
            LinkedIn ↗
          </a>
        ) : (
          <div style={{ flex:1, textAlign:"center", padding:"10px 8px", fontSize:12, color:C.gray4 }}>
            нет ссылки
          </div>
        )}
        <button onClick={onToggleComment} style={{ flex:1, border:"none", background:"transparent",
          padding:"10px 8px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
          color: hasComment ? C.green : commentOpen ? C.dark : C.gray2 }}>
          {hasComment ? "💬 Изменить ✓" : commentOpen ? "💬 Закрыть" : "💬 Комментарий"}
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
