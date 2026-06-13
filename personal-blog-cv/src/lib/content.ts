import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDir = path.join(process.cwd(), "content", "posts");
const cvPath = path.join(process.cwd(), "content", "cv.md");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: String(data.title),
        date: String(data.date),
        summary: String(data.summary),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const raw = fs.readFileSync(path.join(postsDir, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: String(data.title),
      date: String(data.date),
      summary: String(data.summary),
    },
    html: await markdownToHtml(content),
  };
}

export async function getCvHtml() {
  const raw = fs.readFileSync(cvPath, "utf8");
  return markdownToHtml(raw);
}