import { useState, useEffect } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg:        "#F7F8FA",
  white:     "#FFFFFF",
  dark:      "#1C2B2B",
  green:     "#1F7A5C",
  greenPale: "#EBF5F1",
  gray700:   "#3D4349",
  gray500:   "#6B7280",
  gray300:   "#D1D5DB",
  gray100:   "#F3F4F6",
  orange:    "#F97316",
  blue:      "#2563EB",
};

// ── Utilities ──────────────────────────────────────────────────────────────
function extractSlug(url) {
  const m = String(url).match(/linkedin\.com\/in\/([^/?&#\s]+)/i);
  return m ? m[1].replace(/\/$/, "").toLowerCase() : null;
}

function normalizeUrl(raw) {
  const slug = extractSlug(raw);
  return slug ? `https://www.linkedin.com/in/${slug}/` : raw.trim();
}

function parseLinks(text) {
  const rx = /https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s"'<>]+/gi;
  return [...new Set((text.match(rx) || []).map(u => u.trim()))];
}

function isFilled(c) {
  return !!(c.name.trim() && c.company.trim() && c.country.trim());
}

// ── Storage ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "candidates-v1";

function loadFromStorage() {
  try {
    const obj = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.entries(obj).map(([id, d]) => ({
      id,
      url:     d.url     || "",
      name:    d.name    || "",
      company: d.company || "",
      country: d.country || "",
    }));
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  const obj = {};
  list.forEach(c => {
    obj[c.id] = { url: c.url, name: c.name, company: c.company, country: c.country };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// ── Shared button style ────────────────────────────────────────────────────
function btn(bg, color, outline = false) {
  return {
    background: outline ? "transparent" : bg,
    color,
    border: outline ? `1px solid ${C.gray300}` : "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    transition: "opacity .15s",
  };
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [candidates, setCandidates] = useState(() => loadFromStorage());
  const [importText, setImportText]   = useState("");
  const [showImport, setShowImport]   = useState(false);
  const [search, setSearch]           = useState("");
  const [copied, setCopied]           = useState(false);

  // Auto-save on every change
  useEffect(() => { saveToStorage(candidates); }, [candidates]);

  // ── Import ────────────────────────────────────────────────────────────
  function handleImport() {
    const urls = parseLinks(importText);
    if (!urls.length) return;
    setCandidates(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const fresh = urls
        .map(url => ({ id: extractSlug(url) || url, url: normalizeUrl(url), name: "", company: "", country: "" }))
        .filter(c => c.id && !existingIds.has(c.id));
      return [...prev, ...fresh];
    });
    setImportText("");
    setShowImport(false);
  }

  // ── Field update ──────────────────────────────────────────────────────
  function updateField(id, field, value) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  // ── Delete ────────────────────────────────────────────────────────────
  function deleteCandidate(id) {
    setCandidates(prev => prev.filter(c => c.id !== id));
  }

  // ── Export TSV ────────────────────────────────────────────────────────
  function exportTSV() {
    const header = "ФИО\tКомпания\tСтрана\tLinkedIn";
    const rows = candidates.map(c =>
      [c.name, c.company, c.country, c.url].join("\t")
    );
    const tsv = [header, ...rows].join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tsv).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const a = document.createElement("a");
      a.href = "data:text/tab-separated-values;charset=utf-8," + encodeURIComponent(tsv);
      a.download = "candidates.tsv";
      a.click();
    }
  }

  // ── Filtered list ─────────────────────────────────────────────────────
  const filtered = candidates.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [c.name, c.company, c.country, c.id, c.url].some(v =>
      v.toLowerCase().includes(q)
    );
  });

  const total       = candidates.length;
  const filledCount = candidates.filter(isFilled).length;
  const pct         = total ? Math.round((filledCount / total) * 100) : 0;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        background: C.dark, padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 2px 8px #00000020",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: 2 }}>HALYK BANK</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.white, lineHeight: 1 }}>Candidate Tracker</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {total > 0 && (
            <button onClick={exportTSV} style={btn(C.white, C.dark, true)}>
              {copied ? "✓ Скопировано!" : "Экспорт TSV"}
            </button>
          )}
          <button onClick={() => setShowImport(v => !v)} style={btn(C.green, C.white)}>
            + Добавить
          </button>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>

        {/* Import panel */}
        {showImport && (
          <div style={{
            background: C.white, border: `1px solid ${C.gray300}`,
            borderRadius: 12, padding: "20px", marginBottom: 20,
            boxShadow: "0 2px 12px #0000000D",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 4 }}>
              Вставьте LinkedIn-ссылки
            </div>
            <div style={{ fontSize: 12, color: C.gray500, marginBottom: 10 }}>
              Сразу много — каждую с новой строки или через пробел. Дубли и параметры url игнорируются.
            </div>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={"https://www.linkedin.com/in/ivan-ivanov/\nhttps://www.linkedin.com/in/anna-petrova/"}
              autoFocus
              onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleImport(); }}
              style={{
                width: "100%", boxSizing: "border-box", height: 110,
                border: `1px solid ${C.gray300}`, borderRadius: 8,
                padding: "10px 12px", fontSize: 13, fontFamily: "inherit",
                color: C.dark, resize: "vertical", outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={handleImport} style={btn(C.green, C.white)}>
                Добавить в список
              </button>
              <button
                onClick={() => { setShowImport(false); setImportText(""); }}
                style={btn(C.gray100, C.gray700)}
              >
                Отмена
              </button>
              <span style={{ fontSize: 11, color: C.gray500, alignSelf: "center", marginLeft: 4 }}>
                ⌘↵ для быстрого добавления
              </span>
            </div>
          </div>
        )}

        {/* Progress + search row */}
        {total > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: C.gray500 }}>Карточек заполнено</span>
              <span style={{
                fontSize: 13, fontWeight: 700,
                color: filledCount === total ? C.green : C.orange,
              }}>
                {filledCount} из {total} ({pct}%)
              </span>
            </div>
            <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: filledCount === total ? C.green : C.orange,
                borderRadius: 3,
                transition: "width .4s ease",
              }} />
            </div>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени, компании, стране, slug..."
              style={{
                width: "100%", boxSizing: "border-box",
                border: `1px solid ${C.gray300}`, borderRadius: 8,
                padding: "9px 14px", fontSize: 13, fontFamily: "inherit",
                color: C.dark, outline: "none", background: C.white,
              }}
            />
          </div>
        )}

        {/* Card list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onUpdate={updateField}
              onDelete={deleteCandidate}
            />
          ))}
        </div>

        {/* Empty state */}
        {total === 0 && !showImport && (
          <div style={{ textAlign: "center", padding: "70px 0", color: C.gray500 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
              Список пустой
            </div>
            <div style={{ fontSize: 13, marginBottom: 22 }}>
              Вставьте LinkedIn-ссылки, чтобы начать работу
            </div>
            <button onClick={() => setShowImport(true)} style={btn(C.green, C.white)}>
              + Добавить ссылки
            </button>
          </div>
        )}

        {/* No results */}
        {total > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.gray500, fontSize: 13 }}>
            Ничего не найдено по запросу «{search}»
          </div>
        )}

        {/* Footer count when filtered */}
        {filtered.length > 0 && search && (
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: C.gray500 }}>
            Показано {filtered.length} из {total}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CANDIDATE CARD
