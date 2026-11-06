"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Ear, Brain, SlidersHorizontal, Volume2 } from "lucide-react";
import { useRef } from "react";

const steps = [
  { number: "01", title: "Sense", body: "Captures video, audio, biometrics, and context.", Icon: Ear },
  { number: "02", title: "Understand", body: "Multimodal AI fuses inputs into a scene state.", Icon: Brain },
  { number: "03", title: "Personalize", body: "An RL agent learns your best sensory channel.", Icon: SlidersHorizontal },
  { number: "04", title: "Deliver", body: "Cues route to audio, haptic, text, or voice.", Icon: Volume2 },
];

const tools = ["YOLOv8", "Whisper", "GPT-4o", "Ray RLlib"];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.72", "end 0.72"] });
  const lineProgress = useTransform(scrollYProgress, [0.12, 0.64], [0, 1]);

  return <section className="how-it-works" id="how-it-works" ref={sectionRef} aria-labelledby="how-title">
    <div className="how-container">
      <motion.header className="how-header" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.45 }}>
        <p className="label how-kicker">From the world to your senses</p>
        <h2 className="h2" id="how-title">How Percepta works</h2>
        <p className="body">A continuous loop that turns what’s around you into cues that work for you.</p>
      </motion.header>

      <div className="how-steps">
        <motion.div className="how-track how-track--desktop" aria-hidden="true" style={{ scaleX: lineProgress }} />
        <motion.div className="how-track how-track--mobile" aria-hidden="true" style={{ scaleY: lineProgress }} />
        {steps.map(({ number, title, body, Icon }, index) => <motion.article className="how-step" key={number} initial={{ opacity: 0, y: 18, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.42, delay: index * 0.15, ease: "easeOut" }}>
          <motion.div className="how-step__node" whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 350, damping: 18 }}>
            <span className="how-step__number">{number}</span>
            <Icon className="how-step__icon" size={21} strokeWidth={1.8} aria-hidden="true" />
          </motion.div>
          <div className="how-step__copy"><Icon className="how-step__icon" size={22} strokeWidth={1.8} aria-hidden="true" /><h3 className="h3">{title}</h3><p className="body">{body}</p></div>
        </motion.article>)}
      </div>

      <motion.div className="tech-strip" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.45 }}>
        <span className="tech-strip__label">Powered by</span>
        {tools.map((tool) => <span className="tech-strip__pill" key={tool}>{tool}</span>)}
      </motion.div>
    </div>
  </section>;
}
