import { useState, useRef, useEffect } from "react";
import {
  BookOpen, Leaf, Lightbulb, MessageCircle, Link2, Target, Volume2, Microscope, Search,
  Globe, ScanSearch, CircleDot, CheckCircle, BookMarked, Languages, ChevronRight,
  Loader2, PenLine, FlaskConical
} from "lucide-react";

const SYSTEM_PROMPT = `You are an expert NLP linguist specializing in Hindi and Hinglish language ambiguity analysis.

When a user provides a Hindi or Hinglish sentence, you MUST analyze it for ALL applicable ambiguity types studied in NLP and return ONLY a valid JSON object — no markdown, no explanation outside the JSON.

The JSON format must be exactly:
{
  "original_sentence": "...",
  "language_detected": "Hindi" | "Hinglish" | "Hindi+English",
  "ambiguity_found": true | false,
  "ambiguities": [
    {
      "type": "...",
      "category": "...",
      "explanation": "...",
      "example_from_sentence": "...",
      "severity": "high" | "medium" | "low"
    }
  ],
  "possible_meanings": [
    {
      "meaning_number": 1,
      "interpretation": "...",
      "explanation": "...",
      "context_clue": "..."
    }
  ],
  "resolved_most_likely": "...",
  "confidence": "high" | "medium" | "low",
  "linguistic_note": "..."
}

Ambiguity types to check (from NLP curriculum):
1. LEXICAL AMBIGUITY – a word has multiple meanings (polysemy or homonymy)
2. SYNTACTIC / STRUCTURAL AMBIGUITY – sentence structure can be parsed in multiple ways (attachment ambiguity, coordination ambiguity)
3. SEMANTIC AMBIGUITY – meaning of a phrase is unclear even if structure is clear (scope ambiguity, quantifier ambiguity)
4. PRAGMATIC AMBIGUITY – utterance meaning differs based on context, speaker intent, or speech act
5. REFERENTIAL / ANAPHORIC AMBIGUITY – pronoun or reference could point to multiple entities
6. SCOPE AMBIGUITY – operators like negation or quantifiers have unclear scope
7. PHONOLOGICAL AMBIGUITY – same sound, different meaning (relevant in transliterated Hinglish)
8. MORPHOLOGICAL AMBIGUITY – a word form can be analyzed with multiple morphemes

Only include types that actually apply. Be thorough, educational, and precise. Always respond in English for explanations even if the sentence is Hindi.`;

