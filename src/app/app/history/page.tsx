"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AudioLines,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  Headphones,
  LayoutDashboard,
  Mic,
  Monitor,
  Settings,
  Shield,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

type Channel = "Audio" | "Visual" | "Haptic";
type Cue = {
  id: number;
  hoursAgo: number;
  time: string;
  cue: string;
  channel: Channel;
  responded: boolean;
  description: string;
  details: string;
  context: string;
};

const cues: Cue[] = [
  { id: 1, hoursAgo: 2, time: "9:42 AM", cue: "Priority alert", channel: "Audio", responded: true, description: "Your meeting starts in 10 minutes.", details: "A priority reminder was delivered through your preferred audio channel.", context: "Calendar · Focus mode on" },
  { id: 2, hoursAgo: 5, time: "6:18 AM", cue: "Ambient insight", channel: "Visual", responded: true, description: "A quieter route is available nearby.", details: "A lower-traffic walking route was detected and surfaced as a subtle visual cue.", context: "Location · Walking" },
  { id: 3, hoursAgo: 11, time: "12:06 AM", cue: "Message summary", channel: "Audio", responded: false, description: "You have two messages from Maya.", details: "A short message summary was offered. No interaction was detected before it expired.", context: "Messages · Do not disturb" },
  { id: 4, hoursAgo: 24, time: "11:24 AM", cue: "Focus reminder", channel: "Haptic", responded: true, description: "Time for a short screen break.", details: "A gentle haptic nudge was sent after a sustained focus session.", context: "Wellbeing · Focus session" },
  { id: 5, hoursAgo: 31, time: "4:51 AM", cue: "Priority alert", channel: "Audio", responded: false, description: "A delivery is arriving this afternoon.", details: "A delivery notification was played once. The agent noted no response and avoided repeating it.", context: "Home · Quiet hours" },
  { id: 6, hoursAgo: 48, time: "11:09 AM", cue: "Ambient insight", channel: "Audio", responded: true, description: "The sun will set in about an hour.", details: "A timely outdoor-light reminder was delivered while you were active.", context: "Environment · Outdoors" },
  { id: 7, hoursAgo: 73, time: "10:32 AM", cue: "Message summary", channel: "Visual", responded: true, description: "Your afternoon is clear after 3 PM.", details: "The day’s calendar was summarized in a glanceable visual notification.", context: "Calendar · Planning" },
  { id: 8, hoursAgo: 105, time: "2:16 AM", cue: "Focus reminder", channel: "Haptic", responded: false, description: "Your daily reflection is ready.", details: "A low-priority reflection reminder was dismissed without interaction.", context: "Wellbeing · Evening" },
  { id: 9, hoursAgo: 144, time: "11:37 AM", cue: "Priority alert", channel: "Audio", responded: true, description: "Your ride is waiting at the entrance.", details: "A time-sensitive travel cue was delivered through audio and acknowledged.", context: "Travel · Outside" },
  { id: 10, hoursAgo: 192, time: "11:01 AM", cue: "Ambient insight", channel: "Visual", responded: true, description: "A familiar contact is nearby.", details: "A discreet presence notification was shown on your connected display.", context: "Nearby · Familiar places" },
  { id: 11, hoursAgo: 240, time: "11:01 AM", cue: "Message summary", channel: "Audio", responded: true, description: "A message from Jordan can wait.", details: "A non-urgent message was summarized during an active commute.", context: "Messages · Commute" },
  { id: 12, hoursAgo: 312, time: "11:01 AM", cue: "Priority alert", channel: "Audio", responded: true, description: "Your weekly check-in is ready.", details: "A weekly recap was delivered and opened.", context: "Weekly recap · Home" },
];

const rangeOptions = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];
const channelMeta: Record<Channel, { icon: typeof AudioLines; color: string }> = {
  Audio: { icon: AudioLines, color: "audio" },
  Visual: { icon: Eye, color: "visual" },
  Haptic: { icon: Smartphone, color: "haptic" },
};

function getChartData(days: number, visibleCues: Cue[]) {
  const bucketCount = Math.min(days, 14);
  return Array.from({ length: bucketCount }, (_, index) => {
    const startOffset = Math.floor(((bucketCount - index - 1) * days) / bucketCount);
    const endOffset = Math.floor(((bucketCount - index) * days) / bucketCount);
    const dayCues = visibleCues.filter((cue) => {
      const cueDay = Math.floor(cue.hoursAgo / 24);
      return cueDay >= startOffset && cueDay < endOffset;
    });
    const chartDate = new Date();
    chartDate.setDate(chartDate.getDate() - startOffset);
    return {
      label: chartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cues: dayCues.length ? dayCues.length + (startOffset % 3 === 0 ? 2 : 0) : startOffset % 4 === 1 ? 1 : 0,
      warnings: dayCues.some((cue) => !cue.responded) ? 1 : 0,
    };
  });
}

