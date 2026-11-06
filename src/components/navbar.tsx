"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui";

const links = [["Product", "#product"], ["How It Works", "#how-it-works"], ["For Accessibility", "#accessibility"], ["Pricing", "/pricing"], ["About", "#about"]];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="navbar">
    <Container className="navbar__inner">
      <Link className="brand" href="/" aria-label="Percepta home"><span className="brand__mark" aria-hidden="true">P</span><span>PERCEPTA</span></Link>
      <nav className="navbar__links" aria-label="Main navigation">{links.map(([label, href]) => <Link className="label nav-link" href={href} key={label}>{label}</Link>)}</nav>
      <Link className="button button--danger navbar__cta" href="#early-access">Get Early Access</Link>
      <button className="navbar__menu" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </Container>
    <AnimatePresence>{open && <>
      <motion.button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.nav className="drawer" aria-label="Mobile navigation" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.24 }}>
        <div className="drawer__top"><span className="brand"><span className="brand__mark">P</span><span>PERCEPTA</span></span><button className="icon-button" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button></div>
        {links.map(([label, href]) => <Link className="label drawer__link" href={href} key={label} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="button button--danger drawer__cta" href="#early-access" onClick={() => setOpen(false)}>Get Early Access</Link>
      </motion.nav>
    </>}</AnimatePresence>
  </header>;
}
