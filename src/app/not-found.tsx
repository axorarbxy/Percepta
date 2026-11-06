import Link from "next/link";
import { Container, Section } from "@/components/ui";

export default function NotFound() {
  return <Section><Container className="not-found"><p className="label section-kicker">404</p><h1 className="h1">We can’t find that page.</h1><p className="body">The page may have moved, or the link may be out of date.</p><Link className="button button--primary" href="/">Back to home</Link></Container></Section>;
}