export default function HistoryPage() {
  const [range, setRange] = useState(7);
  const [selectedCue, setSelectedCue] = useState<Cue | null>(null);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const filteredCues = useMemo(() => cues.filter((cue) => cue.hoursAgo < range * 24), [range]);
  const chartData = useMemo(() => getChartData(range, filteredCues), [range, filteredCues]);
  const responseRate = filteredCues.length
    ? Math.round((filteredCues.filter((cue) => cue.responded).length / filteredCues.length) * 100)
    : 0;
  const redAlerts = filteredCues.filter((cue) => !cue.responded).length;
  const SelectedChannelIcon = selectedCue ? channelMeta[selectedCue.channel].icon : AudioLines;

  useEffect(() => {
    if (!selectedCue) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCue(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedCue]);

  function exportHistory() {
    const rows = [
      ["Time", "Cue", "Channel", "Response", "Description"],
      ...filteredCues.map((cue) => [
        `${cue.hoursAgo} hours ago`,
        cue.cue,
        cue.channel,
        cue.responded ? "Responded" : "No response",
        cue.description,
      ]),
    ];
    const csv = rows.map((row) => row.map((field) => `"${field.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `percepta-awareness-history-${range}d.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const currentRange = rangeOptions.find((option) => option.days === range)?.label ?? "Last 7 days";

  return (
    <div className="history-app">
      <aside className="history-sidebar" aria-label="Dashboard navigation">
        <a className="history-brand" href="/app/history"><span className="history-brand__mark">P</span><span>PERCEPTA</span></a>
        <p className="history-nav-label">Workspace</p>
        <nav className="history-nav">
          <a className="history-nav__link" href="/app/overview"><LayoutDashboard /><span>Overview</span></a>
          <a className="history-nav__link history-nav__link--active" href="/app/history" aria-current="page"><Activity /><span>Awareness History</span></a>
          <a className="history-nav__link" href="/app/policy"><SlidersHorizontal /><span>Perception Policy</span></a>
          <a className="history-nav__link" href="/app/devices"><Monitor /><span>Devices</span></a>
          <a className="history-nav__link" href="/app/settings"><Settings /><span>Settings</span></a>
        </nav>
        <div className="history-sidebar__bottom">
          <div className="history-user">
            <div className="history-avatar" aria-hidden="true">JD</div>
            <div className="history-user__info"><strong>Jamie Davis</strong><span>jamie@email.com</span></div>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
          <div className="history-plan"><Sparkles size={14} /><span>Percepta Pro</span><span className="history-plan__dot" /></div>
        </div>
      </aside>

      <nav className="history-mobile-nav" aria-label="Mobile dashboard navigation">
        <a href="/app/overview"><LayoutDashboard /><span>Overview</span></a>
        <a className="is-active" href="/app/history" aria-current="page"><Activity /><span>History</span></a>
        <a href="/app/policy"><SlidersHorizontal /><span>Policy</span></a>
        <a href="/app/settings"><Settings /><span>Settings</span></a>
      </nav>

      <main className="history-main">
        <header className="history-topbar">
          <div className="history-heading">
            <div className="history-breadcrumb"><span>Workspace</span><ChevronRight size={14} /><span>Insights</span></div>
            <h1>Awareness History</h1>
          </div>
          <div className="history-actions">
            <div className="history-range-wrap">
              <button className="history-range" type="button" aria-expanded={isRangeOpen} onClick={() => setIsRangeOpen(!isRangeOpen)}>
                <CalendarDays size={16} /><span>{currentRange}</span><ChevronDown size={15} />
              </button>
              {isRangeOpen && <div className="history-range-menu" role="menu">
                {rangeOptions.map((option) => <button key={option.days} role="menuitem" type="button" onClick={() => { setRange(option.days); setIsRangeOpen(false); }}>{option.label}{range === option.days && <Check size={15} />}</button>)}
              </div>}
            </div>
            <button className="history-export" type="button" onClick={exportHistory}><Download size={16} /><span>Export</span></button>
          </div>
        </header>

        <div className="history-content">
          <section className="history-primary" aria-label="Awareness insights">
            <div className="history-section-intro">
              <div><p className="history-eyebrow"><span />Your awareness, at a glance</p><p className="history-subtitle">A little more clarity in every moment.</p></div>
              <button className="history-help" type="button" aria-label="About your awareness insights"><CircleHelp size={17} /></button>
            </div>

            <section className="history-kpis" aria-label="Key metrics">
              <article className="history-kpi"><div className="history-kpi__top"><span>Cues delivered</span><span className="history-kpi__icon"><Zap size={17} /></span></div><strong>{filteredCues.length === 0 ? "0" : filteredCues.length * 18 + 24}</strong><p><span className="history-positive">↑ 12%</span> <span>vs. previous period</span></p><div className="history-kpi__spark" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
              <article className="history-kpi"><div className="history-kpi__top"><span>Response rate</span><span className="history-kpi__icon"><Activity size={17} /></span></div><strong>{responseRate}<small>%</small></strong><p><span className="history-positive">↑ 4.8%</span> <span>vs. previous period</span></p><div className="history-kpi__spark history-kpi__spark--line" aria-hidden="true"><svg viewBox="0 0 124 30" preserveAspectRatio="none"><path d="M1 22 C14 21 15 13 27 16 S42 24 54 13 S70 11 80 14 S94 4 104 9 S115 12 123 2" /></svg></div></article>
              <article className="history-kpi"><div className="history-kpi__top"><span>Top channel</span><span className="history-kpi__icon"><Headphones size={17} /></span></div><strong className="history-kpi__channel">Audio</strong><p><span>Used in</span> <b>68%</b> <span>of your cues</span></p><div className="history-channel-bar"><span /></div></article>
              <article className="history-kpi history-kpi--alerts"><div className="history-kpi__top"><span>Alerts (red)</span><span className="history-kpi__icon"><Bell size={17} /></span></div><strong>{redAlerts}</strong><p><span>Needed a little extra attention</span></p><div className="history-alert-note"><span /> {redAlerts === 0 ? "All clear, no urgent alerts" : "Unanswered cues need a look"}</div></article>
            </section>

            <section className="history-card history-chart-card" aria-labelledby="cues-chart-title">
              <div className="history-card__heading">
                <div><p className="history-card__eyebrow">Your activity</p><h2 id="cues-chart-title">Cues over time</h2></div>
                <div className="history-legend"><span><i /> Cues delivered</span><span className="history-legend__warning"><i /> Unanswered</span></div>
              </div>
              {filteredCues.length > 0 ? <div className="history-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="cueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1B3A8C" stopOpacity={0.12} /><stop offset="100%" stopColor="#1B3A8C" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid stroke="#E9EDF5" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#8992A5", fontSize: 11, fontFamily: "Poppins, sans-serif" }} dy={12} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8992A5", fontSize: 11, fontFamily: "Poppins, sans-serif" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ border: "1px solid #E9EDF5", borderRadius: 10, boxShadow: "0 8px 24px rgba(27,58,140,.10)", fontFamily: "Poppins, sans-serif", fontSize: 12 }} />
                    <Area type="monotone" dataKey="cues" stroke="none" fill="url(#cueFill)" />
                    <Line type="monotone" dataKey="cues" name="Cues" stroke="#1B3A8C" strokeWidth={2.5} dot={{ r: 3, fill: "#1B3A8C", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#1B3A8C" }} />
                    <Line type="monotone" dataKey="warnings" name="Unanswered" stroke="transparent" strokeWidth={0} dot={{ r: 4, fill: "#FF6347", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#FF6347", stroke: "#fff", strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div> : <div className="history-empty"><div className="history-empty__art"><AudioLines /><span /><span /></div><strong>No cues just yet</strong><p>Your awareness history will appear here as you go about your day.</p></div>}
            </section>

            <section className="history-card history-timeline-card" aria-labelledby="timeline-title">
              <div className="history-card__heading history-timeline-heading">
                <div><p className="history-card__eyebrow">A closer look</p><h2 id="timeline-title">Recent cues <span>{filteredCues.length}</span></h2></div>
                <button className="history-filter" type="button" onClick={() => setIsRangeOpen(!isRangeOpen)}><CalendarDays size={15} /> {currentRange}<ChevronDown size={14} /></button>
              </div>
              {filteredCues.length > 0 ? <div className="history-timeline">
                {filteredCues.map((cue) => {
                  const ChannelIcon = channelMeta[cue.channel].icon;
                  return <button className="history-timeline-row" key={cue.id} type="button" onClick={() => setSelectedCue(cue)}>
                    <span className="history-timeline-time"><Clock3 size={14} />{cue.hoursAgo < 24 ? cue.time : `${Math.floor(cue.hoursAgo / 24)}d ago`}</span>
                    <span className="history-cue-pill">{cue.cue}</span>
                    <span className={`history-channel-icon history-channel-icon--${channelMeta[cue.channel].color}`} aria-label={`${cue.channel} channel`}><ChannelIcon size={16} /></span>
                    <span className="history-timeline-description">{cue.description}</span>
                    <span className={`history-response ${cue.responded ? "history-response--yes" : "history-response--no"}`} title={cue.responded ? "Responded" : "No response"}>{cue.responded ? <Check size={14} /> : <X size={14} />}</span>
                    <ChevronRight className="history-row-chevron" size={16} />
                  </button>;
                })}
              </div> : <div className="history-empty history-empty--list"><div className="history-empty__art"><AudioLines /><span /><span /></div><strong>No cues in this range</strong><p>Try a longer date range to see more of your history.</p></div>}
            </section>
          </section>

          <aside className="history-rail">
            <section className="history-card policy-card">
              <div className="policy-card__top"><span className="policy-icon"><SlidersHorizontal size={17} /></span><span className="policy-status"><i /> Learning</span></div>
              <p className="history-card__eyebrow">Adaptive to you</p>
              <h2>Perception Policy</h2>
              <p className="policy-copy">Your agent is learning how you like to stay in the loop.</p>
              <div className="policy-preference"><span className="policy-preference__label">Your preferred channel</span><div className="policy-preference__main"><span className="policy-preference__icon"><AudioLines size={17} /></span><span><strong>Audio</strong><small>Most helpful for you</small></span><span className="policy-preference__percent">68%</span></div></div>
              <div className="policy-bars">
                <div className="policy-bar"><div><span>Audio</span><b>68%</b></div><span className="policy-bar__track"><i style={{ width: "68%" }} /></span></div>
                <div className="policy-bar"><div><span>Visual</span><b>22%</b></div><span className="policy-bar__track"><i style={{ width: "22%" }} /></span></div>
                <div className="policy-bar"><div><span>Haptic</span><b>10%</b></div><span className="policy-bar__track"><i style={{ width: "10%" }} /></span></div>
              </div>
              <div className="policy-insight"><Sparkles size={16} /><p><strong>A small insight</strong>Your audio cues get the quickest responses in the morning.</p></div>
              <a className="policy-link" href="/app/policy">Explore your policy <ChevronRight size={15} /></a>
            </section>
            <section className="history-tip">
              <span className="history-tip__icon"><Shield size={17} /></span><div><strong>Your privacy matters</strong><p>Your awareness history is private and only used to personalize your experience.</p><a href="/app/settings">Privacy settings <ChevronRight size={13} /></a></div>
            </section>
            <div className="history-rail-footer"><span>Made for more mindful moments</span><span><Mic size={13} /> Percepta Intelligence</span></div>
          </aside>
        </div>
      </main>

      {selectedCue && <div className="history-drawer-layer">
        <button className="history-drawer-backdrop" type="button" aria-label="Close cue details" onClick={() => setSelectedCue(null)} />
        <section className="history-drawer" role="dialog" aria-modal="true" aria-labelledby="cue-detail-title">
          <div className="history-drawer__top"><div><p className="history-card__eyebrow">Cue details</p><h2 id="cue-detail-title">{selectedCue.cue}</h2></div><button className="history-drawer__close" type="button" aria-label="Close cue details" onClick={() => setSelectedCue(null)}><X size={19} /></button></div>
          <div className="history-drawer__date"><CalendarDays size={16} /><span>{selectedCue.hoursAgo < 24 ? "Today" : `${Math.floor(selectedCue.hoursAgo / 24)} days ago`}</span><span>·</span><span>{selectedCue.time}</span></div>
          <div className="history-detail-message"><span className={`history-channel-icon history-channel-icon--${channelMeta[selectedCue.channel].color}`}><AudioLines size={18} /></span><p>{selectedCue.description}</p></div>
          <div className="history-detail-field"><span>What happened</span><p>{selectedCue.details}</p></div>
          <div className="history-detail-field"><span>Context</span><p>{selectedCue.context}</p></div>
          <div className="history-detail-field"><span>Delivered through</span><p><SelectedChannelIcon size={15} />{selectedCue.channel}</p></div>
          <div className={`history-detail-response ${selectedCue.responded ? "is-responded" : "is-unanswered"}`}>
            {selectedCue.responded ? <Check size={17} /> : <X size={17} />}<span>{selectedCue.responded ? "You responded to this cue" : "No response detected"}</span>
          </div>
          <div className="history-drawer__foot"><span><Sparkles size={15} /> Your agent learns from moments like this</span></div>
        </section>
      </div>}
    </div>
  );
}
