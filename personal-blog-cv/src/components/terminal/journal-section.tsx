import Link from "next/link";
import type { PostMeta } from "@/lib/content";

interface JournalSectionProps {
  posts: PostMeta[];
}

export function JournalSection({ posts }: JournalSectionProps) {
  return (
    <div id="page-journal">
      <div>
        <span className="cmd-prompt">$</span> ls -la /journal/
      </div>
      <div
        className="dimtext"
        style={{ fontSize: "12px", margin: "6px 0 4px" }}
      >
        .md — notes on building reliable systems
      </div>

      <div className="file-table">
        <div className="file-row hdr">
          <span>NAME</span>
          <span>SIZE</span>
          <span>DATE</span>
          <span>SUMMARY</span>
        </div>

        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="file-row"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="file-name" style={{ cursor: "pointer" }}>
              {post.slug}.md
            </span>
            <span className="file-size">{post.readingTime}</span>
            <span className="file-date">{post.date}</span>
            <span className="dimtext">{post.summary}</span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/blog" className="open-btn" style={{ textDecoration: "none" }}>
          $ cd /journal → [OPEN ALL]
        </Link>
      </div>
    </div>
  );
}