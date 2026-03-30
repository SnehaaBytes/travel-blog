import { useState, useRef, useEffect } from "react";

const CompassSVG = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none"/>
  </svg>
);
const SendSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const CloseSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const BackSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const CheckSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const STEPS = [
  {
    id: "destination", emoji: "🗺️",
    question: "Where in India would you like to explore?",
    hint: "e.g. Rajasthan, Goa, Kerala, Himalayas, Mumbai…",
    type: "text",
    placeholder: "Type your destination…",
  },
  {
    id: "days", emoji: "📅",
    question: "How many days is your trip?",
    hint: "Choose a duration",
    type: "chips",
    options: ["3 days", "5 days", "7 days", "10 days", "14 days", "Custom"],
  },
  {
    id: "people", emoji: "👥",
    question: "Who is travelling with you?",
    hint: "Select all that apply",
    type: "chips", multi: true,
    options: ["Solo 🧍", "Couple 💑", "Friends 👫", "Family 👨‍👩‍👧", "Group 🎉"],
  },
  {
    id: "budget", emoji: "💰",
    question: "What is your budget per person per day?",
    hint: "Choose your comfort level",
    type: "chips",
    options: ["Budget (₹2k/day)", "Mid-range (₹5k/day)", "Comfort (₹10k/day)", "Luxury (₹20k+/day)"],
  },
  {
    id: "interests", emoji: "🎨",
    question: "What experiences excite you most?",
    hint: "Pick all your favourites",
    type: "chips", multi: true,
    options: ["History & Forts 🏰", "Beaches 🏖️", "Food & Chai ☕", "Spirituality 🕌", "Wildlife 🐘", "Adventure 🧗", "Backwaters 🚣", "Shopping 🛍️"],
  },
  {
    id: "accommodation", emoji: "🏨",
    question: "Where do you prefer to stay?",
    hint: "Choose your style",
    type: "chips",
    options: ["Hostels / Guesthouses", "Mid-range Hotels", "Heritage Havelis", "Luxury Resorts", "Homestays"],
  },
];

const SYSTEM_ITINERARY = `You are India's most knowledgeable AI travel concierge — a fusion of a seasoned travel journalist, local cultural expert, and luxury trip planner with 20+ years of on-ground India experience. You have personally visited every corner of India, eaten everywhere from roadside dhabas to fine dining restaurants, and know the pulse of each destination across every season.

The user will share their trip details. You MUST produce the most detailed, personalised, intelligent day-by-day India itinerary possible.

INTELLIGENCE RULES (CRITICAL):
1. PERSONALISATION: Every recommendation must match their budget, travel group, interests and accommodation. A solo budget backpacker gets hostels + street food + trains. A luxury couple gets heritage havelis + fine dining + private transfers. NEVER give generic advice.
2. HYPER-LOCAL: Name specific restaurants and hotels (e.g. "Laxmi Mishthan Bhandar in Jaipur for kachori"). Never say "try local food" — name the place and dish.
3. HIDDEN GEMS: For every major tourist spot, mention one off-the-beaten-path alternative that 90% of tourists miss.
4. TIMING: Mention best times to visit each site (e.g. "Taj Mahal at sunrise 6am — beat the crowds and catch golden light").
5. PRACTICAL: Include realistic travel times, transport options with costs, and flag common tourist scams to avoid.
6. CULTURAL DEPTH: Add fascinating history, local customs, dress codes for religious sites, useful local phrases.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

Start with one warm, personalised welcome line.

Then for each day:
📅 Day N — [Evocative Theme Title]
☀️ Morning: [activity + specific breakfast spot + dish]
🌤️ Afternoon: [activity + specific lunch spot]
🌙 Evening: [activity + specific dinner spot]
🏨 Stay: [specific hotel name + area + why it suits their budget]
💡 Local Secret: [one insider tip no guidebook mentions]

After all days add:
🍛 MUST-EAT DISHES — 5 dishes with exact places to find them
🚂 GETTING AROUND — transport options with approximate costs
📸 BEST PHOTO SPOTS — 3 opportunities with ideal timing
⚠️ WATCH OUT — 2 common tourist mistakes in this destination
💸 BUDGET BREAKDOWN — realistic daily costs at their tier
🎒 PACK SMART — 4 destination-specific packing essentials

TONE: Warm, expert, vivid. Use "yatra" and "namaste" sparingly and naturally. Write like a trusted friend who knows India inside out. Max 700 words — rich but never padded.`;

