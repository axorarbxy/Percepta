"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";

type Plan = { name: string; product: string; monthly: number; annual: number; suffix: string; description: string; features: string[]; cta: string; popular?: boolean };

const plans: Plan[] = [
  { name: "Free", product: "Awareness Basic", monthly: 0, annual: 0, suffix: "/ forever", description: "A simple start for everyday awareness.", features: ["30 min/day ambient feed", "Vision-only cues", "Phone vibration haptics"], cta: "Get started" },
  { name: "Pro", product: "Awareness Pro", monthly: 19, annual: 15.2, suffix: "/ month", description: "Personalized perception that adapts to you.", features: ["Unlimited ambient feed", "Multimodal: vision + audio + biometrics", "RL personalization", "Smartwatch + earbuds routing", "Awareness History dashboard"], cta: "Start Pro", popular: true },
  { name: "Teams", product: "Awareness Teams", monthly: 49, annual: 39.2, suffix: "/ user / month", description: "Shared awareness for teams in the field.", features: ["Everything in Pro", "Shared policies for first responders", "Admin dashboard", "Single sign-on (SSO)", "Priority model updates"], cta: "Contact sales" },
];

const comparison = [
  ["Ambient feed", "30 min/day", "Unlimited", "Unlimited"],
  ["Cue types", "Vision", "Vision, audio, biometrics", "Vision, audio, biometrics"],
  ["Personalization", "—", "RL personalization", "RL personalization"],
  ["Device routing", "Phone haptics", "Smartwatch + earbuds", "Smartwatch + earbuds"],
  ["Awareness history", "—", "Included", "Included"],
  ["Shared team policies", "—", "—", "Included"],
  ["Admin dashboard & SSO", "—", "—", "Included"],
  ["Model updates", "Standard", "Standard", "Priority"],
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return <main className="pricing-page">
    <section className="pricing-section" aria-labelledby="pricing-title">
      <div className="pricing-container">
        <header className="pricing-header">
          <p className="label pricing-kicker">Plans for every perspective</p>
          <h1 className="h2" id="pricing-title">Simple pricing. Serious perception.</h1>
          <p className="body">Start with the essentials, then choose the awareness that fits your life or team.</p>
        </header>

        <div className="billing-row">
          <div className="billing-toggle" role="group" aria-label="Billing period">
            <button type="button" className={!annual ? "is-active" : ""} aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button>
            <button type="button" className={annual ? "is-active" : ""} aria-pressed={annual} onClick={() => setAnnual(true)}>Annual</button>
          </div>
          <span className="save-badge">Save 20%</span>
        </div>

        <div className="pricing-cards">
          {plans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            return <article className={`plan-card${plan.popular ? " plan-card--popular" : ""}`} key={plan.name}>
              {plan.popular && <div className="plan-card__badge">Most popular</div>}
              <div className="plan-card__top">
                <p className="label plan-card__tier">{plan.name}</p>
                <h2 className="plan-card__product">{plan.product}</h2>
                <p className="plan-card__description">{plan.description}</p>
                <div className="plan-card__price"><span className="plan-card__currency">$</span><span>{price === 0 ? "0" : price.toFixed(price % 1 === 0 ? 0 : 2)}</span><span className="plan-card__suffix">{plan.suffix}</span></div>
                {annual && price > 0 && <p className="plan-card__billing">Billed annually</p>}
              </div>
              <ul className="plan-card__features">{plan.features.map((feature) => <li key={feature}><Check size={17} strokeWidth={2.3} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
              <Link className={`button ${plan.popular ? "button--primary" : "button--ghost"} plan-card__cta`} href="/#early-access">{plan.cta}</Link>
            </article>;
          })}
        </div>

        <section className="comparison" aria-labelledby="comparison-title">
          <h2 className="h3" id="comparison-title">Compare plans</h2>
          <div className="comparison-desktop">
            <table><thead><tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Pro</th><th scope="col">Teams</th></tr></thead>
              <tbody>{comparison.map(([feature, free, pro, teams]) => <tr key={feature}><th scope="row">{feature}</th><td>{free}</td><td>{pro}</td><td>{teams}</td></tr>)}</tbody>
            </table>
          </div>
          <details className="comparison-mobile"><summary>View plan comparison</summary>
            <div className="comparison-mobile__plans">{plans.map((plan, column) => <section key={plan.name}><h3>{plan.name}</h3><dl>{comparison.map(([feature, free, pro, teams]) => <div key={feature}><dt>{feature}</dt><dd>{[free, pro, teams][column]}</dd></div>)}</dl></section>)}</div>
          </details>
          <p className="comparison-note">All plans are designed to work with compatible devices you already own.</p>
        </section>
      </div>
    </section>
  </main>;
}
