"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/app/");

  if (isDashboard) return <>{children}</>;

  return <>
    <Navbar />
    <PageTransition><main>{children}</main></PageTransition>
    <Footer />
  </>;
}
