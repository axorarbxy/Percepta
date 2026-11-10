"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

const lineVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="launch-hero" id="product" aria-labelledby="hero-title">
      <div className="launch-hero__grid">
        <div className="launch-hero__content">
          <motion.p className="launch-hero__eyebrow label" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="launch-hero__eyebrow-mark" aria-hidden="true" />SOFTWARE-DEFINED PERCEPTION
          </motion.p>

          <h1 className="h1 launch-hero__title" id="hero-title" aria-label="Your sixth sense, software-defined.">
            <motion.span className="launch-hero__line" initial={false} animate={{ opacity: 1, y: 0 }}>Your sixth sense,</motion.span>
            <motion.span className="launch-hero__line launch-hero__line--accent" initial={false} animate={{ opacity: 1, y: 0 }}>software-defined.</motion.span>
          </h1>

          <motion.p className="launch-hero__subhead body" initial={false} animate={{ opacity: 1, y: 0 }}>
            Percepta turns your phone, earbuds, and smartwatch into a real-time awareness layer — no hardware, no surgery.
          </motion.p>

          <motion.div className="launch-hero__actions" initial={false} animate={{ opacity: 1, y: 0 }}>
            <Link className="button button--primary" href="#early-access">Get Early Access <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <Link className="button button--ghost launch-hero__demo" href="#how-it-works"><Play size={15} fill="currentColor" aria-hidden="true" />Watch 90s Demo</Link>
          </motion.div>

          <motion.div className="launch-hero__trust" initial={false} animate={{ opacity: 1 }} aria-label="Percepta benefits">
            <span>300M+ sensory needs served</span><i aria-hidden="true" /><span>No custom hardware</span><i aria-hidden="true" /><span>Ships in weeks</span>
          </motion.div>
        </div>

        <div className="launch-hero__visual" aria-label="An awareness signal expanding from a phone" role="img">
          <svg className="awareness-art" viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id="ringGlow"><stop stopColor="#1B3A8C" stopOpacity=".12" /><stop offset="1" stopColor="#1B3A8C" stopOpacity="0" /></radialGradient>
              <filter id="phoneShadow" x="160" y="106" width="240" height="370" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="13" /></filter>
            </defs>
            <circle cx="280" cy="280" r="246" fill="url(#ringGlow)" />
            <circle className="awareness-art__outer-ring" cx="280" cy="280" r="224" stroke="#1B3A8C" strokeOpacity=".12" strokeWidth="1.5" />
            <circle cx="280" cy="280" r="187" stroke="#1B3A8C" strokeOpacity=".2" strokeWidth="1.5" strokeDasharray="3 9" />
            <circle cx="280" cy="280" r="149" stroke="#1B3A8C" strokeOpacity=".12" strokeWidth="1" />
            <path d="M280 72v24M280 464v24M72 280h24M464 280h24" stroke="#1B3A8C" strokeOpacity=".28" strokeWidth="2" strokeLinecap="round" />
            <circle cx="280" cy="280" r="176" stroke="#1B3A8C" strokeOpacity=".08" strokeWidth="22" />
            <motion.circle cx="280" cy="280" r="176" stroke="#1B3A8C" strokeWidth="2.5" style={{ transformBox: "fill-box", transformOrigin: "center" }} animate={{ scale: [1, 1.05, 1], opacity: [0.9, 0.55, 0.9] }} transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }} />
            <ellipse cx="280" cy="450" rx="95" ry="21" fill="#0A1428" fillOpacity=".16" filter="url(#phoneShadow)" />
            <rect x="206" y="113" width="148" height="310" rx="27" fill="#12275E" />
            <rect x="211" y="118" width="138" height="300" rx="23" fill="#FFFFFF" />
            <rect x="221" y="139" width="118" height="250" rx="15" fill="#F4F6FB" />
            <rect x="254" y="126" width="52" height="7" rx="3.5" fill="#12275E" />
            <circle cx="280" cy="264" r="36" fill="#1B3A8C" fillOpacity=".08" />
            <circle cx="280" cy="264" r="23" fill="#1B3A8C" fillOpacity=".14" />
            <path d="M269 264h22M280 253v22" stroke="#1B3A8C" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="237" y="322" width="86" height="7" rx="3.5" fill="#1B3A8C" fillOpacity=".2" />
            <rect x="237" y="338" width="62" height="6" rx="3" fill="#1B3A8C" fillOpacity=".12" />
            <rect x="237" y="362" width="54" height="14" rx="7" fill="#1B3A8C" fillOpacity=".1" />
            <circle cx="280" cy="402" r="4" fill="#1B3A8C" fillOpacity=".28" />
            <motion.g style={{ transformOrigin: "280px 280px" }} animate={{ rotate: 360 }} transition={{ duration: 8, ease: "linear", repeat: Infinity }}>
              <circle cx="280" cy="104" r="8" fill="#FF6347" />
              <circle cx="280" cy="104" r="15" fill="#FF6347" fillOpacity=".14" />
            </motion.g>
            <circle cx="441" cy="365" r="5" fill="#FF6347" fillOpacity=".65" />
            <circle cx="123" cy="190" r="4" fill="#1B3A8C" fillOpacity=".4" />
          </svg>
          <motion.div className="signal-chip" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <span className="signal-chip__pulse" /><span><b>Awareness</b><small>Always in sync</small></span><span className="signal-chip__status">LIVE</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
