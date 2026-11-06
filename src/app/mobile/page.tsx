"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AudioLines,
  BatteryFull,
  Bluetooth,
  Check,
  ChevronRight,
  Headphones,
  Mic,
  MoreHorizontal,
  Plus,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wifi,
  X,
} from "lucide-react";

type Screen = "LIVE" | "ASK" | "POLICY" | "DEVICES";
type ChatMessage = { id: number; from: "you" | "percepta"; text: string };
type Cue = { title: string; detail: string; channel: string; accent: "blue" | "red" };

const tabs: Screen[] = ["LIVE", "ASK", "POLICY", "DEVICES"];
const mockCues: Cue[] = [
  { title: "Crosswalk ahead", detail: "Curb begins in about 4 meters.", channel: "Audio · just now", accent: "blue" },
  { title: "Cyclist approaching", detail: "Moving from your right, keep left.", channel: "Haptic + audio · 1m", accent: "red" },
  { title: "Coffee shop nearby", detail: "Bluebird Café is open on your left.", channel: "Audio · 3m", accent: "blue" },
  { title: "Walk signal is on", detail: "You have time to cross safely.", channel: "Haptic · 4m", accent: "red" },
  { title: "Step up ahead", detail: "One low step at the entrance.", channel: "Audio · 6m", accent: "blue" },
];

const initialMessages: ChatMessage[] = [
  { id: 1, from: "you", text: "What's in front of me?" },
  { id: 2, from: "percepta", text: "A crosswalk, 4m ahead. A cyclist approaching from your right." },
];

function LiveScreen({ onAsk }: { onAsk: () => void }) {
  const [cueOffset, setCueOffset] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setCueOffset((offset) => (offset + 1) % mockCues.length), 3000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleCues = Array.from({ length: 3 }, (_, index) => mockCues[(cueOffset + index) % mockCues.length]);

  return (
    <div className="mobile-screen-view mobile-live-view">
      <div className="mobile-live-status"><span className="mobile-pulse-dot" /><span>Percepta active</span><span className="mobile-live-status__right"><Activity size={13} /> Live</span></div>
      <div className="mobile-scene" role="img" aria-label="Abstract street camera preview showing a crosswalk and an approaching cyclist">
        <span className="mobile-scene__camera">CAMERA <i /> FRONT</span>
        <div className="mobile-scene__sun" />
        <div className="mobile-scene__skyline"><i /><i /><i /><i /><i /></div>
        <div className="mobile-scene__street-sign"><span /><i /></div>
        <div className="mobile-scene__road" />
        <div className="mobile-scene__crosswalk"><i /><i /><i /><i /><i /></div>
        <div className="mobile-scene__person"><i /><b /><span /><em /></div>
        <div className="mobile-scene__cyclist"><i /><b /><span /><em /><small /><small /></div>
        <div className="mobile-scene__scan"><span>Crosswalk ahead</span><i /></div>
        <button className="mobile-mic-fab" type="button" aria-label="Ask Percepta" onClick={onAsk}><Mic size={19} /></button>
      </div>
      <div className="mobile-cue-heading"><div><Sparkles size={14} /><span>Recent cues</span></div><button type="button" aria-label="More cue options"><MoreHorizontal size={18} /></button></div>
      <div className="mobile-cue-list">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleCues.map((cue, index) => (
            <motion.article className={`mobile-halo-toast mobile-halo-toast--${cue.accent}`} key={cue.title} initial={{ opacity: 0, y: 15, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }} transition={{ duration: .25, delay: index * .035 }}>
              <span className="mobile-halo-toast__accent" />
              <div><h3>{cue.title}</h3><p>{cue.detail}</p><span className="mobile-halo-toast__meta">{cue.channel}</span></div>
              <ChevronRight size={15} />
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AskScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(3);
  const replyTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, waiting]);

  function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || waiting) return;
    setMessages((current) => [...current, { id: nextId.current++, from: "you", text }]);
    setDraft("");
    setWaiting(true);
    replyTimer.current = window.setTimeout(() => {
      const reply = text.toLowerCase().includes("weather")
        ? "It's bright and mild outside, around 22° C. There's a light breeze from the west."
        : "I can help with that. There’s a clear path ahead, and I’ll let you know if anything changes.";
      setMessages((current) => [...current, { id: nextId.current++, from: "percepta", text: reply }]);
      setWaiting(false);
    }, 1000);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="mobile-screen-view mobile-ask-view">
      <div className="mobile-screen-heading"><span className="mobile-screen-heading__icon"><Sparkles size={16} /></span><div><h2>Ask Percepta</h2><p>A little more context, on demand</p></div><button type="button" aria-label="More options"><MoreHorizontal size={19} /></button></div>
      <div className="mobile-chat-thread" ref={scrollRef}>
        <div className="mobile-chat-date">TODAY · 9:42 AM</div>
        <AnimatePresence initial={false}>
          {messages.map((message) => <motion.div className={`mobile-chat-row mobile-chat-row--${message.from}`} key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>
            {message.from === "percepta" && <span className="mobile-chat-avatar"><Sparkles size={12} /></span>}
            <p>{message.text}</p>
          </motion.div>)}
        </AnimatePresence>
        {waiting && <div className="mobile-chat-row mobile-chat-row--percepta"><span className="mobile-chat-avatar"><Sparkles size={12} /></span><div className="mobile-typing"><i /><i /><i /></div></div>}
      </div>
      <div className="mobile-ask-suggestions"><span>Try asking</span><button type="button" onClick={() => setDraft("What is around me?")}>What is around me?</button><button type="button" onClick={() => setDraft("How's the weather?")}>Weather</button></div>
      <form className="mobile-chat-composer" onSubmit={sendMessage}>
        <button type="button" className={`mobile-chat-mic${listening ? " is-listening" : ""}`} aria-label={listening ? "Stop listening" : "Start voice input"} onClick={() => setListening(!listening)}><Mic size={17} /></button>
        <input aria-label="Ask Percepta a question" placeholder={listening ? "Listening…" : "Ask me anything…"} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} />
        <button type="submit" className="mobile-chat-send" aria-label="Send message" disabled={!draft.trim() || waiting}><Send size={16} /></button>
      </form>
    </div>
  );
}

