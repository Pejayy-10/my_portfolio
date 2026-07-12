import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stack | Fran Peruso",
  description:
    "Fran Peruso's technical stack — frameworks, languages, databases, and tools used in production systems.",
};

export default function StackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
