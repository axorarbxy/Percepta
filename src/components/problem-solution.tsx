"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, EyeOff, Feather, Glasses, Smartphone, ZapOff } from "lucide-react";
import { useRef } from "react";

const problems = [
  { title: "Implantable eyes", body: "Invasive procedures put advanced perception out of reach for most people.", Icon: EyeOff },
  { title: "Bulky AR glasses", body: "Expensive, conspicuous hardware asks you to change how you look and live.", Icon: Glasses },
  { title: "One-shot apps", body: "Single-purpose tools miss the context and continuity of everyday life.", Icon: ZapOff },
];

const solutions = [
  { title: "Borrowed sensors", body: "Use the capable phone, earbuds, and watch you already carry.", Icon: Smartphone },
  { title: "Adaptive AI routing", body: "The right signal reaches you in the right way, at the right moment.", Icon: Brain },
  { title: "Zero hardware", body: "Get started with the devices you own. No implants or custom gear.", Icon: Feather },
];

function Cards({ items, kind }: { items: typeof problems; kind: "problem" | "solution" }) {
  return <motion.div className={`ps-cards ps-cards--${kind}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.28 }} variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}>
    {items.map(({ title, body, Icon }, index) => <motion.article className="ps-card" key={title} variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" } } }}>
      <div className="ps-card__icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></div>
      <h3 className="h3 ps-card__title">{title}</h3>
      <p className="body ps-card__body">{body}</p>
    </motion.article>)}
  </motion.div>;
}

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.75", "end 0.65"] });
  const lineScale = useTransform(scrollYProgress, [0.28, 0.72], [0, 1]);
  const solutionReveal = useTransform(scrollYProgress, [0.64, 0.82], [0, 1]);
  const solutionOpacity = useTransform(solutionReveal, [0, 0.35], [0, 1]);
  const solutionY = useTransform(solutionReveal, [0, 1], [20, 0]);
  const arrowY = useTransform(solutionReveal, [0, 1], [-5, 0]);

  return <section ref={sectionRef} className="problem-solution" aria-labelledby="problem-solution-title">
    <div className="ps-container">
      <motion.header className="ps-header" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
        <p className="label ps-eyebrow">A more human way forward</p>
        <h2 className="h2" id="problem-solution-title">Awareness shouldn&apos;t need hardware.</h2>
        <p className="body ps-subhead">Today&apos;s options are expensive implants, bulky AR glasses, or one-shot accessibility apps. Percepta is none of them.</p>
      </motion.header>

      <div className="ps-label ps-label--problem"><span />The problem</div>
      <Cards items={problems} kind="problem" />

      <div className="ps-connector" aria-hidden="true">
        <motion.div className="ps-connector__line" style={{ scaleY: lineScale }} />
        <motion.div className="ps-connector__arrow" style={{ opacity: solutionOpacity, y: arrowY }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v15m0 0 6-6m-6 6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
      </div>

      <div className="ps-label ps-label--solution"><span />The Percepta approach</div>
      <motion.div style={{ opacity: solutionOpacity, y: solutionY }}>
        <Cards items={solutions} kind="solution" />
      </motion.div>
    </div>
  </section>;
}
