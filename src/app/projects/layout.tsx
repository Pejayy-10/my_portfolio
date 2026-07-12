import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Fran Peruso",
  description:
    "Explore Fran Peruso's software projects — offline-first apps, multi-tenant SaaS platforms, distributed systems, and mobile solutions.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
