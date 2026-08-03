import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Mic, MicOff, Video, VideoOff, ScreenShare, ScreenShareOff, Users, MessageSquare,
  Hand, PenTool, Disc, Smile, MoreHorizontal, PhoneOff, Sun, Moon, Bell, Settings,
  Search, X, Send, Paperclip, ChevronDown, ChevronRight, ChevronLeft, Check, Crown,
  Shield, ShieldCheck, Pin, Volume2, Wifi, Sparkles, Camera, User, LogOut, CreditCard,
  Lock, Eye, EyeOff, Star, Zap, Gauge, Palette, Type, Keyboard, Plus, Rocket,
  Building2, Users2, Wand2, Upload, SlidersHorizontal, Accessibility, Contrast,
  Mail, Smartphone, Monitor, BellRing, ArrowUpRight, MessageSquareText, Cpu,
  Globe, Flag, SkipForward, Link2, Copy, ShieldAlert, RefreshCw, Loader2, UserCheck, UserPlus,
  SwitchCamera, Ban, SlidersHorizontal as Sliders2,
} from "lucide-react";

/* ================================================================
   APERTURE — premium video-calling product UI (interactive demo)
   Design language: a camera/optics metaphor — "focus", "frame",
   "aperture", "signal" — rendered as a dark, glass, dual-accent
   (violet ↔ teal) interface with a mono HUD readout, echoing a
   camera's exposure display. Signature element: the "Focus Ring",
   a breathing gradient ring drawn around whoever is speaking.
   ================================================================ */

const FONT_IMPORTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

/* ---------------- mock data ---------------- */

const PEOPLE = [
  { id: 1, name: "You", initials: "YO", color: "#7C8CFF", host: true, muted: false, speaking: true, self: true },
  { id: 2, name: "Mina Osei", initials: "MO", color: "#40E0C4", host: false, muted: false, speaking: false },
  { id: 3, name: "Daniel Cho", initials: "DC", color: "#FF9F6B", host: false, muted: true, speaking: false },
  { id: 4, name: "Priya Rao", initials: "PR", color: "#B892FF", host: false, muted: false, speaking: false, coHost: true },
  { id: 5, name: "Theo Fischer", initials: "TF", color: "#6FD8A0", host: false, muted: true, speaking: false },
  { id: 6, name: "Ada Lin", initials: "AL", color: "#F0C36B", host: false, muted: false, speaking: false },
];

const INITIAL_MESSAGES = [
  { id: 1, author: "Mina Osei", initials: "MO", color: "#40E0C4", text: "Sharing the roadmap doc now, one sec.", time: "10:02", mine: false },
  { id: 2, author: "You", initials: "YO", color: "#7C8CFF", text: "Perfect, take your time.", time: "10:02", mine: true },
  { id: 3, author: "Priya Rao", initials: "PR", color: "#B892FF", text: "Can we get captions on for this part?", time: "10:03", mine: false },
];

const PLANS = [
  {
    name: "Free", price: "$0", period: "forever", icon: Sparkles,
    tagline: "Casual calls, no card required.",
    features: ["40‑min group meetings", "3 participants", "720p video", "Basic chat", "1 virtual background"],
    cta: "Current plan", highlighted: false,
  },
  {
    name: "Pro", price: "$14", period: "/ month", icon: Zap,
    tagline: "For people who live in meetings.",
    features: ["Unlimited duration", "50 participants", "1080p HD video", "5 hrs cloud recording", "AI transcription", "Custom backgrounds"],
    cta: "Upgrade to Pro", highlighted: true,
  },
  {
    name: "Business", price: "$28", period: "/ user / month", icon: Building2,
    tagline: "Teams that need control.",
    features: ["300 participants", "4K video", "Unlimited cloud recording", "AI meeting summaries", "Team workspaces", "Admin controls & analytics"],
    cta: "Upgrade to Business", highlighted: false,
  },
  {
    name: "Enterprise", price: "Custom", period: "talk to us", icon: ShieldCheck,
    tagline: "Scale, security, and support.",
    features: ["1000+ participants", "Advanced security & SSO", "Watermark removal", "Priority support", "Meeting templates", "Dedicated success manager"],
    cta: "Contact sales", highlighted: false,
  },
];

const BETA_FEATURES = [
  { name: "Real‑Time Emotion Overlay", desc: "Subtle sentiment cues rendered beside each tile, visible only to hosts.", icon: Smile },
  { name: "Haptic Feedback Sync", desc: "Phone vibrates in sync with reactions during mobile calls.", icon: Smartphone },
  { name: "AI Eye Contact Correction", desc: "Re‑aligns your gaze toward the lens without looking synthetic.", icon: Eye },
  { name: "AI Gesture Recognition", desc: "Raise a hand or thumbs‑up in frame and Nexus reacts for you.", icon: Hand },
  { name: "Smart Meeting Insights", desc: "Flags talk‑time imbalance and follow‑up questions as they happen.", icon: Gauge },
  { name: "Voice Mood Detection", desc: "Ambient tone indicator based on vocal pace and pitch, private to you.", icon: Volume2 },
  { name: "AI Auto Zoom", desc: "Gently frames tighter when you're the only one speaking.", icon: Camera },
  { name: "Smart Focus Mode", desc: "Blurs everything but the active speaker in large grids.", icon: Wand2 },
];

const WORLD = [
  { name: "Yuto", flag: "🇯🇵", color: "#7C8CFF" },
  { name: "Camila", flag: "🇧🇷", color: "#40E0C4" },
  { name: "Lena", flag: "🇩🇪", color: "#FF9F6B" },
  { name: "Amara", flag: "🇰🇪", color: "#B892FF" },
  { name: "Rohan", flag: "🇮🇳", color: "#6FD8A0" },
  { name: "Jack", flag: "🇨🇦", color: "#F0C36B" },
  { name: "Isla", flag: "🇦🇺", color: "#7C8CFF" },
  { name: "Mateo", flag: "🇲🇽", color: "#40E0C4" },
  { name: "Naledi", flag: "🇿🇦", color: "#FF9F6B" },
  { name: "Elin", flag: "🇸🇪", color: "#B892FF" },
];

const ICEBREAKERS = [
  "Ask what's the best meal they've had this month.",
  "Ask what song is stuck in their head right now.",
  "Ask what their city looks like out the window today.",
  "Ask for one thing on their bucket list.",
  "Ask what they'd do with an unplanned free day.",
  "Ask what they're most looking forward to this week.",
];

/* ---------------- small primitives ---------------- */

function Glass({ className = "", children, style }) {
  return (
    <div
      className={`backdrop-blur-xl border ${className}`}
      style={{ background: "var(--surface)", borderColor: "var(--border)", ...style }}
    >
      {children}
    </div>
  );
}

