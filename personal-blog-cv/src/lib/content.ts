import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import type { Root, Heading } from "mdast";
import type { Plugin } from "unified";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const postsDir = path.join(process.cwd(), "content", "posts");
const cvPath = path.join(process.cwd(), "content", "cv.md");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
  formattedDate: string;
};

export function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} phút đọc`;
}

const demoteHeadings: Plugin<[], Root> = () => (tree) => {
  visit(tree, "heading", (node: Heading) => {
    if (node.depth < 6) node.depth += 1;
  });
};

export async function markdownToHtml(
  markdown: string,
  options: { demote?: boolean } = {},
): Promise<string> {
  const processor = remark();

  if (options.demote !== false) {
    processor.use(demoteHeadings);
  }

  const result = await processor
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);

      const rawTags = data.tags;

      return {
        slug,
        title: String(data.title),
        date: String(data.date),
        summary: String(data.summary),
        tags: Array.isArray(rawTags) ? rawTags.map(String) : [],
        readingTime: readingTime(content),
        formattedDate: formatDate(String(data.date)),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const raw = fs.readFileSync(path.join(postsDir, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  const rawTags = data.tags;

  return {
    meta: {
      slug,
      title: String(data.title),
      date: String(data.date),
      summary: String(data.summary),
      tags: Array.isArray(rawTags) ? rawTags.map(String) : [],
      readingTime: readingTime(content),
      formattedDate: formatDate(String(data.date)),
    },
    html: await markdownToHtml(content),
  };
}

export async function getCvHtml() {
  const raw = fs.readFileSync(cvPath, "utf8");
  return markdownToHtml(raw, { demote: false });
}
