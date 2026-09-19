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
          <span>TITLE</span>
          <span>SIZE</span>
          <span>DATE</span>
          <span>SUMMARY</span>
        </div>

        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="file-row journal-row"
            aria-label={`Đọc bài: ${post.title}`}
          >
            <span className="file-name journal-title">
              {post.title}
            </span>
            <span className="file-size">{post.readingTime}</span>
            <span className="file-date">{post.date}</span>
            <span className="journal-summary">
              <span className="dimtext">{post.summary}</span>
              <span className="journal-read-link">[ĐỌC BÀI]</span>
            </span>
          </a>
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
