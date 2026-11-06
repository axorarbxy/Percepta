"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Monitor,
  RotateCcw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Type,
} from "lucide-react";

const initialChannels = [
  { label: "Audio", value: 62, icon: AudioLines },
  { label: "Haptic", value: 24, icon: Smartphone },
  { label: "Text", value: 14, icon: Type },
];

const profiles = [
  { name: "Everyday", description: "A balanced mix for the rhythm of daily life.", tag: "Balanced" },
  { name: "First Responder", description: "Prioritize urgent cues and fast recognition.", tag: "High alert" },
  { name: "Focus Mode", description: "Keep interruptions quiet while you concentrate.", tag: "Minimal" },
];

function ToggleRow({
  title,
  helper,
  enabled,
  onToggle,
}: {
  title: string;
  helper: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="policy-toggle-row">
      <div className="policy-control-copy">
        <span className="policy-control-title">{title}</span>
        <span className="policy-control-helper">{helper}</span>
      </div>
      <motion.button
        className={`policy-toggle${enabled ? " is-on" : ""}`}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={onToggle}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 650, damping: 34, duration: 0.15 }}
      >
        <motion.span
          className="policy-toggle__thumb"
          layout
          transition={{ type: "spring", stiffness: 650, damping: 34, duration: 0.15 }}
        />
      </motion.button>
    </div>
  );
}

