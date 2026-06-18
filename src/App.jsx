import { useState, useEffect } from "react";

// ── Halyk Bank palette ─────────────────────────────────────────────────────
const C = {
  green:      "#00B156",
  greenDark:  "#007A3D",
  greenLight: "#E8F5EE",
  white:      "#FFFFFF",
  bg:         "#F2F2F7",
  dark:       "#1C1C1E",
  gray2:      "#636366",
  gray4:      "#C7C7CC",
  gray6:      "#F2F2F7",
  orange:     "#FF9500",
  blue:       "#007AFF",
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
function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Storage ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "candidates-v1";
function loadFromStorage() {
  try {
    const obj = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.entries(obj).map(([id, d]) => ({
      id, url: d.url || "", name: d.name || "", company: d.company || "", country: d.country || "",
    }));
  } catch { return []; }
}
function saveToStorage(list) {
  const obj = {};
  list.forEach(c => { obj[c.id] = { url: c.url, name: c.name, company: c.company, country: c.country }; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// ══════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [candidates, setCandidates] = useState(() => loadFromStorage());
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch]         = useState("");
  const [copied, setCopied]         = useState(false);

  useEffect(() => { saveToStorage(candidates); }, [candidates]);

  function handleImport() {
    const urls = parseLinks(importText);
    if (!urls.length) return;
    setCandidates(prev => {
      const exists = new Set(prev.map(c => c.id));
      const fresh = urls
        .map(url => ({ id: extractSlug(url) || url, url: normalizeUrl(url), name: "", company: "", country: "" }))
        .filter(c => c.id && !exists.has(c.id));
      return [...prev, ...fresh];
    });
    setImportText("");
    setShowImport(false);
  }

  function updateField(id, field, value) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  function deleteCandidate(id) {
    setCandidates(prev => prev.filter(c => c.id !== id));
  }

  function exportTSV() {
    const tsv = ["ФИО\tКомпания\tСтрана\tLinkedIn",
      ...candidates.map(c => [c.name, c.company, c.country, c.url].join("\t"))
    ].join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tsv).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const a = document.createElement("a");
      a.href = "data:text/tab-separated-values;charset=utf-8," + encodeURIComponent(tsv);
      a.download = "candidates.tsv"; a.click();
    }
  }

  const total       = candidates.length;
  const filledCount = candidates.filter(isFilled).length;
  const pct         = total ? Math.round((filledCount / total) * 100) : 0;

  const filtered = candidates.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return [c.name, c.company, c.country, c.id, c.url].some(v => v.toLowerCase().includes(q));
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1A1A1A",
      display: "flex",
      justifyContent: "center",
      fontFamily: "-apple-system, 'SF Pro Text', 'Inter', sans-serif",
    }}>
      {/* Phone frame */}
      <div style={{
        width: "100%", maxWidth: 430,
        minHeight: "100vh",
        background: C.bg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(160deg, ${C.green} 0%, ${C.greenDark} 100%)`,
          padding: "20px 20px 24px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: 2, marginBottom: 4 }}>
                HALYK BANK
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.white, lineHeight: 1 }}>
                Candidate Tracker
              </div>
              {total > 0 && (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                  {filledCount} из {total} карточек заполнено
                </div>
              )}
            </div>
            {total > 0 && (
              <button onClick={exportTSV} style={{
                background: "rgba(255,255,255,0.18)",
                color: C.white,
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 20, padding: "7px 16px",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                backdropFilter: "blur(4px)",
              }}>
                {copied ? "✓ Готово" : "Экспорт"}
              </button>
            )}
          </div>

          {/* Progress */}
          {total > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ height: 5, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: C.white, borderRadius: 3,
                  transition: "width .5s ease",
                }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 90px" }}>

          {/* Search */}
          {total > 0 && (
            <div style={{
              background: C.white, borderRadius: 13,
              padding: "2px 14px", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}>
              <span style={{ fontSize: 15, color: C.gray4 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по имени, компании, стране…"
                style={{
                  flex: 1, border: "none", outline: "none", background: "transparent",
                  fontSize: 15, color: C.dark, fontFamily: "inherit",
                  padding: "11px 0",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: C.gray4, border: "none", color: C.white,
                  fontSize: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>×</button>
              )}
            </div>
          )}

          {/* Import panel */}
          {showImport && (
            <div style={{
              background: C.white, borderRadius: 18, padding: "20px",
              marginBottom: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 4 }}>
                Добавить кандидатов
              </div>
              <div style={{ fontSize: 13, color: C.gray2, lineHeight: 1.5, marginBottom: 14 }}>
                Вставьте LinkedIn-ссылки — сколько угодно. Дубли удалятся автоматически.
              </div>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={"https://www.linkedin.com/in/ivan-ivanov/\nhttps://www.linkedin.com/in/anna-petrova/"}
                autoFocus
                style={{
                  width: "100%", boxSizing: "border-box", height: 110,
                  border: `1.5px solid ${C.gray4}`, borderRadius: 12,
                  padding: "12px", fontSize: 14, fontFamily: "inherit",
                  color: C.dark, resize: "none", outline: "none",
                  background: C.bg, lineHeight: 1.5,
                }}
                onFocus={e => (e.target.style.borderColor = C.green)}
                onBlur={e => (e.target.style.borderColor = C.gray4)}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <button onClick={handleImport} style={{
                  flex: 1, background: C.green, color: C.white, border: "none",
                  borderRadius: 13, padding: "13px", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Добавить
                </button>
                <button onClick={() => { setShowImport(false); setImportText(""); }} style={{
                  background: C.bg, color: C.gray2, border: "none",
                  borderRadius: 13, padding: "13px 18px", fontSize: 15,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Candidate cards */}
          {filtered.map(c => (
            <CandidateCard key={c.id} candidate={c} onUpdate={updateField} onDelete={deleteCandidate} />
          ))}

          {/* Empty state */}
          {total === 0 && !showImport && (
            <div style={{ textAlign: "center", paddingTop: 70, paddingBottom: 40 }}>
              <div style={{
                width: 90, height: 90, borderRadius: "50%",
                background: C.greenLight, margin: "0 auto 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40,
              }}>👤</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 10 }}>
                Нет кандидатов
              </div>
              <div style={{ fontSize: 14, color: C.gray2, lineHeight: 1.6, marginBottom: 28, padding: "0 30px" }}>
                Нажмите «+» и вставьте LinkedIn-ссылки, чтобы начать работу
              </div>
              <button onClick={() => setShowImport(true)} style={{
                background: C.green, color: C.white, border: "none",
                borderRadius: 25, padding: "14px 36px",
                fontSize: 16, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(0,177,86,0.4)",
              }}>
                + Добавить ссылки
              </button>
            </div>
          )}

          {/* No search results */}
          {total > 0 && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: C.gray2 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Ничего не найдено</div>
              <div style={{ fontSize: 13 }}>«{search}»</div>
            </div>
          )}
        </div>

        {/* ── FAB ─────────────────────────────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: 28, right: 20, zIndex: 50,
        }}>
          <button
            onClick={() => setShowImport(v => !v)}
            style={{
              width: 58, height: 58, borderRadius: "50%",
              background: showImport
                ? C.gray2
                : `linear-gradient(135deg, ${C.green}, ${C.greenDark})`,
              color: C.white, border: "none",
              fontSize: 30, cursor: "pointer",
              boxShadow: showImport
                ? "0 4px 14px rgba(0,0,0,0.25)"
                : "0 4px 20px rgba(0,177,86,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit",
              transition: "all .2s",
              lineHeight: 1,
            }}
          >
            {showImport ? "×" : "+"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CANDIDATE CARD
// ══════════════════════════════════════════════════════════════════════════
function CandidateCard({ candidate: c, onUpdate, onDelete }) {
  const filled = isFilled(c);
  const ini = c.name.trim() ? initials(c.name) : null;

  return (
    <div style={{
      background: C.white, borderRadius: 18,
      marginBottom: 10, overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    }}>
      {/* Top strip — color accent */}
      <div style={{ height: 3, background: filled ? C.green : C.orange }} />

      {/* Header row */}
      <div style={{
        padding: "14px 16px 12px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: `1px solid ${C.bg}`,
      }}>
        {/* Avatar */}
        <div style={{
          width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
          background: filled
            ? `linear-gradient(135deg, ${C.green}, ${C.greenDark})`
            : C.bg,
          border: filled ? "none" : `2px dashed ${C.gray4}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: filled ? C.white : C.gray4,
          fontWeight: 700, fontSize: 16,
        }}>
          {ini || "?"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11, color: C.blue, textDecoration: "none",
              display: "block", overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
          >
            linkedin.com/in/{c.id}/
          </a>
          <div style={{
            fontSize: 11, fontWeight: 600, marginTop: 3,
            color: filled ? C.green : C.orange,
          }}>
            {filled ? "✓ Данные заполнены" : "· Нужно заполнить"}
          </div>
        </div>

        <button
          onClick={() => onDelete(c.id)}
          style={{
            background: "none", border: "none", color: C.gray4,
            cursor: "pointer", fontSize: 22, padding: "4px 6px",
            lineHeight: 1, fontFamily: "inherit",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = C.gray2)}
          onMouseLeave={e => (e.currentTarget.style.color = C.gray4)}
        >
          ×
        </button>
      </div>

      {/* Input rows — iOS-settings style */}
      <InputRow label="ФИО"      value={c.name}    onChange={v => onUpdate(c.id, "name", v)}    placeholder="Имя Фамилия" />
      <InputRow label="Компания" value={c.company} onChange={v => onUpdate(c.id, "company", v)} placeholder="Название компании" />
      <InputRow label="Страна"   value={c.country} onChange={v => onUpdate(c.id, "country", v)} placeholder="Страна" last />
    </div>
  );
}

function InputRow({ label, value, onChange, placeholder, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "0 16px",
      borderBottom: last ? "none" : `1px solid ${C.bg}`,
      minHeight: 48,
    }}>
      <span style={{
        fontSize: 14, color: C.gray2,
        width: 90, flexShrink: 0,
      }}>
        {label}
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: "none", outline: "none",
          background: "transparent", fontSize: 15,
          color: C.dark, fontFamily: "inherit",
          padding: "13px 0",
        }}
      />
    </div>
  );
}
