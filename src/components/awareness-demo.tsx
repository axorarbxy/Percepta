"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, RotateCcw, Smartphone, Volume2, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Channel = "Audio" | "Haptic" | "Text";
type Cue = { title: string; body: string; kind: "info" | "warning" };
type FeedCue = Cue & { id: number; channel: Channel };

const mockCues: Cue[] = [
  { title: "Person approaching left", body: "2m, walking fast", kind: "warning" },
  { title: "Crosswalk signal changed", body: "Walk sign active · 4m ahead", kind: "info" },
  { title: "Doorway on your right", body: "Open entrance · 1.5m", kind: "info" },
  { title: "Bicycle approaching", body: "From behind · moving quickly", kind: "warning" },
  { title: "Your ride is here", body: "Blue car · stopping at curb", kind: "info" },
  { title: "Steps ahead", body: "Three steps · slight drop", kind: "warning" },
];

const initialCues: FeedCue[] = [
  { ...mockCues[1], id: -3, channel: "Audio" },
  { ...mockCues[2], id: -2, channel: "Audio" },
  { ...mockCues[0], id: -1, channel: "Audio" },
];

const channels: { name: Channel; Icon: typeof Volume2 }[] = [
  { name: "Audio", Icon: Volume2 },
  { name: "Haptic", Icon: Waves },
  { name: "Text", Icon: AudioLines },
];

export function AwarenessDemo() {
  const [channel, setChannel] = useState<Channel>("Audio");
  const [cards, setCards] = useState<FeedCue[]>(initialCues);
  const [replayKey, setReplayKey] = useState(0);
  const channelRef = useRef(channel);
  const feedRef = useRef<HTMLDivElement>(null);
  const cueCount = useRef(0);
  channelRef.current = channel;

  useEffect(() => {
    const timer = window.setInterval(() => {
      const event = mockCues[cueCount.current % mockCues.length];
      cueCount.current += 1;
      setCards((current) => [...current, { ...event, id: replayKey * 1000 + cueCount.current, channel: channelRef.current }].slice(-5));
    }, 2500);
    return () => window.clearInterval(timer);
  }, [replayKey]);

  useEffect(() => {
    const feed = feedRef.current;
    if (feed) feed.scrollTo({ top: feed.scrollHeight, behavior: "smooth" });
  }, [cards]);

  function replay() {
    cueCount.current = 0;
    setCards(initialCues.map((cue, index) => ({ ...cue, id: (replayKey + 1) * -10 - index })));
    setReplayKey((key) => key + 1);
  }

  return <section className="awareness-demo" id="demo" aria-labelledby="demo-title">
    <div className="demo-container">
      <motion.header className="demo-header" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.45 }}>
        <p className="label demo-kicker">A little more awareness</p>
        <h2 className="h2" id="demo-title">Percepta, in the moment.</h2>
        <p className="body">A live look at how everyday signals become useful cues.</p>
      </motion.header>

      <div className="demo-layout">
        <div className="demo-phone-column">
          <div className="demo-phone" key={replayKey} role="img" aria-label="Phone mockup showing an abstract camera view with a moving scan line">
            <div className="demo-phone__screen">
              <div className="demo-camera">
                <div className="demo-camera__grid" />
                <div className="demo-camera__scene demo-camera__scene--back" />
                <div className="demo-camera__scene demo-camera__scene--left" />
                <div className="demo-camera__scene demo-camera__scene--right" />
                <div className="demo-camera__person"><span /></div>
                <div className="demo-camera__target"><i /><i /><i /><i /></div>
                <div className="demo-camera__scan" />
                <div className="demo-camera__topline"><span><i /> LIVE AWARENESS</span><span>00:12</span></div>
                <div className="demo-camera__bottomline"><span>SCENE ANALYSIS</span><span>● CONNECTED</span></div>
              </div>
              <div className="demo-phone__home" />
            </div>
          </div>
          <p className="demo-phone-caption"><Smartphone size={15} aria-hidden="true" /> Your phone becomes an awareness layer</p>
        </div>

        <div className="awareness-panel">
          <div className="awareness-panel__top">
            <div><p className="label awareness-panel__eyebrow">Live simulation</p><h3 className="h3 awareness-panel__title">Awareness Feed</h3></div>
            <span className="feed-live"><i /> LIVE</span>
          </div>

          <div className="channel-row" role="group" aria-label="Choose cue channel">
            <span className="channel-row__label">Your channel</span>
            <div className="channel-row__options">{channels.map(({ name, Icon }) => <button key={name} className={`channel-option${channel === name ? " is-active" : ""}`} type="button" aria-pressed={channel === name} onClick={() => setChannel(name)}><Icon size={15} aria-hidden="true" />{name}</button>)}</div>
          </div>

          <div className="awareness-feed" ref={feedRef} aria-live="polite" aria-relevant="additions text" aria-label="Percepta awareness cues">
            <AnimatePresence initial={false} mode="popLayout">
              {cards.map((cue, index) => <motion.article className={`cue-card cue-card--${cue.kind}`} key={cue.id} layout initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, transition: { duration: 0.22 } }} transition={{ duration: 0.32, ease: "easeOut" }}>
                <span className="cue-card__accent" />
                <div className="cue-card__content">
                  <div className="cue-card__heading"><h4>{cue.title}</h4><span className="cue-card__channel">{cue.channel}</span></div>
                  <p>{cue.body}</p>
                  <time>{index === cards.length - 1 ? "Just now" : `${(cards.length - 1 - index) * 2.5}s ago`}</time>
                </div>
              </motion.article>)}
            </AnimatePresence>
          </div>

          <div className="awareness-panel__bottom"><span>Showing latest 5 cues</span><button className="replay-button" type="button" onClick={replay}><RotateCcw size={14} aria-hidden="true" />Replay demo</button></div>
        </div>
      </div>
    </div>
  </section>;
}
