import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & { children: ReactNode };
export function Container({ className = "", children, ...props }: ContainerProps) {
  return <div className={`container ${className}`.trim()} {...props}>{children}</div>;
}

type SectionProps = HTMLAttributes<HTMLElement> & { children: ReactNode };
export function Section({ className = "", children, ...props }: SectionProps) {
  return <section className={`section ${className}`.trim()} {...props}>{children}</section>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "danger" | "ghost"; children: ReactNode };
export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className}`.trim()} {...props}>{children}</button>;
}
