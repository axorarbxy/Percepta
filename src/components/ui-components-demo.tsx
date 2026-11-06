"use client";

import { useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import Notification from "../../UI components/halo_toast";
import Loader from "../../UI components/loader";

export function UiComponentsDemo() {
  const [toastVisible, setToastVisible] = useState(true);

  return (
    <section className="ui-kit-demo container" aria-labelledby="ui-kit-title">
      <div className="ui-kit-demo__heading"><div><span className="secondary-eyebrow"><span /> THE PERCEPTA INTERFACE</span><h2 id="ui-kit-title">Small details, thoughtfully made.</h2><p>Explore a couple of the interface building blocks that bring Percepta’s cues to life.</p></div><Sparkles className="ui-kit-demo__sparkle" size={25} aria-hidden="true" /></div>
      <div className="ui-kit-demo__grid">
        <article className="ui-kit-card"><div className="ui-kit-card__heading"><div><h3>Halo Toast</h3><p>Timely context, at a glance.</p></div><span>01</span></div><div className="ui-kit-card__stage">{toastVisible ? <Notification onDismiss={() => setToastVisible(false)} /> : <button className="ui-kit-restore" type="button" onClick={() => setToastVisible(true)}><RotateCcw size={14} />Show notification again</button>}</div></article>
        <article className="ui-kit-card"><div className="ui-kit-card__heading"><div><h3>Cue loader</h3><p>A visual cue while Percepta is thinking.</p></div><span>02</span></div><div className="ui-kit-card__stage ui-kit-card__stage--loader"><Loader label="Percepta is preparing an awareness cue" /></div></article>
      </div>
    </section>
  );
}
