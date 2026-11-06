"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, Clock3, Mail, MapPin, MessageCircle, Send, Sparkles } from "lucide-react";

type ContactField = "name" | "email" | "useCase" | "message";
type ContactValues = Record<ContactField, string>;

const faqs = [
  { question: "What is Percepta?", answer: "Percepta is a software-first sensory awareness platform. It turns useful context into audio, haptic, and visual cues through devices you already own." },
  { question: "When can I try it?", answer: "We’re preparing early access now. Leave us a note and we’ll share updates as the program opens." },
  { question: "Which devices will I need?", answer: "The goal is to work with familiar phones, earbuds, and wearables. Exact compatibility will depend on the features available during early access." },
  { question: "How do you handle my data?", answer: "Privacy and personal control are core design principles. We’ll provide clear information about data use and settings as features become available." },
];

const initialValues: ContactValues = { name: "", email: "", useCase: "", message: "" };

export default function ContactExperience() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  function updateField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccess(false);
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<ContactField, string>> = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!values.email.trim()) nextErrors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!values.useCase) nextErrors.useCase = "Choose what you’re getting in touch about.";
    if (!values.message.trim()) nextErrors.message = "Please add a short message.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSuccess(false);
      return;
    }
    setSuccess(true);
    setValues(initialValues);
  }

  return (
    <div className="secondary-page contact-page">
      <section className="secondary-hero contact-hero container"><span className="secondary-eyebrow"><span /> WE’RE LISTENING</span><h1>Talk to us.</h1><p className="secondary-hero-copy">Questions, ideas, accessibility feedback—we’d like to hear what’s on your mind.</p></section>

      <section className="contact-layout container" aria-label="Contact Percepta">
        <div className="contact-form-column">
          <div className="contact-panel-heading"><span className="contact-panel-icon"><MessageCircle size={18} /></span><div><h2>Send us a message</h2><p>We’ll make sure it reaches the right person.</p></div></div>
          <form className="contact-form" noValidate onSubmit={submitForm}>
            <div className="contact-field-row">
              <div className={`contact-field${errors.name ? " has-error" : ""}`}><label htmlFor="contact-name">Your name</label><input id="contact-name" type="text" autoComplete="name" placeholder="Jamie Davis" value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} onChange={(event) => updateField("name", event.target.value)} />{errors.name && <span className="contact-field-error" id="contact-name-error">{errors.name}</span>}</div>
              <div className={`contact-field${errors.email ? " has-error" : ""}`}><label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} onChange={(event) => updateField("email", event.target.value)} />{errors.email && <span className="contact-field-error" id="contact-email-error">{errors.email}</span>}</div>
            </div>
            <div className={`contact-field${errors.useCase ? " has-error" : ""}`}><label htmlFor="contact-use-case">What would you like to talk about?</label><select id="contact-use-case" value={values.useCase} aria-invalid={Boolean(errors.useCase)} aria-describedby={errors.useCase ? "contact-use-case-error" : undefined} onChange={(event) => updateField("useCase", event.target.value)}><option value="">Choose a topic</option><option value="early-access">Early access</option><option value="accessibility">Accessibility feedback</option><option value="partnership">Partnerships</option><option value="product">Product question</option><option value="other">Something else</option></select>{errors.useCase && <span className="contact-field-error" id="contact-use-case-error">{errors.useCase}</span>}</div>
            <div className={`contact-field${errors.message ? " has-error" : ""}`}><label htmlFor="contact-message">Your message</label><textarea id="contact-message" rows={5} placeholder="Tell us a little about what’s on your mind…" value={values.message} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={(event) => updateField("message", event.target.value)} />{errors.message && <span className="contact-field-error" id="contact-message-error">{errors.message}</span>}</div>
            <div className="contact-form-footer"><p><span>*</span> All fields are required.</p><button className="contact-submit" type="submit">Send message <Send size={15} /></button></div>
            {success && <div className="contact-success-toast" role="status"><Sparkles size={16} /><span>Thanks for reaching out. Your message is ready for the Percepta team.</span></div>}
          </form>
        </div>

        <aside className="contact-info-column">
          <section className="contact-info-card"><span className="secondary-eyebrow">A HUMAN ON THE OTHER SIDE</span><h2>We’d love to hear from you.</h2><p>Reach out about early access, share an accessibility perspective, or just say hello.</p><a className="contact-info-link" href="mailto:hello@percepta.ai"><span><Mail size={17} /></span><span><small>EMAIL US</small><strong>hello@percepta.ai</strong></span></a><div className="contact-info-detail"><MapPin size={16} /><span>Building for people, everywhere</span></div><div className="contact-info-detail"><Clock3 size={16} /><span>We read every note with care</span></div><div className="contact-info-divider" /><span className="contact-info-note">A thoughtful answer starts with a thoughtful question.</span></section>
          <section className="contact-faq-card"><div className="contact-faq-heading"><h2>Quick answers</h2><span>FAQ</span></div><div className="contact-faq-list">{faqs.map((faq, index) => { const isOpen = openFaq === index; return <article className={`contact-faq-item${isOpen ? " is-open" : ""}`} key={faq.question}><h3><button type="button" aria-expanded={isOpen} aria-controls={`contact-faq-answer-${index}`} onClick={() => setOpenFaq(isOpen ? null : index)}>{faq.question}<ChevronDown size={16} /></button></h3>{isOpen && <div className="contact-faq-answer" id={`contact-faq-answer-${index}`}><p>{faq.answer}</p></div>}</article>; })}</div></section>
        </aside>
      </section>
      <div className="contact-bottom-note container"><Sparkles size={16} /><span>Every perspective helps us build a more thoughtful experience.</span></div>
    </div>
  );
}
