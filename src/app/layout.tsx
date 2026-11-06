import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

export const metadata: Metadata = { title: "Percepta — Experience the web more clearly", description: "A more accessible, intuitive way to experience the web." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar /><PageTransition><main>{children}</main></PageTransition><Footer /></body></html>;
}