const SYSTEM_FOLLOWUP = `You are India's most knowledgeable AI travel concierge with 20+ years of on-ground experience across every Indian state. The user has already received their personalised itinerary and is now asking follow-up questions. You are their real-time travel advisor — like a brilliant local friend on speed dial.

EXPERTISE RULES:
- Restaurants: Name specific places, best dishes to order, price range, best time to visit
- Transport: Give exact options (Ola/Uber vs auto vs metro vs train), journey times, current fare estimates, insider tips
- Packing: Be hyper-specific to their destination, season and activities — no generic lists
- Alternatives: Offer 2–3 genuine options at different price points
- Scams/Safety: Be direct and name specific scams common in that area
- Culture: Share fascinating history, mythology, customs and local etiquette

TONE: Conversational, warm, knowledgeable — like a brilliant local friend, not a customer service bot.
LENGTH: 120–220 words. Focused and useful — never padded.
FORMAT: Use emojis for visual clarity.
ALWAYS end with one unexpected bonus tip the user didn't ask for but will love.`;

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "3px 0" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#d4622a",
          animation: "dotBounce 1.1s ease-in-out infinite",
          animationDelay: `${i * 0.18}s`,
        }}/>
      ))}
    </div>
  );
}

function Bubble({ msg }) {
  const user = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: user ? "flex-end" : "flex-start", marginBottom: 10 }}>
      {!user && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#f4a828,#d4622a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 8, marginTop: 2, fontSize: 15,
          boxShadow: "0 2px 8px rgba(212,98,42,0.45)",
        }}>🪔</div>
      )}
      <div style={{
        maxWidth: "82%", padding: "9px 14px",
        borderRadius: user ? "16px 16px 3px 16px" : "16px 16px 16px 3px",
        background: user ? "linear-gradient(135deg,#7b1d0e,#4a0e06)" : "rgba(255,245,235,0.10)",
        border: user ? "1px solid rgba(244,168,40,0.35)" : "1px solid rgba(255,210,150,0.15)",
        color: user ? "#fde8c8" : "#f5e6d0",
        fontSize: 13.5, lineHeight: 1.58,
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        fontFamily: "'Noto Sans', sans-serif",
      }}>{msg.content}</div>
    </div>
  );
}

function SummaryCard({ data, onEdit }) {
  const labels = {
    destination: "📍 Destination",
    days: "📅 Duration",
    people: "👥 Travellers",
    budget: "💰 Budget",
    interests: "🎨 Interests",
    accommodation: "🏨 Stay",
  };
  return (
    <div style={{
      margin: "6px 0 10px",
      background: "rgba(244,168,40,0.07)",
      border: "1px solid rgba(244,168,40,0.25)",
      borderRadius: 14, padding: "10px 13px",
      animation: "fadeSlideUp .4s ease",
    }}>
      <div style={{ fontSize: 11, color: "#f4a828", fontWeight: 600, marginBottom: 7, letterSpacing: "0.05em" }}>
        YOUR TRIP DETAILS ✨
      </div>
      {Object.entries(labels).map(([key, label]) => data[key] && (
        <div key={key} style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12 }}>
          <span style={{ color: "#8a5a30", flexShrink: 0 }}>{label}:</span>
          <span style={{ color: "#f5e6d0" }}>
            {Array.isArray(data[key]) ? data[key].join(", ") : data[key]}
          </span>
        </div>
      ))}
      <button onClick={onEdit} style={{
        marginTop: 6, background: "transparent",
        border: "1px solid rgba(244,168,40,0.3)",
        borderRadius: 8, color: "#c8864a", fontSize: 11,
        padding: "3px 10px", cursor: "pointer",
        fontFamily: "'Noto Sans', sans-serif",
      }}>✏️ Edit details</button>
    </div>
  );
}