export default function PolicyPage() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [textEnabled, setTextEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(62);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [activeProfile, setActiveProfile] = useState("Everyday");
  const [channels, setChannels] = useState(initialChannels);
  const [cueCount, setCueCount] = useState(142);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  function resetPolicy() {
    setAudioEnabled(true);
    setHapticEnabled(true);
    setTextEnabled(true);
    setSensitivity(50);
    setActiveProfile("Everyday");
    setChannels(initialChannels.map((channel) => ({ ...channel, value: 0 })));
    setCueCount(0);
    setConfirmReset(false);
    setResetDone(true);
  }

  return (
    <div className="history-app policy-app">
      <aside className="history-sidebar" aria-label="Dashboard navigation">
        <a className="history-brand" href="/app/history"><span className="history-brand__mark">P</span><span>PERCEPTA</span></a>
        <p className="history-nav-label">Workspace</p>
        <nav className="history-nav">
          <a className="history-nav__link" href="/app/overview"><LayoutDashboard /><span>Overview</span></a>
          <a className="history-nav__link" href="/app/history"><Activity /><span>Awareness History</span></a>
          <a className="history-nav__link history-nav__link--active" href="/app/policy" aria-current="page"><SlidersHorizontal /><span>Perception Policy</span></a>
          <a className="history-nav__link" href="/app/devices"><Monitor /><span>Devices</span></a>
          <a className="history-nav__link" href="/app/settings"><Settings /><span>Settings</span></a>
        </nav>
        <div className="history-sidebar__bottom">
          <div className="history-user"><div className="history-avatar" aria-hidden="true">JD</div><div className="history-user__info"><strong>Jamie Davis</strong><span>jamie@email.com</span></div><ChevronDown size={16} aria-hidden="true" /></div>
          <div className="history-plan"><Sparkles size={14} /><span>Percepta Pro</span><span className="history-plan__dot" /></div>
        </div>
      </aside>

      <nav className="history-mobile-nav" aria-label="Mobile dashboard navigation">
        <a href="/app/overview"><LayoutDashboard /><span>Overview</span></a>
        <a href="/app/history"><Activity /><span>History</span></a>
        <a className="is-active" href="/app/policy" aria-current="page"><SlidersHorizontal /><span>Policy</span></a>
        <a href="/app/settings"><Settings /><span>Settings</span></a>
      </nav>

      <main className="history-main">
        <header className="history-topbar">
          <div className="history-heading">
            <div className="history-breadcrumb"><span>Workspace</span><ChevronRight size={14} /><span>Personalization</span></div>
          </div>
          <div className="policy-topbar-badge"><span /><span>Agent learning active</span></div>
        </header>

        <div className="policy-content">
          <header className="policy-intro">
            <span className="policy-eyebrow"><Sparkles size={14} /> Personalize your experience</span>
            <h2>Your Perception Policy</h2>
            <p>Percepta learns how you best absorb the world. Adjust the boundaries here.</p>
          </header>

          <div className="policy-columns">
            <section className="policy-learned-card" aria-labelledby="learned-title">
              <div className="policy-card-heading policy-card-heading--light">
                <span className="policy-card-icon policy-card-icon--light"><Activity size={17} /></span>
                <div><h3 id="learned-title">Learned Preferences</h3><p>How your agent delivers helpful cues</p></div>
                <span className="policy-learned-live"><i /> LEARNING</span>
              </div>
              <div className="policy-learned-total"><strong>{cueCount}</strong><span>recent cues analyzed</span></div>
              <div className="policy-bars policy-bars--learned">
                {channels.map(({ label, value, icon: Icon }, index) => (
                  <div className="policy-bar policy-bar--learned" key={label}>
                    <div className="policy-bar__meta"><span><Icon size={15} />{label}</span><b>{value}%</b></div>
                    <div className="policy-bar__track"><motion.i initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }} /></div>
                  </div>
                ))}
              </div>
              <p className="policy-learned-note">{cueCount ? `Based on your last ${cueCount} cues. Updates hourly.` : "Learning starts with your next cue. Updates hourly."}</p>
              <div className="policy-learned-foot"><ShieldCheck size={15} /><span>Your preferences stay private to you</span></div>
            </section>

            <section className="policy-overrides-card" aria-labelledby="overrides-title">
              <div className="policy-card-heading">
                <span className="policy-card-icon"><SlidersHorizontal size={17} /></span>
                <div><h3 id="overrides-title">Manual Overrides</h3><p>Set the boundaries your agent follows</p></div>
              </div>
              <div className="policy-control-list">
                <ToggleRow title="Enable audio cues" helper="Spoken prompts and ambient sound" enabled={audioEnabled} onToggle={() => setAudioEnabled(!audioEnabled)} />
                <ToggleRow title="Enable haptic cues" helper="Subtle taps through your devices" enabled={hapticEnabled} onToggle={() => setHapticEnabled(!hapticEnabled)} />
                <ToggleRow title="Enable glanceable text" helper="Short, readable visual notifications" enabled={textEnabled} onToggle={() => setTextEnabled(!textEnabled)} />
                <div className="policy-control-row policy-sensitivity-row">
                  <div className="policy-control-copy"><label className="policy-control-title" htmlFor="sensitivity-range">Alert sensitivity</label><span className="policy-control-helper">Choose how readily cues come through</span></div>
                  <div className="policy-range-wrap"><input id="sensitivity-range" type="range" min="0" max="100" value={sensitivity} onChange={(event) => setSensitivity(Number(event.target.value))} style={{ "--range-progress": `${sensitivity}%` } as CSSProperties} /><div className="policy-range-labels"><span>Low</span><span>High</span></div></div>
                </div>
                <div className="policy-control-row policy-quiet-row">
                  <div className="policy-control-copy"><label className="policy-control-title" htmlFor="quiet-start">Quiet hours</label><span className="policy-control-helper">Pause non-urgent cues overnight</span></div>
                  <div className="policy-time-range"><Clock3 size={15} /><input id="quiet-start" type="time" aria-label="Quiet hours start" value={quietStart} onChange={(event) => setQuietStart(event.target.value)} /><span>to</span><input type="time" aria-label="Quiet hours end" value={quietEnd} onChange={(event) => setQuietEnd(event.target.value)} /></div>
                </div>
              </div>
              <div className="policy-overrides-foot"><span>Changes apply to your connected devices.</span><span className="policy-saved"><Check size={13} /> Saved automatically</span></div>
            </section>
          </div>

          <section className="policy-profiles-section" aria-labelledby="profiles-title">
            <div className="policy-section-heading"><div><span className="policy-eyebrow">Made for different moments</span><h3 id="profiles-title">Context Profiles</h3></div><span className="policy-section-caption">Choose the profile that fits right now</span></div>
            <div className="policy-profile-grid">
              {profiles.map((profile, index) => {
                const active = activeProfile === profile.name;
                return <motion.article className={`policy-profile-card${active ? " is-active" : ""}`} key={profile.name} onClick={() => { setActiveProfile(profile.name); setResetDone(false); }} animate={{ borderColor: active ? "#1b3a8c" : "#e9edf5", boxShadow: active ? "0 8px 22px rgba(27,58,140,.10)" : "0 4px 16px rgba(27,58,140,.035)" }} transition={{ duration: 0.2 }}>
                  <div className={`policy-profile-art policy-profile-art--${index + 1}`}><span /><span /><span /></div>
                  <div className="policy-profile-card__body"><div className="policy-profile-card__top"><span className="policy-profile-tag">{profile.tag}</span>{active && <motion.span className="policy-profile-check" initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 19 }}><Check size={13} /></motion.span>}</div><h4>{profile.name}</h4><p>{profile.description}</p><button type="button" className={`policy-profile-button${active ? " is-active" : ""}`} onClick={(event) => { event.stopPropagation(); setActiveProfile(profile.name); setResetDone(false); }}>{active ? "Active profile" : "Set active"}{!active && <ChevronRight size={14} />}</button></div>
                </motion.article>;
              })}
            </div>
          </section>

          <section className="policy-reset-zone" aria-labelledby="reset-title">
            <div className="policy-reset-icon"><RotateCcw size={17} /></div>
            <div className="policy-reset-copy"><h3 id="reset-title">Reset learned policy</h3><p>This clears your agent’s learned preferences. It will start fresh and adapt again as you use Percepta.</p>{resetDone && <span className="policy-reset-success"><Check size={14} /> Learned policy reset. Your agent will learn from future cues.</span>}</div>
            {confirmReset ? <div className="policy-reset-actions"><button className="policy-reset-cancel" type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="policy-reset-button" type="button" onClick={resetPolicy}>Confirm reset</button></div> : <button className="policy-reset-button" type="button" onClick={() => { setConfirmReset(true); setResetDone(false); }}>Reset policy</button>}
          </section>
          <footer className="policy-page-footer"><span>Made for more mindful moments</span><span><ShieldCheck size={14} /> Your policy is always yours</span></footer>
        </div>
      </main>
    </div>
  );
}