function PolicyScreen() {
  const [toggles, setToggles] = useState([true, true, true]);
  const preferences = [{ label: "Audio", value: 62, icon: AudioLines }, { label: "Haptic", value: 24, icon: Smartphone }, { label: "Text", value: 14, icon: Sparkles }];
  const settings = [
    { title: "Audio cues", helper: "Voice and ambient sound" },
    { title: "Haptic cues", helper: "Subtle taps on your wrist" },
    { title: "Glanceable text", helper: "Short visual notifications" },
  ];

  return (
    <div className="mobile-screen-view mobile-policy-view">
      <div className="mobile-screen-heading"><span className="mobile-screen-heading__icon"><ShieldCheck size={16} /></span><div><h2>Your policy</h2><p>Learning what works for you</p></div><button type="button" aria-label="Policy options"><MoreHorizontal size={19} /></button></div>
      <section className="mobile-policy-card"><div className="mobile-policy-card__top"><div><span className="mobile-mini-label">LEARNED PREFERENCES</span><strong>Your sensory mix</strong></div><span className="mobile-learn-pill"><i />LEARNING</span></div>
        <div className="mobile-policy-bars">{preferences.map(({ label, value, icon: Icon }, index) => <div className="mobile-policy-bar" key={label}><div><span><Icon size={14} />{label}</span><b>{value}%</b></div><span className="mobile-policy-track"><motion.i initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: .75, delay: index * .1 }} /></span></div>)}</div>
        <p>Based on your last 142 cues</p>
      </section>
      <div className="mobile-policy-settings-heading"><span>Manual overrides</span><button type="button">Edit</button></div>
      <section className="mobile-policy-settings">{settings.map((setting, index) => <div className="mobile-policy-setting" key={setting.title}><div><strong>{setting.title}</strong><span>{setting.helper}</span></div><button type="button" role="switch" aria-checked={toggles[index]} aria-label={setting.title} className={`mobile-policy-switch${toggles[index] ? " is-on" : ""}`} onClick={() => setToggles((current) => current.map((value, toggleIndex) => toggleIndex === index ? !value : value))}><i /></button></div>)}</section>
      <div className="mobile-policy-note"><Sparkles size={15} /><span>Your agent learns and adapts as you go.</span></div>
    </div>
  );
}

