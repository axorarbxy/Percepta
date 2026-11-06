import Link from "next/link";
import { Container } from "@/components/ui";

export function Footer() {
  return <footer className="footer"><Container className="footer__inner">
    <div><Link className="brand brand--light" href="/"><span className="brand__mark">P</span><span>PERCEPTA</span></Link><p className="footer__tagline">A clearer way to experience the web.</p></div>
    <nav className="footer__links" aria-label="Footer navigation"><Link href="#product">Product</Link><Link href="#accessibility">Accessibility</Link><Link href="/pricing">Pricing</Link><Link href="#about">About</Link></nav>
    <p className="footer__copyright">© {new Date().getFullYear()} Percepta. All rights reserved.</p>
  </Container></footer>;
}
