import type { Metadata } from "next";
import ContactExperience from "./contact-experience";

export const metadata: Metadata = {
  title: "Contact Percepta | Talk to us",
  description: "Get in touch with the Percepta team about early access, accessibility, partnerships, or product questions.",
};

export default function ContactPage() {
  return <ContactExperience />;
}
