import { getCvHtml } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "CV cá nhân",
};

export default async function CvPage() {
  const html = await getCvHtml();

  return (
    <main className="container">
      <article className="prose post-page" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
