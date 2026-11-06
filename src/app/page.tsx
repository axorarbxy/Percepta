import Link from "next/link";
import { Button, Container, Section } from "@/components/ui";
import { Hero } from "@/components/hero";
import { ProblemSolution } from "@/components/problem-solution";
import { HowItWorks } from "@/components/how-it-works";
import { AwarenessDemo } from "@/components/awareness-demo";

export default function HomePage() {
  return <>
    <Hero />
    <ProblemSolution />
    <HowItWorks />
    <AwarenessDemo />
    <Section className="intro" id="how-it-works"><Container className="intro__grid"><div><p className="label section-kicker">A better point of view</p><h2 className="h2">Clarity changes everything.</h2></div><p className="body intro__copy">We’re building tools that make online experiences feel more natural and more accessible for everyone. Percepta brings thoughtful design and useful technology together, so you can focus on what matters.</p></Container></Section>
    <Section className="feature" id="accessibility"><Container className="feature__card"><div className="feature__symbol" aria-hidden="true">✳</div><p className="label">Designed around people</p><h2 className="h2">The internet should work for you.</h2><p className="body">Simple, considerate experiences start with accessibility at the heart of every decision.</p><Link className="feature__link label" href="#about">Our approach <span aria-hidden="true">↗</span></Link></Container></Section>
    <Section className="early-access" id="early-access"><Container className="early-access__inner"><div><p className="label">Be part of what’s next</p><h2 className="h2">A clearer web is on its way.</h2></div><Button variant="danger" type="button">Get Early Access <span aria-hidden="true">↗</span></Button></Container></Section>
    <div id="pricing" className="anchor-target" /><div id="about" className="anchor-target" />
  </>;
}