// ══════════════════════════════════════════════════════════════════════════
function CandidateCard({ candidate: c, onUpdate, onDelete }) {
  const filled = isFilled(c);

  return (
    <div style={{
      background: C.white,
      border: `1px solid ${filled ? C.green + "50" : C.gray300}`,
      borderLeft: `3px solid ${filled ? C.green : C.orange}`,
      borderRadius: 10,
      padding: "14px 16px",
      boxShadow: "0 1px 4px #0000000A",
      transition: "border-color .2s",
    }}>
      {/* Top row: status dot + URL + delete */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div
          title={filled ? "Заполнено" : "Не заполнено"}
          style={{
            width: 8, height: 8, borderRadius: "50%",
            background: filled ? C.green : C.orange,
            flexShrink: 0,
          }}
        />
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, fontSize: 12, color: C.blue,
            textDecoration: "none", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
          title={c.url}
        >
          {c.url}
        </a>
        <button
          onClick={() => onDelete(c.id)}
          title="Удалить кандидата"
          style={{
            background: "none", border: "none", color: C.gray300,
            cursor: "pointer", fontSize: 18, padding: "0 2px",
            lineHeight: 1, flexShrink: 0, fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.target.style.color = C.gray500)}
          onMouseLeave={e => (e.target.style.color = C.gray300)}
        >
          ×
        </button>
      </div>

      {/* Fields */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 10,
      }}>
        <FieldInput
          label="ФИО"
          value={c.name}
          onChange={v => onUpdate(c.id, "name", v)}
          placeholder="Иван Иванов"
        />
        <FieldInput
          label="Компания"
          value={c.company}
          onChange={v => onUpdate(c.id, "company", v)}
          placeholder="Halyk Bank"
        />
        <FieldInput
          label="Страна"
          value={c.country}
          onChange={v => onUpdate(c.id, "country", v)}
          placeholder="Казахстан"
        />
      </div>
    </div>
  );
}

// ── Inline editable field ──────────────────────────────────────────────────
function FieldInput({ label, value, onChange, placeholder }) {
  const empty = !value.trim();
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 600, color: C.gray500,
        marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5,
      }}>
        {label}
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          border: `1px solid ${empty ? C.gray100 : C.gray300}`,
          borderRadius: 6, padding: "6px 9px",
          fontSize: 13, fontFamily: "inherit",
          color: C.dark, outline: "none",
          background: empty ? C.gray100 : C.white,
          transition: "all .15s",
        }}
        onFocus={e => {
          e.target.style.borderColor = C.green;
          e.target.style.background = C.white;
        }}
        onBlur={e => {
          e.target.style.borderColor = e.target.value.trim() ? C.gray300 : C.gray100;
          e.target.style.background  = e.target.value.trim() ? C.white    : C.gray100;
        }}
      />
    </div>
  );
}
