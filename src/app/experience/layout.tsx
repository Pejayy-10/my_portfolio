import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience | Fran Peruso",
  description:
    "Fran Peruso's professional work history — software engineering roles, companies, technologies, and key achievements.",
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
