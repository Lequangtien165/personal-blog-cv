import { getCvHtml } from "@/lib/content";

export const metadata = {
  title: "CV",
  description: "CV cá nhân",
};

export default async function CvPage() {
  const html = await getCvHtml();

  return (
    <main className="container">
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}