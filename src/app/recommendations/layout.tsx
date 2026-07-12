import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommendations | Fran Peruso",
  description:
    "What colleagues and clients say about working with Fran Peruso — professional testimonials and recommendations.",
};

export default function RecommendationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
