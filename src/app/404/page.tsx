import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "404 — Lost in perception | Percepta",
  description: "This page isn’t in your awareness field. Return to Percepta’s home page.",
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}
