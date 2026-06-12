import { useState } from "react";
import { C, CATEGORIES, SERVICES } from "../data";
import { Btn } from "../components/ui";

export default function Catalog({ currentUser, onSelectService }) {
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState("");

  const isSubsidiary = currentUser.company !== "halyk";
  const available = isSubsidiary ? SERVICES.filter(s => s.for_all) : SERVICES;

  const cat = activeCat ? CATEGORIES.find(c => c.id === activeCat) : null;

  const filtered = available.filter(s => {
    const matchCat  = !activeCat || s.cat === activeCat;
    const matchSrch = !search.trim() ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: "0 0 8px" }}>
          Каталог HR-услуг
        </h1>
        <p style={{ color: C.gray500, fontSize: 14, margin: 0 }}>
          Выберите категорию или найдите нужную услугу
        </p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          fontSize: 16, color: C.gray500 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по названию или описанию..."
          style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px 14px 46px",
            fontSize: 14, borderRadius: 12, border: `1px solid ${C.gray300}`,
            background: C.white, color: C.dark, fontFamily: "inherit", outline: "none",
            boxShadow: "0 1px 4px #0000000A" }} />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: C.gray500, fontSize: 18, cursor: "pointer" }}>×</button>
        )}
      </div>

      {/* Category tiles */}
      {!search && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
          {CATEGORIES.map(c => {
            const count = available.filter(s => s.cat === c.id).length;
            if (!count) return null;
            const isActive = activeCat === c.id;
            return (
              <div key={c.id}
                onClick={() => setActiveCat(isActive ? null : c.id)}
                style={{
                  borderRadius: 16, padding: "20px 18px", cursor: "pointer",
                  background: isActive ? c.color : C.white,
                  border: `2px solid ${isActive ? c.color : C.gray300}`,
                  boxShadow: isActive ? `0 4px 20px ${c.color}40` : "0 1px 4px #0000000A",
                  transition: "all .2s", position: "relative", overflow: "hidden",
                }}>
                <div style={{ position: "absolute", right: -12, bottom: -12, fontSize: 60, opacity: isActive ? 0.2 : 0.06 }}>
                  {c.icon}
                </div>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 4,
                  color: isActive ? "#FFF" : C.dark }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 11, color: isActive ? "#FFFFFF90" : C.gray500 }}>
                  {count} {count === 1 ? "услуга" : count < 5 ? "услуги" : "услуг"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active category header */}
      {cat && !search && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
          padding: "16px 20px", borderRadius: 12, background: cat.color + "10",
          border: `1px solid ${cat.color}30` }}>
          <span style={{ fontSize: 28 }}>{cat.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: cat.color }}>{cat.label}</div>
            <div style={{ fontSize: 12, color: C.gray500 }}>{filtered.length} доступных услуг</div>
          </div>
          <button onClick={() => setActiveCat(null)}
            style={{ marginLeft: "auto", background: "none", border: `1px solid ${cat.color}40`,
              borderRadius: 8, padding: "6px 12px", color: cat.color, fontSize: 12,
              cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Сбросить ×
          </button>
        </div>
      )}

      {/* Services by category (when no filter) */}
      {!activeCat && !search ? (
        CATEGORIES.map(c => {
          const svcs = available.filter(s => s.cat === c.id);
          if (!svcs.length) return null;
          return (
            <div key={c.id} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: c.color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {c.icon}
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>{c.label}</h2>
                <div style={{ flex: 1, height: 1, background: C.gray300 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {svcs.map(s => <ServiceCard key={s.id} service={s} cat={c} onSelectService={onSelectService} />)}
              </div>
            </div>
          );
        })
      ) : (
        <>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>Ничего не найдено</div>
              <div style={{ fontSize: 13, color: C.gray500, marginTop: 6 }}>Попробуйте другой запрос</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {filtered.map(s => {
                const c = CATEGORIES.find(c => c.id === s.cat);
                return <ServiceCard key={s.id} service={s} cat={c} onSelectService={onSelectService} />;
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ServiceCard({ service: s, cat, onSelectService }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, borderRadius: 14,
        border: `2px solid ${hov ? (cat?.color || C.green) : C.gray300}`,
        boxShadow: hov ? `0 8px 24px ${cat?.color || C.green}20` : "0 1px 4px #0000000A",
        padding: "20px", display: "flex", flexDirection: "column",
        transition: "all .2s",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12,
          background: (cat?.color || C.green) + "15",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
          {s.icon}
        </div>
        <div style={{ padding: "3px 8px", borderRadius: 6, background: C.gray100,
          fontSize: 10, fontWeight: 700, color: C.gray500 }}>
          SLA {s.sla}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 6, lineHeight: 1.3 }}>
        {s.title}
      </div>
      <div style={{ fontSize: 12, color: C.gray500, flex: 1, lineHeight: 1.5, marginBottom: 14 }}>
        {s.desc.length > 90 ? s.desc.slice(0, 90) + "..." : s.desc}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: C.gray500 }}>
          👤 {s.who.length > 18 ? s.who.slice(0, 18) + "…" : s.who}
        </div>
        <button onClick={() => onSelectService(s)}
          style={{ padding: "7px 14px", borderRadius: 8, border: "none",
            background: hov ? (cat?.color || C.green) : C.gray100,
            color: hov ? "#FFF" : C.gray700, fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
          Подать →
        </button>
      </div>
    </div>
  );
}