function IconBtn({ icon: Icon, active, danger, label, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 min-w-[56px] transition-all duration-200
        ${danger ? "bg-[#FF5A5F] text-white hover:bg-[#ff3f45] shadow-[0_8px_24px_-8px_#FF5A5F]" :
          active ? "bg-[color:var(--accent)] text-[#0A0D14] shadow-[0_8px_20px_-6px_var(--accent)]" :
          "bg-white/5 text-[color:var(--text-dim)] hover:bg-white/10 hover:text-[color:var(--text)]"}`}
    >
      {badge && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#FF5A5F] text-[9px] text-white flex items-center justify-center font-semibold">{badge}</span>}
      <Icon size={19} strokeWidth={2} />
      <span className="text-[10px] font-medium leading-none hidden sm:block">{label}</span>
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-[color:var(--accent)]" : "bg-white/15"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 shadow ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Slider({ value, onChange, min = 0, max = 100 }) {
  return (
    <input
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#7C8CFF]"
      style={{ background: `linear-gradient(90deg, var(--accent) ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.12) ${(value - min) / (max - min) * 100}%)` }}
    />
  );
}

function SectionLabel({ children }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-faint)] mb-3">{children}</p>;
}

/* ---------------- avatar tile with Focus Ring ---------------- */

function Tile({ person, size = "grid" }) {
  const big = size === "stage";
  return (
    <div
      className={`relative rounded-2xl overflow-hidden group ${big ? "aspect-video" : "aspect-[4/3]"}`}
      style={{ background: "linear-gradient(160deg, #171B26, #0F1219)" }}
    >
      {person.speaking && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none motion-safe:animate-pulse"
          style={{
            boxShadow: `0 0 0 2px ${person.color}, 0 0 32px -4px ${person.color}`,
            transition: "box-shadow .3s",
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`rounded-full flex items-center justify-center font-[Space_Grotesk] font-semibold text-white ${big ? "h-24 w-24 text-3xl" : "h-12 w-12 text-sm"}`}
          style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}99)` }}
        >
          {person.initials}
        </div>
      </div>
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
        {person.muted ? <MicOff size={12} className="text-white/80" /> : <Mic size={12} className="text-white/80" />}
        <span className="text-white text-[11px] font-medium">{person.name}</span>
        {person.host && <Crown size={11} className="text-[#F0C36B]" />}
        {person.coHost && <Shield size={11} className="text-[#40E0C4]" />}
      </div>
      {!big && (
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg p-1.5">
          <Pin size={12} className="text-white/80" />
        </button>
      )}
    </div>
  );
}

/* ================================================================ */

export default function NexusDemo() {
  const [theme, setTheme] = useState("dark");
  const [tab, setTab] = useState("meet"); // meet | plans | beta
  const [panel, setPanel] = useState(null); // chat | participants | settings | null
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [share, setShare] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [recording, setRecording] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [seconds, setSeconds] = useState(52 * 60 + 14);
  const [network, setNetwork] = useState(3);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("audio");
  const [micLevel, setMicLevel] = useState(62);
  const [speakerLevel, setSpeakerLevel] = useState(75);
  const [noiseSuppress, setNoiseSuppress] = useState(true);
  const [echoCancel, setEchoCancel] = useState(true);
  const [aiVoice, setAiVoice] = useState(true);
  const [blurBg, setBlurBg] = useState(true);
  const [hdVideo, setHdVideo] = useState(true);
  const [autoFraming, setAutoFraming] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [reactionFloats, setReactionFloats] = useState([]);
  const chatEndRef = useRef(null);

  const isDark = theme === "dark";

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNetwork((n) => Math.max(1, Math.min(4, n + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)))), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, panel]);

  const timeStr = useMemo(() => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  }, [seconds]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), author: "You", initials: "YO", color: "#7C8CFF", text: draft, time: "now", mine: true }]);
    setDraft("");
  };

  const sendReaction = (emoji) => {
    const id = Date.now();
    setReactionFloats((r) => [...r, { id, emoji }]);
    setTimeout(() => setReactionFloats((r) => r.filter((x) => x.id !== id)), 1800);
    setReactionsOpen(false);
  };

  const vars = isDark
    ? { "--bg": "#0A0D14", "--surface": "rgba(21,25,37,0.72)", "--surface-solid": "#151925", "--border": "rgba(255,255,255,0.08)", "--text": "#F3F4F8", "--text-dim": "#B9BECD", "--text-faint": "#6B7284", "--accent": "#7C8CFF", "--accent-2": "#40E0C4" }
    : { "--bg": "#EEF0F6", "--surface": "rgba(255,255,255,0.75)", "--surface-solid": "#FFFFFF", "--border": "rgba(15,18,30,0.08)", "--text": "#12141C", "--text-dim": "#4A4F5E", "--text-faint": "#8A8F9E", "--accent": "#5B6BF0", "--accent-2": "#1FB89A" };

  return (
    <div
      style={{ ...vars, background: "var(--bg)", color: "var(--text)", fontFamily: "Inter, sans-serif" }}
      className="min-h-screen w-full transition-colors duration-300"
    >
      <style>{FONT_IMPORTS}</style>

      {/* ---------------- TOP BAR ---------------- */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
            <div className="h-3 w-3 rounded-full bg-[#0A0D14]/70 border border-white/40" />
          </div>
          <span className="font-[Space_Grotesk] font-semibold text-[17px] tracking-tight hidden sm:block">Nexus</span>
          <nav className="hidden md:flex items-center gap-1 ml-4 rounded-full p-1" style={{ background: "var(--surface-solid)" }}>
            {[["meet", "Meet"], ["random", "Random Chat"], ["plans", "Plans"], ["beta", "Beta Labs"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${tab === id ? "text-[#0A0D14]" : "text-[color:var(--text-dim)] hover:text-[color:var(--text)]"}`}
                style={tab === id ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))" } : {}}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(isDark ? "light" : "dark")} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/5" style={{ color: "var(--text-dim)" }}>
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/5" style={{ color: "var(--text-dim)" }}>
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#FF5A5F]" />
          </button>
          <div className="relative">
            <button onClick={() => setProfileOpen((o) => !o)} className="h-9 w-9 rounded-full font-[Space_Grotesk] text-xs font-semibold flex items-center justify-center text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              YO
            </button>
            {profileOpen && (
              <Glass className="absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl z-50">
                <div className="px-3 py-2">
                  <p className="text-[13px] font-semibold">You</p>
                  <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>you@nexus.app</p>
                </div>
                <div className="h-px my-1" style={{ background: "var(--border)" }} />
                {[["Account settings", Settings, () => { setPanel("settings"); setProfileOpen(false); }], ["Billing", CreditCard, () => { setTab("plans"); setProfileOpen(false); }], ["Sign out", LogOut, () => setProfileOpen(false)]].map(([label, Icon, act]) => (
                  <button key={label} onClick={act} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] hover:bg-white/5 text-left" style={{ color: "var(--text-dim)" }}>
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </Glass>
            )}
          </div>
        </div>
      </header>

      {/* mobile tab strip */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto" style={{ borderBottom: "1px solid var(--border)" }}>
        {[["meet", "Meet"], ["random", "Random Chat"], ["plans", "Plans"], ["beta", "Beta Labs"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap ${tab === id ? "text-[#0A0D14]" : ""}`}
            style={tab === id ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))" } : { background: "var(--surface-solid)", color: "var(--text-dim)" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "meet" && (
        <MeetScreen
          {...{ mic, setMic, cam, setCam, share, setShare, handRaised, setHandRaised, recording, setRecording,
            captions, setCaptions, reactionsOpen, setReactionsOpen, moreOpen, setMoreOpen, timeStr, network,
            panel, setPanel, messages, draft, setDraft, sendMessage, chatEndRef, settingsTab, setSettingsTab,
            micLevel, setMicLevel, speakerLevel, setSpeakerLevel, noiseSuppress, setNoiseSuppress, echoCancel, setEchoCancel,
            aiVoice, setAiVoice, blurBg, setBlurBg, hdVideo, setHdVideo, autoFraming, setAutoFraming, mirror, setMirror,
            sendReaction, reactionFloats }}
        />
      )}
      {tab === "random" && <RandomScreen />}
      {tab === "plans" && <PlansScreen />}
      {tab === "beta" && <BetaScreen />}
    </div>
  );
}

