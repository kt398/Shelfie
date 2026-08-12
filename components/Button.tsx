// components/Button.tsx
"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  // For option/toggle buttons (e.g. one of a set of choices). When provided,
  // this overrides `variant` and sets aria-pressed for toggle semantics.
  selected?: boolean;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
  secondary:
    "border border-border bg-background text-foreground hover:bg-muted active:bg-muted/70",
  ghost:
    "text-muted-foreground hover:bg-muted active:bg-muted/70",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
};

export default function Button({
  variant = "primary",
  selected,
  className = "",
  ...props
}: ButtonProps) {
  const stateClasses =
    selected === undefined ? variants[variant] : selected ? variants.primary : variants.secondary;

  return (
    <button
      aria-pressed={selected}
      className={`rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${stateClasses} ${className}`}
      {...props}
    />
  );
}