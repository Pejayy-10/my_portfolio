import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliations | Fran Peruso",
  description:
    "Fran Peruso's professional affiliations, organizations, and community memberships.",
};

export default function AffiliationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