function DevicesScreen() {
  const [showPairing, setShowPairing] = useState(false);
  const [paired, setPaired] = useState(false);
  return (
    <div className="mobile-screen-view mobile-devices-view">
      <div className="mobile-screen-heading"><span className="mobile-screen-heading__icon"><Bluetooth size={16} /></span><div><h2>Your devices</h2><p>Connected to your Percepta profile</p></div><button type="button" aria-label="Device options"><MoreHorizontal size={19} /></button></div>
      <div className="mobile-devices-summary"><span className="mobile-devices-summary__icon"><Bluetooth size={15} /></span><div><strong>{paired ? 3 : 2} devices connected</strong><span>Everything is in sync</span></div><i /></div>
      <p className="mobile-device-section-title">PAIRED DEVICES</p>
      <div className="mobile-device-list">
        <article className="mobile-device-card"><span className="mobile-device-icon"><Headphones size={20} /></span><div><strong>AirPods Pro</strong><span><AudioLines size={12} /> Audio channel</span></div><span className="mobile-device-connected"><i />Connected</span></article>
        <article className="mobile-device-card"><span className="mobile-device-icon mobile-device-icon--watch"><Smartphone size={20} /></span><div><strong>Apple Watch</strong><span><Activity size={12} /> Haptic channel</span></div><span className="mobile-device-connected"><i />Connected</span></article>
        {paired && <article className="mobile-device-card"><span className="mobile-device-icon mobile-device-icon--new"><Headphones size={20} /></span><div><strong>Beats Fit Pro</strong><span><AudioLines size={12} /> Audio channel</span></div><span className="mobile-device-connected"><i />Connected</span></article>}
      </div>
      {showPairing ? <section className="mobile-pairing-card"><button type="button" className="mobile-pairing-close" aria-label="Close pairing" onClick={() => setShowPairing(false)}><X size={15} /></button><span className="mobile-pairing-icon"><Bluetooth size={17} /></span><strong>{paired ? "All set" : "Nearby device found"}</strong><p>{paired ? "Beats Fit Pro is ready for cues." : "Beats Fit Pro · Available to pair"}</p>{!paired && <button className="mobile-pairing-confirm" type="button" onClick={() => setPaired(true)}>Pair device</button>}</section> : <button className="mobile-pair-button" type="button" onClick={() => setShowPairing(true)}><Plus size={16} />Pair new device</button>}
      <div className="mobile-device-tip"><ShieldCheck size={16} /><span>Your device data is encrypted and only used to deliver your cues.</span></div>
    </div>
  );
}

export default function MobilePreviewPage() {
  const [activeScreen, setActiveScreen] = useState<Screen>("LIVE");
  const screenComponents = { LIVE: <LiveScreen onAsk={() => setActiveScreen("ASK")} />, ASK: <AskScreen />, POLICY: <PolicyScreen />, DEVICES: <DevicesScreen /> };

  return (
    <section className="mobile-preview-page">
      <div className="mobile-preview-copy"><span className="mobile-preview-kicker"><span /> THE PERCEPTA APP</span><h1>Awareness that moves with you.</h1><p>See how Percepta turns the world around you into useful, timely cues. Explore the experience on your phone.</p><div className="mobile-preview-proof"><span><Check size={14} /> Designed for everyday devices</span><span><Check size={14} /> Your cues, your control</span></div></div>
      <div className="mobile-preview-demo">
        <div className="mobile-tab-switcher" role="tablist" aria-label="Choose a mobile app screen">{tabs.map((tab) => <button key={tab} id={`mobile-tab-${tab.toLowerCase()}`} type="button" role="tab" aria-selected={activeScreen === tab} aria-controls="mobile-phone-screen" className={activeScreen === tab ? "is-active" : ""} onClick={() => setActiveScreen(tab)}>{tab}</button>)}</div>
        <div className="mobile-phone-wrap">
          <div className="mobile-phone" aria-label="Percepta mobile app preview">
            <span className="mobile-phone__side-button mobile-phone__side-button--left" /><span className="mobile-phone__side-button mobile-phone__side-button--right" />
            <div className="mobile-phone__screen" id="mobile-phone-screen" role="tabpanel" aria-labelledby={`mobile-tab-${activeScreen.toLowerCase()}`}>
              <div className="mobile-phone__statusbar"><span>9:41</span><span className="mobile-phone__notch" /><span className="mobile-phone__status-icons"><Wifi size={13} /><span className="mobile-cellular"><i /><i /><i /></span><BatteryFull size={17} /></span></div>
              <AnimatePresence mode="wait" initial={false}><motion.div key={activeScreen} className="mobile-screen-stage" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .2 }}>{screenComponents[activeScreen]}</motion.div></AnimatePresence>
              <div className="mobile-phone__home-indicator"><span /></div>
            </div>
          </div>
          <div className="mobile-phone-caption"><span><span className="mobile-caption-dot" />Interactive preview</span><span>Screen {tabs.indexOf(activeScreen) + 1} of 4</span></div>
        </div>
      </div>
    </section>
  );
}
