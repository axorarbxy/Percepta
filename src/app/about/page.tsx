import type { Metadata } from "next";
import Link from "next/link";
import { Eye, HeartHandshake, Smartphone, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Why we built Percepta | Percepta",
  description: "The story and principles behind Percepta, a software-first way to make everyday awareness more accessible.",
};

const team = [
  { initials: "AM", name: "Avery Morgan", role: "Co-founder · Product" },
  { initials: "JL", name: "Jordan Lee", role: "Co-founder · Research" },
  { initials: "SK", name: "Samira Khan", role: "Accessibility Lead" },
  { initials: "TR", name: "Theo Rivera", role: "Engineering Lead" },
];

const values = [
  { icon: Eye, title: "Accessibility first", text: "We start with different ways of sensing and understanding the world, then design around real needs." },
  { icon: Smartphone, title: "Software over hardware", text: "Useful awareness should work with devices people already know and carry." },
  { icon: UsersRound, title: "Human in the loop", text: "People set the boundaries. Percepta learns preferences while keeping personal choice in control." },
];

export default function AboutPage() {
  return (
    <div className="secondary-page about-page">
      <section className="secondary-hero container">
        <span className="secondary-eyebrow"><span /> OUR REASON FOR BEING</span>
        <h1>Perception is a right, not a hardware upgrade.</h1>
        <p className="secondary-hero-copy">We believe everyone deserves a richer relationship with the world around them. Percepta brings useful context through the devices people already own, adapting to each person’s senses, routines, and choices.</p>
        <Link className="button button--primary" href="/accessibility">Explore our approach</Link>
        <div className="about-hero-orbit" aria-hidden="true"><span /><span /><span /><i><Eye size={32} /></i></div>
      </section>

      <section className="about-timeline-section" aria-labelledby="about-timeline-title">
        <div className="container">
          <div className="secondary-section-heading"><span className="secondary-eyebrow">A thoughtful beginning</span><h2 id="about-timeline-title">From a question to a new perspective</h2></div>
          <div className="about-timeline">
            <article className="about-timeline-item"><span className="about-timeline-year">2024</span><span className="about-timeline-node" /><div><span className="about-timeline-tag">THE IDEA</span><h3>What if awareness could adapt to us?</h3><p>A small team began exploring how everyday technology could make more of the world easier to notice and understand.</p></div></article>
            <article className="about-timeline-item"><span className="about-timeline-year">2025</span><span className="about-timeline-node" /><div><span className="about-timeline-tag">THE PROTOTYPE</span><h3>Building with people, not assumptions</h3><p>Early prototypes brought audio, haptic, and visual cues together, shaped by conversations and practical feedback.</p></div></article>
            <article className="about-timeline-item"><span className="about-timeline-year">2026</span><span className="about-timeline-node" /><div><span className="about-timeline-tag">THE LAUNCH</span><h3>A more personal kind of awareness</h3><p>Percepta takes its next step: a software-first platform that learns what helps and lets each person define the boundaries.</p></div></article>
          </div>
        </div>
      </section>

      <section className="about-team-section container" aria-labelledby="about-team-title">
        <div className="secondary-section-heading"><span className="secondary-eyebrow">People behind the perspective</span><h2 id="about-team-title">Built by a curious, caring team</h2><p>We bring together product, research, accessibility, and engineering to make technology feel more human.</p></div>
        <div className="about-team-grid">{team.map((person) => <article className="about-team-card" key={person.initials}><div className="about-avatar" aria-hidden="true">{person.initials}</div><h3>{person.name}</h3><p>{person.role}</p></article>)}</div>
      </section>

      <section className="about-values-section" aria-labelledby="about-values-title">
        <div className="container"><div className="secondary-section-heading"><span className="secondary-eyebrow">What guides every decision</span><h2 id="about-values-title">A few things we won’t compromise on</h2></div>
          <div className="about-values-grid">{values.map(({ icon: Icon, title, text }) => <article className="about-value-card" key={title}><span><Icon size={21} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="secondary-bottom-cta container"><div><span className="secondary-eyebrow">Take part in what comes next</span><h2>Help shape a more aware world.</h2><p>Tell us what useful awareness looks like for you.</p></div><Link className="button button--primary" href="/contact">Talk to our team</Link><HeartHandshake className="secondary-cta-mark" size={42} aria-hidden="true" /></section>
    </div>
  );
}
