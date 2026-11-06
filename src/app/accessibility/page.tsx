import type { Metadata } from "next";
import Link from "next/link";
import { Ear, Eye, Heart, Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility at Percepta | Awareness, for everyone",
  description: "Explore how Percepta is designed around different sensory needs, everyday contexts, and personal choice.",
};

const audiences = [
  { icon: Eye, title: "Visually impaired", status: "Available", kind: "available", text: "Audio and haptic cues can surface nearby context, changes in your path, and useful details as you move." },
  { icon: Ear, title: "Hearing impaired", status: "Available", kind: "available", text: "Glanceable text and gentle haptic cues offer another way to notice timely information around you." },
  { icon: Heart, title: "Neurodivergent", status: "Coming soon", kind: "coming", text: "Explore quieter, more predictable ways to receive information, with personal control over timing and intensity." },
  { icon: Shield, title: "First responders", status: "Coming soon", kind: "coming", text: "Support situational awareness in demanding environments with cues designed to fit the moment." },
];

export default function AccessibilityPage() {
  return (
    <div className="secondary-page accessibility-page">
      <section className="secondary-hero container accessibility-hero">
        <span className="secondary-eyebrow"><span /> ACCESSIBILITY IS THE STARTING POINT</span>
        <h1>Awareness, for everyone.</h1>
        <p className="secondary-hero-copy">People experience the world in different ways. Percepta helps shape useful context into audio, haptic, and visual cues that fit your senses and the moment you’re in.</p>
        <Link className="button button--primary" href="#who-its-for">Find your perspective</Link>
        <div className="accessibility-hero-art" aria-hidden="true"><div><Eye size={22} /><Ear size={22} /><Sparkles size={20} /></div><span /><span /><span /></div>
      </section>

      <section className="accessibility-audiences-section" id="who-its-for" aria-labelledby="accessibility-audiences-title">
        <div className="container"><div className="secondary-section-heading"><span className="secondary-eyebrow">Designed around real life</span><h2 id="accessibility-audiences-title">Different needs. More ways to connect.</h2><p>Percepta is growing with the people and communities it serves.</p></div>
          <div className="accessibility-audience-grid">{audiences.map(({ icon: Icon, title, status, kind, text }) => <article className="accessibility-audience-card" key={title}><div className="accessibility-audience-card__top"><span className="accessibility-audience-icon"><Icon size={22} /></span><span className={`accessibility-status accessibility-status--${kind}`}>{status}</span></div><h3>{title}</h3><p>{text}</p><span className="accessibility-card-line" /></article>)}</div>
        </div>
      </section>

      <section className="accessibility-quote-section container" aria-label="Percepta design principle">
        <div className="accessibility-quote-card"><span className="accessibility-quote-mark">“</span><div><p>Technology should meet people where they are, and make more of the world available on their terms.</p><span className="accessibility-quote-attribution"><i /> A Percepta design principle</span></div><div className="accessibility-quote-art" aria-hidden="true"><span /><span /><span /></div></div>
      </section>

      <section className="accessibility-cta-band"><div className="container accessibility-cta-inner"><div><span className="accessibility-cta-kicker">YOUR EXPERIENCE CAN SHAPE WHAT’S NEXT</span><h2>Join the early access program</h2><p>Help us build an awareness experience that works for more people.</p></div><Link className="accessibility-cta-button" href="/contact">Get early access <span>→</span></Link></div></section>
    </div>
  );
}
