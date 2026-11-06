import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function NotFoundContent() {
  return <div className="not-found-page"><div className="not-found-rings" aria-hidden="true"><span /><span /><span /><i /></div><div className="not-found-content"><span className="not-found-kicker">SIGNAL NOT FOUND</span><h1>404</h1><p>This page isn’t in your awareness field.</p><Link href="/" className="not-found-home"><ArrowLeft size={16} /> Return home</Link></div></div>;
}