/* ================================================================
   MEET SCREEN
   ================================================================ */

function MeetScreen(p) {
  const speaker = PEOPLE.find((x) => x.speaking) || PEOPLE[0];
  const others = PEOPLE.filter((x) => x.id !== speaker.id);

  const netBars = 4;
  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:h-[calc(100vh-57px)]">
      {/* ---- stage ---- */}
      <div className="flex-1 flex flex-col p-3 sm:p-5 gap-4 min-w-0">
        <div className="relative flex-1 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(160deg, #10131C, #070810)" }}>
          <Tile person={speaker} size="stage" />

          {/* HUD readout — camera-metadata styled */}
          <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md text-white/85">
            {p.recording && <span className="flex items-center gap-1 text-[#FF5A5F]"><span className="h-1.5 w-1.5 rounded-full bg-[#FF5A5F] motion-safe:animate-pulse" />REC</span>}
            <span>{p.timeStr}</span>
            <span className="text-white/30">·</span>
            <span>4K</span>
            <span className="text-white/30">·</span>
            <span>32ms</span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1"><Wifi size={12} className={p.network >= 3 ? "text-[#6FD8A0]" : "text-[#F0C36B]"} /> {["Poor", "Fair", "Good", "Excellent"][p.network - 1]}</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {Array.from({ length: netBars }).map((_, i) => (
              <span key={i} className="w-1 rounded-full" style={{ height: 6 + i * 3, background: i < p.network ? "var(--accent-2)" : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>

          {/* reaction floats */}
          <div className="absolute bottom-16 right-6 flex flex-col items-center gap-1">
            {p.reactionFloats.map((r) => (
              <span key={r.id} className="text-3xl motion-safe:animate-[floatUp_1.8s_ease-out_forwards]">{r.emoji}</span>
            ))}
          </div>
          <style>{`@keyframes floatUp { 0% { opacity:0; transform: translateY(0) scale(.6);} 15% {opacity:1;} 100% { opacity:0; transform: translateY(-90px) scale(1.15);} }`}</style>

          {/* live captions bar */}
          {p.captions && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[85%] px-4 py-2 rounded-xl bg-black/55 backdrop-blur-md text-center">
              <p className="text-white text-[13px] leading-snug"><span className="text-[color:var(--accent-2)] font-medium">Mina:</span> — let's sync the roadmap doc before we move to Q&A —</p>
            </div>
          )}
        </div>

        {/* filmstrip */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {others.map((person) => <Tile key={person.id} person={person} />)}
        </div>

        {/* ---- toolbar ---- */}
        <Glass className="rounded-2xl px-3 py-2.5 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap sticky bottom-3 shadow-2xl">
          <IconBtn icon={p.mic ? Mic : MicOff} active={p.mic} label={p.mic ? "Mute" : "Unmute"} onClick={() => p.setMic((m) => !m)} />
          <IconBtn icon={p.cam ? Video : VideoOff} active={p.cam} label={p.cam ? "Stop video" : "Start video"} onClick={() => p.setCam((c) => !c)} />
          <IconBtn icon={SwitchCamera} label="Flip camera" onClick={() => {}} />
          <IconBtn icon={p.share ? ScreenShareOff : ScreenShare} active={p.share} label="Share" onClick={() => p.setShare((s) => !s)} />
          <IconBtn icon={Users} active={p.panel === "participants"} label="People" badge={PEOPLE.length} onClick={() => p.setPanel(p.panel === "participants" ? null : "participants")} />
          <IconBtn icon={MessageSquare} active={p.panel === "chat"} label="Chat" onClick={() => p.setPanel(p.panel === "chat" ? null : "chat")} />
          <IconBtn icon={Hand} active={p.handRaised} label="Raise hand" onClick={() => p.setHandRaised((h) => !h)} />
          <IconBtn icon={PenTool} label="Whiteboard" onClick={() => {}} />
          <IconBtn icon={Disc} active={p.recording} label={p.recording ? "Stop rec." : "Record"} onClick={() => p.setRecording((r) => !r)} />
          <IconBtn icon={MessageSquareText} active={p.captions} label="Captions" onClick={() => p.setCaptions((c) => !c)} />
          <div className="relative">
            <IconBtn icon={Smile} active={p.reactionsOpen} label="React" onClick={() => p.setReactionsOpen((o) => !o)} />
            {p.reactionsOpen && (
              <Glass className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-2xl p-2 flex gap-1 shadow-2xl">
                {["👍", "❤️", "😂", "🎉", "👏", "🤔"].map((e) => (
                  <button key={e} onClick={() => p.sendReaction(e)} className="text-xl h-9 w-9 rounded-xl hover:bg-white/10 flex items-center justify-center">{e}</button>
                ))}
              </Glass>
            )}
          </div>
          <div className="relative">
            <IconBtn icon={MoreHorizontal} active={p.moreOpen} label="More" onClick={() => p.setMoreOpen((o) => !o)} />
            {p.moreOpen && (
              <Glass className="absolute bottom-full mb-2 right-0 rounded-2xl p-1.5 w-52 shadow-2xl">
                {[["Settings", Settings, () => { p.setPanel("settings"); p.setMoreOpen(false); }], ["Invite people", Users2, () => p.setMoreOpen(false)], ["Meeting info", Shield, () => p.setMoreOpen(false)]].map(([label, Icon, act]) => (
                  <button key={label} onClick={act} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] hover:bg-white/5 text-left" style={{ color: "var(--text-dim)" }}>
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </Glass>
            )}
          </div>
          <div className="w-px h-8 mx-1" style={{ background: "var(--border)" }} />
          <IconBtn icon={PhoneOff} danger label="Leave" onClick={() => {}} />
        </Glass>
      </div>

      {/* ---- side panel ---- */}
      {p.panel && (
        <div className="w-full lg:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l max-h-[70vh] lg:max-h-none overflow-hidden flex flex-col" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          {p.panel === "chat" && <ChatPanel {...p} />}
          {p.panel === "participants" && <ParticipantsPanel setPanel={p.setPanel} />}
          {p.panel === "settings" && <SettingsPanel {...p} />}
        </div>
      )}
    </div>
  );
}

function PanelHeader({ title, onClose, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
      <h3 className="font-[Space_Grotesk] font-semibold text-[15px]">{title}</h3>
      <div className="flex items-center gap-2">
        {right}
        <button onClick={onClose} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-white/5" style={{ color: "var(--text-faint)" }}><X size={15} /></button>
      </div>
    </div>
  );
}

function ChatPanel(p) {
  return (
    <>
      <PanelHeader title="Chat" onClose={() => p.setPanel(null)} />
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {p.messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.mine ? "flex-row-reverse" : ""}`}>
            <div className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</div>
            <div className={`max-w-[75%] ${m.mine ? "items-end" : "items-start"} flex flex-col`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                {!m.mine && <span className="text-[11px] font-medium" style={{ color: "var(--text-dim)" }}>{m.author}</span>}
                <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{m.time}</span>
              </div>
              <div className={`px-3 py-2 rounded-2xl text-[13px] leading-snug ${m.mine ? "text-[#0A0D14] rounded-tr-sm" : "rounded-tl-sm"}`}
                style={m.mine ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))" } : { background: "var(--surface-solid)" }}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[11px] pl-9" style={{ color: "var(--text-faint)" }}>
          <span className="flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
          Daniel is typing
        </div>
        <div ref={p.chatEndRef} />
      </div>
      <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        <button className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-white/5" style={{ color: "var(--text-faint)" }}><Paperclip size={16} /></button>
        <input
          value={p.draft} onChange={(e) => p.setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && p.sendMessage()}
          placeholder="Message everyone…"
          className="flex-1 rounded-xl px-3 py-2 text-[13px] outline-none"
          style={{ background: "var(--surface-solid)", color: "var(--text)" }}
        />
        <button onClick={p.sendMessage} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}><Send size={15} /></button>
      </div>
    </>
  );
}

function ParticipantsPanel({ setPanel }) {
  const [q, setQ] = useState("");
  const filtered = PEOPLE.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PanelHeader title={`Participants (${PEOPLE.length})`} onClose={() => setPanel(null)} />
      <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--surface-solid)" }}>
          <Search size={14} style={{ color: "var(--text-faint)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search participants" className="flex-1 bg-transparent text-[13px] outline-none" style={{ color: "var(--text)" }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1.5 rounded-xl flex items-center justify-between text-[12px]" style={{ background: "var(--surface-solid)", color: "var(--text-dim)" }}>
          <span>Waiting room</span>
          <span className="font-mono text-[color:var(--accent-2)]">0 waiting</span>
        </div>
        {filtered.map((person) => (
          <div key={person.id} className="group flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0" style={{ background: person.color }}>{person.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate flex items-center gap-1.5">
                {person.name}
                {person.host && <Crown size={12} className="text-[#F0C36B]" />}
                {person.coHost && <Shield size={12} className="text-[#40E0C4]" />}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              {person.muted ? <MicOff size={14} style={{ color: "var(--text-faint)" }} /> : <Mic size={14} style={{ color: "var(--accent-2)" }} />}
              <button className="p-1 rounded-lg hover:bg-white/10"><Pin size={13} style={{ color: "var(--text-faint)" }} /></button>
              <button className="p-1 rounded-lg hover:bg-white/10"><MoreHorizontal size={13} style={{ color: "var(--text-faint)" }} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button className="w-full py-2.5 rounded-xl font-medium text-[13px] text-[#0A0D14] flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
          <Users2 size={15} /> Invite people
        </button>
      </div>
    </>
  );
}

/* ---------------- settings panel ---------------- */

const SETTINGS_TABS = [
  ["account", "Account", User],
  ["audio", "Audio & Video", SlidersHorizontal],
  ["notifications", "Notifications", BellRing],
  ["accessibility", "Accessibility", Accessibility],
  ["security", "Security", Lock],
];

function SettingsPanel(p) {
  return (
    <>
      <PanelHeader title="Settings" onClose={() => p.setPanel(null)} />
      <div className="flex overflow-x-auto lg:overflow-visible lg:flex-col gap-1 p-2 border-b lg:border-b-0 lg:border-r" style={{ borderColor: "var(--border)" }}>
        {SETTINGS_TABS.map(([id, label, Icon]) => (
          <button key={id} onClick={() => p.setSettingsTab(id)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-medium whitespace-nowrap shrink-0 ${p.settingsTab === id ? "text-[#0A0D14]" : ""}`}
            style={p.settingsTab === id ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))" } : { color: "var(--text-dim)" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {p.settingsTab === "account" && <AccountSettings />}
        {p.settingsTab === "audio" && <AudioVideoSettings {...p} />}
        {p.settingsTab === "notifications" && <NotificationSettings />}
        {p.settingsTab === "accessibility" && <AccessibilitySettings />}
        {p.settingsTab === "security" && <SecuritySettings />}
      </div>
    </>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[13px] font-medium">{label}</p>
        {desc && <p className="text-[11.5px] mt-0.5" style={{ color: "var(--text-faint)" }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Select({ options }) {
  return (
    <select className="text-[12.5px] rounded-xl px-2.5 py-1.5 outline-none border" style={{ background: "var(--surface-solid)", borderColor: "var(--border)", color: "var(--text)" }}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function AccountSettings() {
  return (
    <>
      <div>
        <SectionLabel>Profile</SectionLabel>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-16 w-16 rounded-full flex items-center justify-center font-[Space_Grotesk] font-semibold text-white text-xl" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>YO</div>
          <button className="text-[12.5px] font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1.5" style={{ borderColor: "var(--border)" }}><Upload size={13} /> Change photo</button>
        </div>
        <div className="space-y-3">
          {[["Username", "you"], ["Email", "you@nexus.app"]].map(([label, val]) => (
            <div key={label}>
              <label className="text-[11.5px] font-medium block mb-1" style={{ color: "var(--text-faint)" }}>{label}</label>
              <input defaultValue={val} className="w-full rounded-xl px-3 py-2 text-[13px] outline-none border" style={{ background: "var(--surface-solid)", borderColor: "var(--border)", color: "var(--text)" }} />
            </div>
          ))}
          <div>
            <label className="text-[11.5px] font-medium block mb-1" style={{ color: "var(--text-faint)" }}>Password</label>
            <button className="text-[12.5px] font-medium px-3 py-1.5 rounded-xl border" style={{ borderColor: "var(--border)" }}>Change password</button>
          </div>
        </div>
      </div>
      <div>
        <SectionLabel>Subscription</SectionLabel>
        <div className="flex items-center justify-between rounded-2xl p-3.5 border" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-[13px] font-semibold flex items-center gap-1.5"><Zap size={13} className="text-[color:var(--accent)]" /> Pro plan</p>
            <p className="text-[11.5px]" style={{ color: "var(--text-faint)" }}>Renews Sept 3, 2026</p>
          </div>
          <button className="text-[12px] font-medium px-3 py-1.5 rounded-xl text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>Manage</button>
        </div>
      </div>
      <div>
        <SectionLabel>Connected devices</SectionLabel>
        <div className="space-y-2">
          {[["MacBook Pro · Chrome", "This device", Monitor], ["iPhone 15 Pro · App", "2 hrs ago", Smartphone]].map(([a, b, Icon]) => (
            <div key={a} className="flex items-center gap-2.5 rounded-xl p-2.5 border" style={{ borderColor: "var(--border)" }}>
              <Icon size={16} style={{ color: "var(--text-faint)" }} />
              <div className="flex-1"><p className="text-[12.5px] font-medium">{a}</p><p className="text-[11px]" style={{ color: "var(--text-faint)" }}>{b}</p></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AudioVideoSettings(p) {
  return (
    <>
      <div>
        <SectionLabel>Camera preview</SectionLabel>
        <div className="aspect-video rounded-2xl mb-3 flex items-center justify-center" style={{ background: "linear-gradient(160deg, #171B26, #0F1219)" }}>
          <Camera size={26} style={{ color: "var(--text-faint)" }} />
        </div>
        <Select options={["Camera: MacBook Pro (built-in)", "Camera: Logitech Brio", "Camera: iPhone Continuity"]} />
      </div>
      <div>
        <SectionLabel>Devices</SectionLabel>
        <div className="space-y-1">
          <Row label="Microphone"><Select options={["MacBook Pro Mic", "AirPods Pro", "Blue Yeti"]} /></Row>
          <Row label="Speaker"><Select options={["MacBook Pro Speakers", "AirPods Pro", "External Display"]} /></Row>
        </div>
      </div>
      <div>
        <SectionLabel>Levels</SectionLabel>
        <div className="space-y-4">
          <div><div className="flex justify-between mb-1.5"><span className="text-[12.5px] font-medium">Speaker volume</span><span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{p.speakerLevel}%</span></div><Slider value={p.speakerLevel} onChange={p.setSpeakerLevel} /></div>
          <div><div className="flex justify-between mb-1.5"><span className="text-[12.5px] font-medium">Microphone sensitivity</span><span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{p.micLevel}%</span></div><Slider value={p.micLevel} onChange={p.setMicLevel} /></div>
          <button className="text-[12.5px] font-medium px-3 py-1.5 rounded-xl border" style={{ borderColor: "var(--border)" }}>Run audio test</button>
        </div>
      </div>
      <div>
        <SectionLabel>AI audio</SectionLabel>
        <Row label="Noise suppression" desc="Filters keyboard, traffic, and background hum"><Toggle checked={p.noiseSuppress} onChange={p.setNoiseSuppress} /></Row>
        <Row label="Echo cancellation" desc="Removes speaker feedback loops"><Toggle checked={p.echoCancel} onChange={p.setEchoCancel} /></Row>
        <Row label="AI voice enhancement" desc="Studio-quality voice clarity"><Toggle checked={p.aiVoice} onChange={p.setAiVoice} /></Row>
      </div>
      <div>
        <SectionLabel>Video</SectionLabel>
        <Row label="Blur background" desc="Softens everything behind you"><Toggle checked={p.blurBg} onChange={p.setBlurBg} /></Row>
        <Row label="Virtual backgrounds"><button className="text-[12px] font-medium px-3 py-1.5 rounded-xl border" style={{ borderColor: "var(--border)" }}>Browse</button></Row>
        <Row label="Upload custom background"><button className="p-1.5 rounded-lg border" style={{ borderColor: "var(--border)" }}><Upload size={14} /></button></Row>
        <Row label="HD video" desc="Uses more bandwidth"><Toggle checked={p.hdVideo} onChange={p.setHdVideo} /></Row>
        <Row label="Studio lighting" desc="AI-adjusted exposure and warmth"><Toggle checked={false} onChange={() => {}} /></Row>
        <Row label="Auto framing" desc="Keeps you centered as you move"><Toggle checked={p.autoFraming} onChange={p.setAutoFraming} /></Row>
        <Row label="Low-light enhancement"><Toggle checked={true} onChange={() => {}} /></Row>
        <Row label="Mirror my video"><Toggle checked={p.mirror} onChange={p.setMirror} /></Row>
      </div>
    </>
  );
}

function NotificationSettings() {
  return (
    <div>
      <SectionLabel>Notifications</SectionLabel>
      <Row label="Meeting reminders" desc="10 minutes before scheduled calls"><Toggle checked={true} onChange={() => {}} /></Row>
      <Row label="Sound alerts" desc="Chime on join, leave, and hand raise"><Toggle checked={true} onChange={() => {}} /></Row>
      <Row label="Desktop notifications"><Toggle checked={false} onChange={() => {}} /></Row>
      <Row label="Email notifications" desc="Digest of missed meetings"><Toggle checked={true} onChange={() => {}} /></Row>
    </div>
  );
}

function AccessibilitySettings() {
  const [fontScale, setFontScale] = useState(100);
  return (
    <>
      <div>
        <SectionLabel>Display</SectionLabel>
        <div className="mb-1"><div className="flex justify-between mb-1.5"><span className="text-[12.5px] font-medium">Font scaling</span><span className="text-[11px] font-mono" style={{ color: "var(--text-faint)" }}>{fontScale}%</span></div><Slider value={fontScale} onChange={setFontScale} min={80} max={150} /></div>
        <Row label="High contrast mode"><Toggle checked={false} onChange={() => {}} /></Row>
      </div>
      <div>
        <SectionLabel>Captions & audio cues</SectionLabel>
        <Row label="Live captions by default"><Toggle checked={true} onChange={() => {}} /></Row>
        <Row label="Screen reader support" desc="Announces host actions and reactions"><Toggle checked={true} onChange={() => {}} /></Row>
      </div>
      <div>
        <SectionLabel>Keyboard shortcuts</SectionLabel>
        <div className="space-y-1.5">
          {[["Mute / unmute", "M"], ["Toggle camera", "V"], ["Raise hand", "H"], ["Open chat", "C"]].map(([a, k]) => (
            <div key={a} className="flex items-center justify-between text-[12.5px]"><span style={{ color: "var(--text-dim)" }}>{a}</span><kbd className="font-mono text-[11px] px-2 py-0.5 rounded-lg border" style={{ borderColor: "var(--border)" }}>{k}</kbd></div>
          ))}
        </div>
      </div>
    </>
  );
}

function SecuritySettings() {
  return (
    <>
      <div>
        <SectionLabel>Encryption & access</SectionLabel>
        <Row label="End-to-end encryption" desc="Enabled for all your meetings"><Check size={16} className="text-[color:var(--accent-2)]" /></Row>
        <Row label="Two-factor authentication"><Toggle checked={true} onChange={() => {}} /></Row>
        <Row label="Meeting password" desc="Required for all scheduled meetings"><Toggle checked={true} onChange={() => {}} /></Row>
        <Row label="Waiting room" desc="Host approves each participant"><Toggle checked={true} onChange={() => {}} /></Row>
      </div>
      <div>
        <SectionLabel>Session history</SectionLabel>
        <div className="space-y-2">
          {[["Aug 3, 2026 · 9:41 AM", "San Francisco, CA"], ["Aug 1, 2026 · 2:10 PM", "San Francisco, CA"]].map(([a, b]) => (
            <div key={a} className="flex items-center justify-between text-[12px]" style={{ color: "var(--text-faint)" }}><span>{a}</span><span>{b}</span></div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================================================================
   PLANS SCREEN
   ================================================================ */

function PlansScreen() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="text-center mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-3" style={{ color: "var(--accent-2)" }}>Pricing</p>
        <h1 className="font-[Space_Grotesk] font-semibold text-3xl sm:text-4xl tracking-tight mb-3">Every plan sees clearly.</h1>
        <p className="text-[15px] max-w-lg mx-auto" style={{ color: "var(--text-dim)" }}>Start free, upgrade when your meetings outgrow the room.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`relative rounded-3xl p-6 flex flex-col border ${plan.highlighted ? "lg:-translate-y-2" : ""}`}
            style={{ borderColor: plan.highlighted ? "transparent" : "var(--border)", background: plan.highlighted ? "linear-gradient(160deg, var(--accent), var(--accent-2))" : "var(--surface-solid)" }}>
            {plan.highlighted && <span className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-wider bg-black/20 text-white px-2 py-1 rounded-full">Most popular</span>}
            <plan.icon size={20} className={plan.highlighted ? "text-[#0A0D14]" : ""} style={!plan.highlighted ? { color: "var(--accent)" } : {}} />
            <h3 className={`font-[Space_Grotesk] font-semibold text-lg mt-3 ${plan.highlighted ? "text-[#0A0D14]" : ""}`}>{plan.name}</h3>
            <p className={`text-[12.5px] mb-4 ${plan.highlighted ? "text-[#0A0D14]/70" : ""}`} style={!plan.highlighted ? { color: "var(--text-faint)" } : {}}>{plan.tagline}</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className={`font-[Space_Grotesk] font-semibold text-3xl ${plan.highlighted ? "text-[#0A0D14]" : ""}`}>{plan.price}</span>
              <span className={`text-[12px] ${plan.highlighted ? "text-[#0A0D14]/70" : ""}`} style={!plan.highlighted ? { color: "var(--text-faint)" } : {}}>{plan.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-[12.5px] ${plan.highlighted ? "text-[#0A0D14]/90" : ""}`} style={!plan.highlighted ? { color: "var(--text-dim)" } : {}}>
                  <Check size={14} className="shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 ${plan.highlighted ? "bg-[#0A0D14] text-white" : "text-[#0A0D14]"}`}
              style={!plan.highlighted ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))" } : {}}>
              {plan.cta} <ArrowUpRight size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4" style={{ color: "var(--accent-2)" }}>Included on Pro & above</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[["AI meeting summaries", Sparkles], ["Real-time translation", Cpu], ["Team workspaces & analytics", Gauge]].map(([label, Icon]) => (
            <div key={label} className="rounded-2xl p-4 flex items-center gap-3 border" style={{ borderColor: "var(--border)" }}>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surface)" }}><Icon size={16} style={{ color: "var(--accent)" }} /></div>
              <p className="text-[13px] font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   BETA LABS SCREEN
   ================================================================ */

function BetaScreen() {
  const [enabled, setEnabled] = useState({});
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-3 flex items-center gap-1.5" style={{ color: "var(--accent-2)" }}><Rocket size={12} /> Beta Labs</p>
        <h1 className="font-[Space_Grotesk] font-semibold text-3xl sm:text-4xl tracking-tight mb-3">Early looks, opt-in only.</h1>
        <p className="text-[15px] max-w-xl" style={{ color: "var(--text-dim)" }}>Experimental features we're still tuning. Turn any of them on for your next call — nothing here ships to your team automatically.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {BETA_FEATURES.map((f) => (
          <div key={f.name} className="rounded-2xl p-4 flex items-start gap-3.5 border" style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              <f.icon size={17} className="text-[#0A0D14]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold mb-0.5">{f.name}</p>
              <p className="text-[12px] leading-snug" style={{ color: "var(--text-faint)" }}>{f.desc}</p>
            </div>
            <Toggle checked={!!enabled[f.name]} onChange={(v) => setEnabled((e) => ({ ...e, [f.name]: v }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   RANDOM CHAT — 1-on-1 instant match + auto-starting group (5–10)
   Safety is treated as core, not an afterthought: an age/guidelines
   gate sits in front of both modes, and Report/Block/Skip are
   always one tap away during a live random session.
   ================================================================ */

function RandomScreen() {
  const [accepted, setAccepted] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [rulesChecked, setRulesChecked] = useState(false);
  const [mode, setMode] = useState("one"); // one | group
  const [stamps, setStamps] = useState({});
  const [justStamped, setJustStamped] = useState(null);
  const [pulse, setPulse] = useState(48213);
  const [isPro, setIsPro] = useState(false); // demo toggle simulating a Pro subscription
  const [excluded, setExcluded] = useState([]); // country names temporarily excluded from matching
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((n) => n + Math.floor(Math.random() * 9) - 3), 2200);
    return () => clearInterval(t);
  }, []);

  const addStamp = (person) => {
    setStamps((s) => {
      if (s[person.name]) return s;
      setJustStamped(person);
      setTimeout(() => setJustStamped(null), 2400);
      return { ...s, [person.name]: person };
    });
  };

  if (!accepted) {
    return (
      <div className="max-w-md mx-auto px-5 py-16">
        <div className="rounded-3xl p-6 border" style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}>
          <div className="h-11 w-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
            <ShieldAlert size={20} className="text-[#0A0D14]" />
          </div>
          <h2 className="font-[Space_Grotesk] font-semibold text-xl mb-2">Before you jump in</h2>
          <p className="text-[13px] mb-5" style={{ color: "var(--text-dim)" }}>
            Random Chat connects you with people you don't know. A few ground rules keep it safe for everyone.
          </p>
          <ul className="space-y-2 mb-5 text-[12.5px]" style={{ color: "var(--text-dim)" }}>
            <li className="flex gap-2"><Flag size={14} className="shrink-0 mt-0.5 text-[color:var(--accent-2)]" /> Report or block anyone in one tap — moderators review every report.</li>
            <li className="flex gap-2"><SkipForward size={14} className="shrink-0 mt-0.5 text-[color:var(--accent-2)]" /> Skip to the next match anytime, no explanation needed.</li>
            <li className="flex gap-2"><Lock size={14} className="shrink-0 mt-0.5 text-[color:var(--accent-2)]" /> Nudity, harassment, and minors on the platform are never allowed.</li>
          </ul>
          <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
            <input type="checkbox" checked={ageChecked} onChange={(e) => setAgeChecked(e.target.checked)} className="mt-0.5 accent-[#7C8CFF]" />
            <span className="text-[12.5px]" style={{ color: "var(--text-dim)" }}>I confirm I'm 18 years or older.</span>
          </label>
          <label className="flex items-start gap-2.5 mb-5 cursor-pointer">
            <input type="checkbox" checked={rulesChecked} onChange={(e) => setRulesChecked(e.target.checked)} className="mt-0.5 accent-[#7C8CFF]" />
            <span className="text-[12.5px]" style={{ color: "var(--text-dim)" }}>I agree to the Community Guidelines.</span>
          </label>
          <button
            disabled={!ageChecked || !rulesChecked}
            onClick={() => setAccepted(true)}
            className="w-full py-2.5 rounded-xl font-medium text-[13px] text-[#0A0D14] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
      {/* Global Pulse — a new feature: live ambient sense of scale across the whole network */}
      <div className="flex items-center gap-2 text-[12px] mb-5 font-mono" style={{ color: "var(--text-faint)" }}>
        <span className="relative flex h-2 w-2">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: "var(--accent-2)" }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent-2)" }} />
        </span>
        {pulse.toLocaleString()} people connecting right now across 118 countries
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1 rounded-full p-1 w-fit" style={{ background: "var(--surface-solid)" }}>
          {[["one", "1-on-1", Globe], ["group", "Group (up to 10)", Users2]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setMode(id)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium ${mode === id ? "text-[#0A0D14]" : ""}`}
              style={mode === id ? { background: "linear-gradient(135deg, var(--accent), var(--accent-2))" } : { color: "var(--text-dim)" }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
        <button onClick={() => setPrefsOpen(true)} className="flex items-center gap-1.5 text-[12.5px] font-medium px-3.5 py-1.5 rounded-full border" style={{ borderColor: "var(--border)" }}>
          <Sliders2 size={13} /> Match preferences
          <span className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
            <Crown size={9} /> PRO
          </span>
        </button>
      </div>

      {/* Nexus Passport — a new feature: collect a stamp the first time you connect with someone from each place */}
      <div className="rounded-2xl border p-3.5 mb-6 relative overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[12px] font-semibold flex items-center gap-1.5"><Globe size={13} style={{ color: "var(--accent)" }} /> Nexus Passport</p>
          <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>{Object.keys(stamps).length}/{WORLD.length} stamped</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {WORLD.map((c) => {
            const got = stamps[c.name];
            return (
              <div key={c.name} title={got ? `${c.name} · ${c.flag}` : "Not yet met"} className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-base border transition-all ${got ? "" : "grayscale opacity-30"}`}
                style={{ borderColor: "var(--border)", background: got ? "var(--surface)" : "transparent" }}>
                {c.flag}
              </div>
            );
          })}
        </div>
        {justStamped && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm motion-safe:animate-[fadeOut_2.4s_ease-in-out_forwards]" style={{ background: "var(--surface-solid)" }}>
            <p className="text-[13px] font-medium flex items-center gap-2"><span className="text-xl">{justStamped.flag}</span> New stamp — you connected with {justStamped.name}!</p>
          </div>
        )}
        <style>{`@keyframes fadeOut { 0%{opacity:1;} 75%{opacity:1;} 100%{opacity:0; pointer-events:none;} }`}</style>
      </div>

      {mode === "one" ? <OneOnOneMatch onMatched={addStamp} pool={WORLD.filter((c) => !excluded.includes(c.name))} /> : <GroupMatch onMatched={addStamp} pool={WORLD.filter((c) => !excluded.includes(c.name))} />}

      {prefsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setPrefsOpen(false)}>
          <Glass className="rounded-3xl p-6 w-full max-w-sm shadow-2xl relative" style={{ background: "var(--surface-solid)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-[Space_Grotesk] font-semibold text-lg flex items-center gap-2"><Sliders2 size={17} /> Match preferences</h3>
              <button onClick={() => setPrefsOpen(false)}><X size={16} style={{ color: "var(--text-faint)" }} /></button>
            </div>
            <p className="text-[12.5px] mb-4" style={{ color: "var(--text-dim)" }}>
              Pro members can temporarily exclude specific countries from their match pool for this session. Everyone gets the same controls — there's no default exclusion list.
            </p>

            {!isPro ? (
              <div className="rounded-2xl border p-4 text-center mb-4" style={{ borderColor: "var(--border)" }}>
                <Crown size={20} className="mx-auto mb-2" style={{ color: "var(--accent)" }} />
                <p className="text-[13px] font-medium mb-1">This is a Pro feature</p>
                <p className="text-[12px] mb-3" style={{ color: "var(--text-faint)" }}>Upgrade to choose which countries you're matched with.</p>
                <button onClick={() => setIsPro(true)} className="w-full py-2 rounded-xl font-medium text-[12.5px] text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
                  Upgrade to Pro (demo)
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto pr-1">
                  {WORLD.map((c) => {
                    const isOut = excluded.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        onClick={() => setExcluded((e) => (isOut ? e.filter((n) => n !== c.name) : [...e, c.name]))}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-[12.5px] border transition-colors ${isOut ? "opacity-50" : ""}`}
                        style={{ borderColor: "var(--border)", background: isOut ? "transparent" : "var(--surface)" }}
                      >
                        <span>{c.flag}</span>
                        <span className="flex-1 text-left truncate">{c.name}</span>
                        {isOut ? <Ban size={13} className="text-[#FF5A5F]" /> : <Check size={13} style={{ color: "var(--text-faint)" }} />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] mb-3" style={{ color: "var(--text-faint)" }}>Exclusions reset automatically at the end of each session.</p>
                {excluded.length > 0 && (
                  <button onClick={() => setExcluded([])} className="w-full py-2 rounded-xl font-medium text-[12.5px] border" style={{ borderColor: "var(--border)" }}>Clear exclusions</button>
                )}
              </>
            )}
          </Glass>
        </div>
      )}
    </div>
  );
}

function SafetyFooter() {
  return (
    <div className="flex items-center justify-center gap-4 mt-4 text-[11.5px]" style={{ color: "var(--text-faint)" }}>
      <button className="flex items-center gap-1 hover:text-[color:var(--text)]"><Flag size={12} /> Report</button>
      <span>·</span>
      <button className="flex items-center gap-1 hover:text-[color:var(--text)]"><ShieldAlert size={12} /> Community guidelines</button>
    </div>
  );
}

function OneOnOneMatch({ onMatched, pool = WORLD }) {
  const [phase, setPhase] = useState("idle"); // idle | searching | matched
  const [partner, setPartner] = useState(null);
  const [count, setCount] = useState(0);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [icebreaker, setIcebreaker] = useState(0);
  const timerRef = useRef(null);

  const startSearch = () => {
    setPhase("searching");
    setCount(0);
    timerRef.current = setTimeout(() => {
      const src = pool.length ? pool : WORLD;
      const p = src[Math.floor(Math.random() * src.length)];
      setPartner(p);
      setIcebreaker(Math.floor(Math.random() * ICEBREAKERS.length));
      setPhase("matched");
      onMatched?.(p);
    }, 1800);
  };

  const nextMatch = () => {
    clearTimeout(timerRef.current);
    startSearch();
  };

  const endCall = () => {
    clearTimeout(timerRef.current);
    setPhase("idle");
    setPartner(null);
  };

  useEffect(() => {
    if (phase !== "searching") return;
    const t = setInterval(() => setCount((c) => c + 1), 400);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (phase === "idle") {
    return (
      <div className="rounded-3xl border p-10 flex flex-col items-center text-center" style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}>
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
          <Globe size={26} className="text-[#0A0D14]" />
        </div>
        <h3 className="font-[Space_Grotesk] font-semibold text-xl mb-2">Instant 1-on-1 match</h3>
        <p className="text-[13px] max-w-sm mb-6" style={{ color: "var(--text-dim)" }}>We'll pair you with the next available person, anywhere in the world. Skip anytime.</p>
        <button onClick={startSearch} className="px-6 py-2.5 rounded-xl font-medium text-[13px] text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
          Start matching
        </button>
      </div>
    );
  }

  if (phase === "searching") {
    return (
      <div className="rounded-3xl border p-10 flex flex-col items-center text-center" style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}>
        <Loader2 size={30} className="motion-safe:animate-spin mb-4" style={{ color: "var(--accent)" }} />
        <h3 className="font-[Space_Grotesk] font-semibold text-lg mb-1">Looking for someone…</h3>
        <p className="font-mono text-[12px] mb-6" style={{ color: "var(--text-faint)" }}>{String(Math.floor(count * 0.4 * 10) / 10).padStart(3, "0")}s elapsed</p>
        <button onClick={() => setPhase("idle")} className="px-5 py-2 rounded-xl font-medium text-[12.5px] border" style={{ borderColor: "var(--border)" }}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden aspect-video mb-4" style={{ background: "linear-gradient(160deg, #171B26, #0F1219)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {cam ? (
            <div className="h-24 w-24 rounded-full flex items-center justify-center font-[Space_Grotesk] font-semibold text-white text-3xl" style={{ background: `linear-gradient(135deg, ${partner.color}, ${partner.color}99)` }}>
              {partner.name[0]}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2" style={{ color: "var(--text-faint)" }}>
              <VideoOff size={22} />
              <span className="text-[12px]">Partner's camera is on — yours is off</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
          <span className="text-lg">{partner.flag}</span>
          <span className="text-white text-[13px] font-medium">{partner.name}</span>
        </div>
        {/* self preview thumbnail, reflects your own mic/cam state */}
        <div className="absolute top-3 right-3 h-14 w-20 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {cam ? <div className="h-full w-full" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }} /> : <VideoOff size={14} className="text-white/70" />}
          {!mic && <MicOff size={11} className="absolute bottom-1 right-1 text-white/90" />}
        </div>

        {/* Icebreaker Card — a new feature: AI-suggested conversation starter, shuffle for another */}
        <div className="absolute bottom-3 right-3 max-w-[62%] sm:max-w-[48%]">
          <div className="bg-black/45 backdrop-blur-md rounded-xl px-3 py-2 flex items-start gap-2">
            <Sparkles size={13} className="mt-0.5 shrink-0 text-[color:var(--accent-2)]" />
            <p className="text-white text-[12px] leading-snug flex-1">{ICEBREAKERS[icebreaker]}</p>
            <button onClick={() => setIcebreaker((i) => (i + 1) % ICEBREAKERS.length)} className="shrink-0 p-1 rounded-md hover:bg-white/10">
              <RefreshCw size={12} className="text-white/70" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <IconBtn icon={mic ? Mic : MicOff} active={mic} label={mic ? "Mute" : "Unmute"} onClick={() => setMic((m) => !m)} />
        <IconBtn icon={cam ? Video : VideoOff} active={cam} label={cam ? "Stop video" : "Start video"} onClick={() => setCam((c) => !c)} />
        <IconBtn icon={SwitchCamera} label="Flip camera" onClick={() => {}} />
        <IconBtn icon={Flag} label="Report" onClick={() => {}} />
        <IconBtn icon={ShieldAlert} label="Block" onClick={() => {}} />
        <IconBtn icon={SkipForward} label="Next" active onClick={nextMatch} />
        <IconBtn icon={PhoneOff} danger label="End" onClick={endCall} />
      </div>
      <SafetyFooter />
    </div>
  );
}

function GroupMatch({ onMatched, pool = WORLD }) {
  const [phase, setPhase] = useState("idle"); // idle | filling | live
  const [participants, setParticipants] = useState([]);
  const [target, setTarget] = useState(10);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  const start = () => {
    const t = 5 + Math.floor(Math.random() * 6); // random target 5–10
    setTarget(t);
    setParticipants([]);
    setPhase("filling");
  };

  useEffect(() => {
    if (phase !== "filling") return;
    if (participants.length >= target) return;
    const delay = participants.length < 5 ? 700 : 1100;
    const t = setTimeout(() => {
      const src = pool.length ? pool : WORLD;
      const person = src[participants.length % src.length];
      setParticipants((p) => {
        const next = [...p, { ...person, id: p.length + 1, initials: person.name.slice(0, 2).toUpperCase(), speaking: p.length === 0 }];
        return next;
      });
      onMatched?.(person);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, participants, target]);

  useEffect(() => {
    if (phase === "filling" && participants.length >= 5) {
      setPhase("live");
    }
  }, [participants, phase]);

  if (phase === "idle") {
    return (
      <div className="rounded-3xl border p-10 flex flex-col items-center text-center" style={{ borderColor: "var(--border)", background: "var(--surface-solid)" }}>
        <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
          <Users2 size={26} className="text-[#0A0D14]" />
        </div>
        <h3 className="font-[Space_Grotesk] font-semibold text-xl mb-2">Random group call</h3>
        <p className="text-[13px] max-w-sm mb-6" style={{ color: "var(--text-dim)" }}>
          Fits up to 10 people from anywhere. The call starts automatically as soon as 5 have joined — you don't need to wait for a full room.
        </p>
        <button onClick={start} className="px-6 py-2.5 rounded-xl font-medium text-[13px] text-[#0A0D14]" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
          Join a group
        </button>
      </div>
    );
  }

  const full = participants.length >= target;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {phase === "filling" && <Loader2 size={15} className="motion-safe:animate-spin" style={{ color: "var(--accent)" }} />}
          <p className="text-[13px] font-medium">
            {phase === "filling" && !full && `Waiting for more people… ${participants.length}/${target} joined`}
            {full && "Room full"}
            {phase === "live" && !full && `Live · ${participants.length}/${target} joined`}
          </p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="flex items-center gap-1.5 text-[12.5px] font-medium px-3 py-1.5 rounded-xl" style={{ background: "var(--surface-solid)", color: "var(--accent)" }}>
          <UserPlus size={14} /> Invite
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mb-4">
        {participants.map((person) => (
          <Tile key={person.id} person={{ ...person, name: `${person.flag} ${person.name}` }} />
        ))}
        {phase === "filling" && Array.from({ length: Math.max(0, 5 - participants.length) }).map((_, i) => (
          <div key={`ph-${i}`} className="aspect-[4/3] rounded-2xl border border-dashed flex items-center justify-center motion-safe:animate-pulse" style={{ borderColor: "var(--border)" }}>
            <Loader2 size={16} className="motion-safe:animate-spin" style={{ color: "var(--text-faint)" }} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <IconBtn icon={mic ? Mic : MicOff} active={mic} label={mic ? "Mute" : "Unmute"} onClick={() => setMic((m) => !m)} />
        <IconBtn icon={cam ? Video : VideoOff} active={cam} label={cam ? "Stop video" : "Start video"} onClick={() => setCam((c) => !c)} />
        <IconBtn icon={SwitchCamera} label="Flip camera" onClick={() => {}} />
        <IconBtn icon={Flag} label="Report" onClick={() => {}} />
        <IconBtn icon={ShieldAlert} label="Block" onClick={() => {}} />
        <IconBtn icon={PhoneOff} danger label="Leave" onClick={() => setPhase("idle")} />
      </div>
      <SafetyFooter />

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setInviteOpen(false)}>
          <Glass className="rounded-3xl p-6 w-full max-w-sm shadow-2xl" style={{ background: "var(--surface-solid)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[Space_Grotesk] font-semibold text-lg">Invite to this call</h3>
              <button onClick={() => setInviteOpen(false)}><X size={16} style={{ color: "var(--text-faint)" }} /></button>
            </div>
            <p className="text-[12.5px] mb-3" style={{ color: "var(--text-dim)" }}>Anyone with this link can join this group room while a seat is open.</p>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4" style={{ background: "var(--surface)" }}>
              <Link2 size={14} style={{ color: "var(--text-faint)" }} />
              <span className="text-[12px] font-mono flex-1 truncate" style={{ color: "var(--text-dim)" }}>nexus.app/join/g-8f21ac</span>
            </div>
            <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="w-full py-2.5 rounded-xl font-medium text-[13px] text-[#0A0D14] flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}>
              <Copy size={14} /> {copied ? "Link copied" : "Copy invite link"}
            </button>
          </Glass>
        </div>
      )}
    </div>
  );
}