function OnboardingStep({ step, value, onChange, onNext, onBack, stepIdx, total }) {
  const [textVal, setTextVal] = useState(typeof value === "string" ? value : "");
  const [selected, setSelected] = useState(Array.isArray(value) ? value : value ? [value] : []);
  const inputRef = useRef(null);

  useEffect(() => {
    if (step.type === "text") setTimeout(() => inputRef.current?.focus(), 200);
  }, [step]);

  function toggleChip(opt) {
    if (step.multi) {
      setSelected(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
    } else {
      setSelected([opt]);
    }
  }

  function handleNext() {
    if (step.type === "text") {
      if (!textVal.trim()) return;
      onChange(textVal.trim()); onNext(textVal.trim());
    } else {
      if (!selected.length) return;
      const val = step.multi ? selected : selected[0];
      onChange(val); onNext(val);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && step.type === "text") { e.preventDefault(); handleNext(); }
  }

  const canProceed = step.type === "text" ? textVal.trim().length > 0 : selected.length > 0;

  return (
    <div style={{ animation: "fadeSlideUp .35s ease", padding: "4px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i < stepIdx + 1 ? "linear-gradient(90deg,#f4a828,#d4622a)" : "rgba(244,168,40,0.15)",
            transition: "background .3s",
          }}/>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{step.emoji}</span>
        <div>
          <div style={{ fontSize: 14, color: "#f5e6d0", fontWeight: 500, lineHeight: 1.35 }}>{step.question}</div>
          <div style={{ fontSize: 11, color: "#7a5030", marginTop: 3 }}>{step.hint}</div>
        </div>
      </div>

      {step.type === "text" ? (
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(244,168,40,0.28)",
          borderRadius: 12, padding: "8px 10px 8px 13px",
        }}>
          <input
            ref={inputRef}
            value={textVal}
            onChange={e => setTextVal(e.target.value)}
            onKeyDown={handleKey}
            placeholder={step.placeholder}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#f5e6d0", fontSize: 13.5,
              fontFamily: "'Noto Sans', sans-serif", caretColor: "#f4a828",
            }}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
          {step.options.map(opt => {
            const active = selected.includes(opt);
            return (
              <button key={opt} onClick={() => toggleChip(opt)} style={{
                background: active ? "linear-gradient(135deg,rgba(244,168,40,0.28),rgba(212,98,42,0.22))" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? "rgba(244,168,40,0.7)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 20, padding: "6px 12px",
                color: active ? "#f4d060" : "#a07050",
                fontSize: 12.5, cursor: "pointer",
                fontFamily: "'Noto Sans', sans-serif", transition: "all .18s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {active && (
                  <span style={{
                    width: 14, height: 14, borderRadius: "50%", background: "#f4a828",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}><CheckSVG /></span>
                )}
                {opt}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {stepIdx > 0 && (
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "7px 13px",
            color: "#7a5030", fontSize: 12.5, cursor: "pointer",
            fontFamily: "'Noto Sans', sans-serif",
          }}><BackSVG /> Back</button>
        )}
        <button onClick={handleNext} disabled={!canProceed} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          background: canProceed ? "linear-gradient(135deg,#f4a828,#d4622a)" : "rgba(212,98,42,0.15)",
          border: "none", borderRadius: 10, padding: "8px 16px",
          color: canProceed ? "#fff" : "#5a3010",
          fontSize: 13, fontWeight: 600, cursor: canProceed ? "pointer" : "default",
          fontFamily: "'Noto Sans', sans-serif", transition: "all .2s",
          boxShadow: canProceed ? "0 4px 16px rgba(212,98,42,0.4)" : "none",
        }}>
          {stepIdx === STEPS.length - 1 ? "✨ Plan My Trip!" : "Next →"}
        </button>
      </div>
    </div>
  );
}

export default function AiTripPlanner() {
  const [open, setOpen]         = useState(false);
  const [phase, setPhase]       = useState("onboarding");
  const [stepIdx, setStepIdx]   = useState(0);
  const [formData, setFormData] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [error, setError]       = useState(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (!open) {
      setPhase("onboarding"); setStepIdx(0); setFormData({});
      setMessages([]); setShowHero(true); setInput(""); setError(null);
    }
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (phase === "chat") setTimeout(() => inputRef.current?.focus(), 350); }, [phase]);

  // ✅ FIXED callAI — handles all error formats correctly
  async function callAI(msgs, systemPrompt, maxTokens = 2000) {
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          system: systemPrompt,
          max_tokens: maxTokens,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg =
          typeof data?.error === "string"
            ? data.error
            : data?.error?.message || `Server error (HTTP ${res.status})`;
        throw new Error(errMsg);
      }

      const text =
        data?.content?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.text ||
        null;

      if (!text) throw new Error("Empty response from AI. Please try again.");
      return text;

    } catch (e) {
      throw new Error(
        typeof e.message === "string" ? e.message : "Unknown error occurred"
      );
    }
  }

  async function startPlanning(finalData) {
    setShowHero(false);
    setPhase("chat");

    const days          = Array.isArray(finalData.days)          ? finalData.days[0]           : finalData.days;
    const people        = Array.isArray(finalData.people)        ? finalData.people.join(", ")  : finalData.people;
    const budget        = Array.isArray(finalData.budget)        ? finalData.budget[0]          : finalData.budget;
    const interests     = Array.isArray(finalData.interests)     ? finalData.interests.join(", "): finalData.interests;
    const accommodation = Array.isArray(finalData.accommodation) ? finalData.accommodation[0]   : finalData.accommodation;

    const userSummary = `Please plan my India trip with these details:\n📍 Destination: ${finalData.destination}\n📅 Duration: ${days}\n👥 Travellers: ${people}\n💰 Budget: ${budget}\n🎨 Interests: ${interests}\n🏨 Accommodation: ${accommodation}`;

    const initMessages = [{ role: "user", content: userSummary }];
    setMessages(initMessages);
    setLoading(true);

    try {
      const reply = await callAI(initMessages, SYSTEM_ITINERARY, 2000);
      setMessages([...initMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(`⚠️ ${e.message}`);
      setMessages([...initMessages, {
        role: "assistant",
        content: `Sorry, an error occurred: ${e.message}\n\nPlease click the "🔄 Retry" button above to try again.`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendFollowUp() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    const history = [...messages, { role: "user", content: msg }];
    setMessages(history);
    setLoading(true);
    try {
      const reply = await callAI(
        history.map(m => ({ role: m.role, content: m.content })),
        SYSTEM_FOLLOWUP,
        1500
      );
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(`⚠️ ${e.message}`);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Error: ${e.message} — Please click Retry.`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleStepNext(val) {
    const step = STEPS[stepIdx];
    const updated = { ...formData, [step.id]: val };
    setFormData(updated);
    if (stepIdx < STEPS.length - 1) setStepIdx(i => i + 1);
    else startPlanning(updated);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFollowUp(); }
  }

  function resetAll() {
    setPhase("onboarding"); setStepIdx(0); setFormData({});
    setMessages([]); setShowHero(true); setInput(""); setError(null);
  }

  async function retryLast() {
    if (!messages.length) return;
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    const idx = messages.indexOf(lastUser);
    const trimmed = messages.slice(0, idx + 1);
    setMessages(trimmed);
    setError(null);
    setLoading(true);
    try {
      const isFirst = idx === 0;
      const reply = await callAI(
        trimmed.map(m => ({ role: m.role, content: m.content })),
        isFirst ? SYSTEM_ITINERARY : SYSTEM_FOLLOWUP,
        isFirst ? 2000 : 1500
      );
      setMessages([...trimmed, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(`⚠️ ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes dotBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(212,98,42,0.5)} 50%{box-shadow:0 0 0 10px rgba(212,98,42,0)} }
        .planner-scroll::-webkit-scrollbar{width:3px}
        .planner-scroll::-webkit-scrollbar-track{background:transparent}
        .planner-scroll::-webkit-scrollbar-thumb{background:rgba(244,168,40,0.3);border-radius:4px}
      `}</style>

      {/* Floating Button */}
      {!open && (
        <button onClick={() => setOpen(true)} style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#f4a828,#d4622a,#7b1d0e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 28px rgba(212,98,42,0.55)",
          animation: "pulseGlow 2.5s infinite",
          color: "#fff",
        }}>
          <CompassSVG />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 385, maxHeight: "88vh",
          background: "linear-gradient(160deg,#1a0800 0%,#2d0f02 40%,#1a0500 100%)",
          borderRadius: 22,
          border: "1px solid rgba(244,168,40,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,168,40,0.08)",
          display: "flex", flexDirection: "column",
          fontFamily: "'Noto Sans', sans-serif",
          animation: "fadeSlideUp .3s ease",
          overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 16px 12px",
            background: "linear-gradient(135deg,rgba(244,168,40,0.12),rgba(212,98,42,0.08))",
            borderBottom: "1px solid rgba(244,168,40,0.12)",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg,#f4a828,#d4622a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 14px rgba(212,98,42,0.5)",
            }}>🏯</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#f4d060", fontFamily: "'Playfair Display', serif" }}>
                Incredible India Planner
              </div>
              <div style={{ fontSize: 11, color: "#8a5030", marginTop: 1 }}>
                <span style={{ color: "#4caf50", fontSize: 9 }}>●</span> Your personalised India itinerary 🙏
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {phase === "chat" && (
                <button onClick={resetAll} title="New trip" style={{
                  background: "rgba(244,168,40,0.1)", border: "1px solid rgba(244,168,40,0.2)",
                  borderRadius: 8, padding: "5px 9px", color: "#f4a828",
                  fontSize: 11, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif",
                }}>🔄 New</button>
              )}
              <button onClick={() => setOpen(false)} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "5px 8px", color: "#7a5030",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}><CloseSVG /></button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              padding: "8px 14px", flexShrink: 0,
              background: "rgba(180,30,10,0.18)",
              borderBottom: "1px solid rgba(200,50,20,0.25)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 12, color: "#f4a060" }}>{error}</span>
              <button onClick={retryLast} style={{
                background: "rgba(212,98,42,0.3)", border: "1px solid rgba(212,98,42,0.5)",
                borderRadius: 7, padding: "3px 10px", color: "#f4d060",
                fontSize: 11, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif",
              }}>🔄 Retry</button>
            </div>
          )}

          {/* Body */}
          <div className="planner-scroll" style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 6px",
          }}>
            {/* Hero */}
            {showHero && phase === "onboarding" && (
              <div style={{
                textAlign: "center", padding: "10px 0 14px",
                animation: "fadeSlideUp .5s ease",
              }}>
                <div style={{ fontSize: 38, marginBottom: 6 }}>🇮🇳</div>
                <div style={{
                  fontSize: 17, fontWeight: 700, color: "#f4d060",
                  fontFamily: "'Playfair Display', serif", marginBottom: 5,
                }}>Plan Your Dream India Trip</div>
                <div style={{ fontSize: 12, color: "#7a5030", lineHeight: 1.5 }}>
                  Answer 6 quick questions and get a<br/>hyper-personalised itinerary ✨
                </div>
              </div>
            )}

            {/* Onboarding */}
            {phase === "onboarding" && (
              <OnboardingStep
                step={STEPS[stepIdx]}
                value={formData[STEPS[stepIdx].id]}
                onChange={val => setFormData(prev => ({ ...prev, [STEPS[stepIdx].id]: val }))}
                onNext={handleStepNext}
                onBack={() => setStepIdx(i => i - 1)}
                stepIdx={stepIdx}
                total={STEPS.length}
              />
            )}

            {/* Chat */}
            {phase === "chat" && (
              <>
                <SummaryCard data={formData} onEdit={resetAll} />
                {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "linear-gradient(135deg,#f4a828,#d4622a)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                    }}>🪔</div>
                    <div style={{
                      padding: "9px 14px",
                      background: "rgba(255,245,235,0.07)",
                      border: "1px solid rgba(255,210,150,0.12)",
                      borderRadius: "16px 16px 16px 3px",
                    }}><Dots /></div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Follow-up chips */}
          {phase === "chat" && !loading && messages.length > 1 && (
            <div style={{
              padding: "6px 14px 4px", flexShrink: 0,
              borderTop: "1px solid rgba(244,168,40,0.08)",
            }}>
              <div style={{ fontSize: 10.5, color: "#6a4020", marginBottom: 5 }}>💬 Ask a follow-up question:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["Best restaurants? 🍛", "How to get around? 🚗", "What to pack? 🎒", "Hidden gems? 💎"].map(q => (
                  <button key={q} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 100); }} style={{
                    background: "rgba(244,168,40,0.07)", border: "1px solid rgba(244,168,40,0.18)",
                    borderRadius: 14, padding: "4px 10px", color: "#c8864a",
                    fontSize: 11.5, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif",
                  }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          {phase === "chat" && (
            <div style={{
              padding: "10px 12px 14px", flexShrink: 0,
              borderTop: "1px solid rgba(244,168,40,0.1)",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(244,168,40,0.25)",
                borderRadius: 14, padding: "8px 10px 8px 14px",
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything about your trip… 🇮🇳"
                  disabled={loading}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "#f5e6d0", fontSize: 13,
                    fontFamily: "'Noto Sans', sans-serif", caretColor: "#f4a828",
                  }}
                />
                <button onClick={sendFollowUp} disabled={!input.trim() || loading} style={{
                  width: 32, height: 32, borderRadius: 10, border: "none",
                  background: input.trim() && !loading ? "linear-gradient(135deg,#f4a828,#d4622a)" : "rgba(212,98,42,0.15)",
                  color: input.trim() && !loading ? "#fff" : "#5a3010",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  flexShrink: 0, transition: "all .2s",
                  boxShadow: input.trim() && !loading ? "0 3px 12px rgba(212,98,42,0.4)" : "none",
                }}><SendSVG /></button>
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: "#4a2510", marginTop: 6 }}>
                🇮🇳 Press Enter to send
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}