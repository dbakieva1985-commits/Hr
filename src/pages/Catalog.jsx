import { useState } from "react";
import { C, CATEGORIES, SERVICES } from "../data";
import { Pill, Btn, Badge } from "../components/ui";

export default function Catalog({ currentUser, onSelectService }) {
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");

  const isSubsidiary = currentUser.company !== 'halyk';
  const available = isSubsidiary ? SERVICES.filter(s => s.for_all) : SERVICES;

  const filtered = available.filter(s => {
    const matchCat  = catFilter === "all" || s.cat === catFilter;
    const matchSrch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                      s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  const catCounts = {};
  CATEGORIES.forEach(c => { catCounts[c.id] = available.filter(s => s.cat === c.id).length; });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: 0 }}>Каталог HR-сервисов</h1>
        <p style={{ color: C.gray500, fontSize: 14, marginTop: 8 }}>
          {available.length} услуг в {CATEGORIES.filter(c => catCounts[c.id] > 0).length} направлениях
          {isSubsidiary && <span style={{ color: C.orange, marginLeft: 8 }}>
            · Отображаются сервисы, доступные вашей компании
          </span>}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, color: C.gray500 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск сервиса..."
          style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${C.gray300}`,
            borderRadius: 10, padding: "10px 14px 10px 40px", fontSize: 14,
            fontFamily: "inherit", color: C.dark, outline: "none", background: C.white }} />
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <Pill text={`Все (${available.length})`} active={catFilter === "all"} onClick={() => setCatFilter("all")} />
        {CATEGORIES.filter(c => catCounts[c.id] > 0).map(c => (
          <Pill key={c.id} text={`${c.icon} ${c.label} (${catCounts[c.id]})`}
            active={catFilter === c.id} onClick={() => setCatFilter(c.id)} />
        ))}
      </div>

      {/* Category sections */}
      {catFilter === "all" ? (
        CATEGORIES.filter(c => catCounts[c.id] > 0).map(cat => {
          const services = filtered.filter(s => s.cat === cat.id);
          if (!services.length) return null;
          return (
            <div key={cat.id} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>{cat.label}</h2>
                <div style={{ height: 1, flex: 1, background: C.gray300 }} />
              </div>
              <ServiceGrid services={services} onSelectService={onSelectService} cat={cat} />
            </div>
          );
        })
      ) : (
        <>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.gray500 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Ничего не найдено</div>
            </div>
          ) : (
            <ServiceGrid services={filtered} onSelectService={onSelectService}
              cat={CATEGORIES.find(c => c.id === catFilter)} />
          )}
        </>
      )}
    </div>
  );
}

function ServiceGrid({ services, onSelectService, cat }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {services.map(s => (
        <ServiceCard key={s.id} service={s} onSelectService={onSelectService} cat={cat} />
      ))}
    </div>
  );
}

function ServiceCard({ service: s, onSelectService, cat }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: C.white, border: `1px solid ${hov ? (cat?.color || C.green) : C.gray300}`,
      borderRadius: 14, padding: "20px", cursor: "pointer",
      boxShadow: hov ? "0 8px 24px #0000001A" : "0 1px 4px #0000000A",
      display: "flex", flexDirection: "column",
      transition: "box-shadow .15s, border-color .15s",
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <div style={{ height: 3, background: cat?.color || C.green, borderRadius: 2, marginBottom: 16 }} />
      <div style={{ fontSize: 9, fontWeight: 700, color: cat?.color || C.green,
        letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>
        {cat?.label}
      </div>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 6, lineHeight: 1.3 }}>
        {s.title}
      </div>
      <div style={{ fontSize: 12, color: C.gray500, flex: 1, marginBottom: 16, lineHeight: 1.5 }}>
        {s.desc}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: C.gray500 }}>⏱ SLA</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>{s.sla}</div>
        </div>
        <Btn small onClick={() => onSelectService(s)}>Подать →</Btn>
      </div>
      {s.docs.length > 0 && (
        <div style={{ marginTop: 12, padding: "8px 10px", background: C.gray100,
          borderRadius: 6, fontSize: 10, color: C.gray500 }}>
          📎 {s.docs.length} {s.docs.length === 1 ? 'документ' : 'документа'}
        </div>
      )}
    </div>
  );
}