const TYPE_COLORS = {
  "LEXICAL AMBIGUITY":       { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", Icon: BookOpen },
  "SYNTACTIC AMBIGUITY":     { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a8a", Icon: Leaf },
  "STRUCTURAL AMBIGUITY":    { bg: "#dbeafe", border: "#3b82f6", text: "#1e3a8a", Icon: Leaf },
  "SEMANTIC AMBIGUITY":      { bg: "#ede9fe", border: "#8b5cf6", text: "#4c1d95", Icon: Lightbulb },
  "PRAGMATIC AMBIGUITY":     { bg: "#fce7f3", border: "#ec4899", text: "#831843", Icon: MessageCircle },
  "REFERENTIAL AMBIGUITY":   { bg: "#d1fae5", border: "#10b981", text: "#064e3b", Icon: Link2 },
  "ANAPHORIC AMBIGUITY":     { bg: "#d1fae5", border: "#10b981", text: "#064e3b", Icon: Link2 },
  "SCOPE AMBIGUITY":         { bg: "#fee2e2", border: "#ef4444", text: "#7f1d1d", Icon: Target },
  "PHONOLOGICAL AMBIGUITY":  { bg: "#ffedd5", border: "#f97316", text: "#7c2d12", Icon: Volume2 },
  "MORPHOLOGICAL AMBIGUITY": { bg: "#f0fdf4", border: "#22c55e", text: "#14532d", Icon: Microscope },
};

function getTypeStyle(type) {
  const upper = type.toUpperCase();
  for (const key of Object.keys(TYPE_COLORS)) {
    if (upper.includes(key.split(" ")[0])) return TYPE_COLORS[key];
  }
  return { bg: "#f1f5f9", border: "#94a3b8", text: "#1e293b", Icon: Search };
}

const EXAMPLES = [
  "वो आम खाता है",
  "Main usko dekh raha tha jab wo ja raha tha",
  "मैंने उसे देखा जब वो बाजार में था",
  "कल मैं नहीं आऊंगा",
  "राम और श्याम की बहन आई",
  "Usne apni car mein unhe chhoda",
  "सीमा ने कहा कि वह आएगी",
  "उसने कहा कि वह सही है",
  "Usne bola wo aa raha hai",
  "उसने उसे उसकी गलती बताई",
];

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (result) {
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
    }
  }, [result]);

  async function analyze() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAnimateIn(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${SYSTEM_PROMPT}\n\nAnalyze this sentence for ambiguity: "${input}"`
              }]
            }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
          }),
        }
      );
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) analyze();
  }

  return (
    <div style={styles.root}>
      <div style={styles.bgPattern} />

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoDevanagari}>अर्थ</span>
            <div>
              <div style={styles.logoTitle}>ArthaBot</div>
              <div style={styles.logoSub}>Hindi Ambiguity Resolver · NLP Analysis</div>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.inputCard}>
          <div style={styles.inputLabel}>
            <PenLine size={14} color="#a8a4c0" />
            Enter a Hindi or Hinglish sentence
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. वो आम खाता है  or  Usne bola wo aa raha hai"
            style={styles.textarea}
            rows={3}
          />
          <div style={styles.inputFooter}>
            <div style={styles.examples}>
              <span style={styles.examplesLabel}>Try:</span>
              {EXAMPLES.map((ex, i) => (
                <button key={i} style={styles.exampleChip} onClick={() => setInput(ex)}>
                  {ex}
                </button>
              ))}
            </div>
            <button
              style={{ ...styles.analyzeBtn, ...(loading ? styles.analyzeBtnLoading : {}) }}
              onClick={analyze}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>Analyze <ChevronRight size={16} /></>
              )}
            </button>
          </div>
          <div style={styles.hint}>Tip: Press Ctrl+Enter to analyze</div>
        </section>

        {error && <div style={styles.errorBox}>{error}</div>}

        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.loadingSpinner} />
            <div style={styles.loadingText}>Analyzing linguistic patterns…</div>
          </div>
        )}

        {result && (
          <div style={{ ...styles.results, opacity: animateIn ? 1 : 0, transform: animateIn ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>

            <div style={styles.metaRow}>
              <MetaChip Icon={Globe} label="Language" value={result.language_detected} color="#6366f1" />
              <MetaChip Icon={ScanSearch} label="Ambiguity" value={result.ambiguity_found ? `${result.ambiguities?.length || 0} type(s) found` : "None detected"} color={result.ambiguity_found ? "#ef4444" : "#10b981"} />
              <MetaChip Icon={CircleDot} label="Confidence" value={result.confidence?.toUpperCase()} color={result.confidence === "high" ? "#10b981" : result.confidence === "medium" ? "#f59e0b" : "#ef4444"} />
            </div>

            {result.ambiguities?.length > 0 && (
              <Section Icon={FlaskConical} title="Ambiguity Types Detected">
                <div style={styles.ambigGrid}>
                  {result.ambiguities.map((a, i) => {
                    const st = getTypeStyle(a.type);
                    return (
                      <div key={i} style={{ ...styles.ambigCard, backgroundColor: st.bg, borderColor: st.border }}>
                        <div style={styles.ambigHeader}>
                          <st.Icon size={18} color={st.text} style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ ...styles.ambigType, color: st.text }}>{a.type}</div>
                            {a.category && <div style={styles.ambigCategory}>{a.category}</div>}
                          </div>
                          <SeverityBadge severity={a.severity} />
                        </div>
                        <p style={styles.ambigExplanation}>{a.explanation}</p>
                        {a.example_from_sentence && (
                          <div style={{ ...styles.ambigExample, borderColor: st.border, color: st.text }}>
                            <span style={styles.ambigExampleLabel}>In your sentence: </span>
                            <em>"{a.example_from_sentence}"</em>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {result.possible_meanings?.length > 0 && (
              <Section Icon={Lightbulb} title="Possible Interpretations">
                <div style={styles.meaningsGrid}>
                  {result.possible_meanings.map((m, i) => (
                    <div key={i} style={styles.meaningCard}>
                      <div style={styles.meaningNum}>#{m.meaning_number || i + 1}</div>
                      <div style={styles.meaningContent}>
                        <div style={styles.meaningInterp}>{m.interpretation}</div>
                        <div style={styles.meaningExp}>{m.explanation}</div>
                        {m.context_clue && (
                          <div style={styles.meaningClue}>
                            <span style={styles.meaningClueLabel}>Context clue: </span>{m.context_clue}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {result.resolved_most_likely && (
              <Section Icon={CheckCircle} title="Most Likely Meaning">
                <div style={styles.resolvedBox}>{result.resolved_most_likely}</div>
              </Section>
            )}

            {result.linguistic_note && (
              <Section Icon={BookMarked} title="Linguistic Note">
                <div style={styles.noteBox}>{result.linguistic_note}</div>
              </Section>
            )}
          </div>
        )}

        {!result && !loading && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyGlyph}>अ</div>
            <div style={styles.emptyTitle}>Detect ambiguity in Hindi & Hinglish</div>
            <div style={styles.emptyDesc}>
              Enter any sentence above to identify Lexical, Syntactic, Semantic, Pragmatic, Referential, Scope, Phonological, or Morphological ambiguity with all possible meanings explained.
            </div>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        ArthaBot · End-to-End NLP Ambiguity Resolution
      </footer>
    </div>
  );
}

function Section({ Icon, title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>
        <Icon size={14} color="#a8a4c0" style={{ flexShrink: 0 }} />
        {title}
      </div>
      {children}
    </div>
  );
}

function MetaChip({ Icon, label, value, color }) {
  return (
    <div style={styles.metaChip}>
      <Icon size={20} color={color} style={{ flexShrink: 0 }} />
      <div>
        <div style={styles.metaLabel}>{label}</div>
        <div style={{ ...styles.metaValue, color }}>{value}</div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }) {
  const colors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
  return (
    <div style={{ ...styles.severityBadge, backgroundColor: colors[severity] || "#94a3b8" }}>
      {severity?.toUpperCase()}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    fontFamily: "'Crimson Pro', Georgia, serif",
    background: "#0f0e17",
    color: "#fffffe",
    position: "relative",
    overflowX: "hidden",
  },
  bgPattern: {
    position: "fixed", inset: 0, zIndex: 0,
    background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  header: {
    position: "relative", zIndex: 10,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15,14,23,0.85)",
    backdropFilter: "blur(20px)",
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: 900, margin: "0 auto", padding: "16px 0",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 14 },
  logoDevanagari: {
    fontSize: 44, fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.4, paddingTop: 4, paddingBottom: 4, display: "inline-block",
    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    fontFamily: "'Noto Serif Devanagari', serif",
  },
  logoTitle: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "#fffffe" },
  logoSub: { fontSize: 11, color: "#a8a4c0", letterSpacing: "0.08em", textTransform: "uppercase" },
  main: {
    position: "relative", zIndex: 5,
    maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px",
  },
  inputCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20, padding: "28px",
    backdropFilter: "blur(10px)",
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 13, fontWeight: 600, color: "#a8a4c0",
    letterSpacing: "0.06em", textTransform: "uppercase",
    marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
  },
  textarea: {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12, padding: "14px 16px",
    color: "#fffffe", fontSize: 18,
    fontFamily: "'Noto Serif Devanagari', 'Crimson Pro', Georgia, serif",
    lineHeight: 1.7, resize: "vertical",
    outline: "none", transition: "border-color 0.2s",
  },
  inputFooter: {
    marginTop: 14, display: "flex",
    alignItems: "flex-start", justifyContent: "space-between",
    gap: 16, flexWrap: "wrap",
  },
  examples: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", flex: 1 },
  examplesLabel: { fontSize: 11, color: "#6b6b8a", letterSpacing: "0.05em", flexShrink: 0 },
  exampleChip: {
    fontSize: 12, padding: "4px 10px",
    borderRadius: 20, border: "1px solid rgba(167,139,250,0.3)",
    background: "rgba(167,139,250,0.08)", color: "#c4b5fd",
    cursor: "pointer", fontFamily: "'Noto Serif Devanagari', serif",
    transition: "all 0.2s", whiteSpace: "nowrap",
  },
  analyzeBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "12px 28px", borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "#fff", fontSize: 15, fontWeight: 700,
    border: "none", cursor: "pointer", flexShrink: 0,
    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
    transition: "all 0.2s", letterSpacing: "0.01em",
  },
  analyzeBtnLoading: { opacity: 0.7, cursor: "not-allowed" },
  hint: { marginTop: 8, fontSize: 11, color: "#4a4a6a" },
  errorBox: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 12, padding: "14px 18px", color: "#fca5a5",
    marginBottom: 20, fontSize: 14,
  },
  loadingBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "60px 20px", gap: 16,
  },
  loadingSpinner: {
    width: 44, height: 44, borderRadius: "50%",
    border: "3px solid rgba(99,102,241,0.2)",
    borderTop: "3px solid #6366f1",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#a8a4c0", fontSize: 14, letterSpacing: "0.05em" },
  results: { display: "flex", flexDirection: "column", gap: 24 },
  metaRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  metaChip: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 150,
  },
  metaLabel: { fontSize: 10, color: "#6b6b8a", textTransform: "uppercase", letterSpacing: "0.06em" },
  metaValue: { fontSize: 14, fontWeight: 700, marginTop: 2 },
  section: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "22px 24px",
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, marginBottom: 16,
    color: "#a8a4c0", letterSpacing: "0.06em", textTransform: "uppercase",
    display: "flex", alignItems: "center", gap: 8,
  },
  ambigGrid: { display: "flex", flexDirection: "column", gap: 12 },
  ambigCard: {
    borderRadius: 12, padding: "16px 18px",
    border: "1px solid", transition: "transform 0.2s",
  },
  ambigHeader: {
    display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8,
  },
  ambigType: { fontSize: 14, fontWeight: 800, letterSpacing: "0.02em" },
  ambigCategory: { fontSize: 11, color: "#64748b", marginTop: 2, fontStyle: "italic" },
  ambigExplanation: { fontSize: 14, lineHeight: 1.65, color: "#374151", margin: "0 0 8px 0" },
  ambigExample: {
    fontSize: 13, padding: "8px 12px",
    borderLeft: "3px solid", borderRadius: "0 6px 6px 0",
    background: "rgba(255,255,255,0.5)",
  },
  ambigExampleLabel: { fontWeight: 700 },
  severityBadge: {
    marginLeft: "auto", flexShrink: 0,
    fontSize: 9, fontWeight: 800, padding: "3px 8px",
    borderRadius: 20, color: "#fff", letterSpacing: "0.08em",
    alignSelf: "flex-start",
  },
  meaningsGrid: { display: "flex", flexDirection: "column", gap: 12 },
  meaningCard: {
    display: "flex", gap: 16, alignItems: "flex-start",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12, padding: "14px 16px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  meaningNum: {
    flexShrink: 0, width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 800, color: "#fff",
  },
  meaningContent: { flex: 1 },
  meaningInterp: { fontSize: 15, fontWeight: 700, color: "#e2e0ef", marginBottom: 4 },
  meaningExp: { fontSize: 13, color: "#9994b4", lineHeight: 1.6 },
  meaningClue: { fontSize: 12, color: "#6366f1", marginTop: 6 },
  meaningClueLabel: { fontWeight: 700 },
  resolvedBox: {
    background: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.3)",
    borderRadius: 12, padding: "14px 18px",
    color: "#6ee7b7", fontSize: 15, lineHeight: 1.7,
  },
  noteBox: {
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 12, padding: "14px 18px",
    color: "#c4b5fd", fontSize: 14, lineHeight: 1.7,
  },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "60px 20px", textAlign: "center",
  },
  emptyGlyph: {
    fontSize: 80, lineHeight: 1,
    background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    fontFamily: "'Noto Serif Devanagari', serif", marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: "#e2e0ef", marginBottom: 12 },
  emptyDesc: { fontSize: 14, color: "#6b6b8a", lineHeight: 1.7, maxWidth: 500 },
  footer: {
    position: "relative", zIndex: 5,
    textAlign: "center", padding: "20px",
    fontSize: 11, color: "#3a3a5c",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    letterSpacing: "0.06em",
  },
};