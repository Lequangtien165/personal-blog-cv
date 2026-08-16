import Link from "next/link";
import { SubpageShell } from "@/components/terminal/subpage-shell";

export default function NotFound() {
  return (
    <SubpageShell module="404">
      <div style={{ marginBottom: "12px" }}>
        <span style={{ color: "var(--accent)" }}>$</span> cat /dev/null
      </div>

      <p
        style={{
          fontSize: "48px",
          fontWeight: 500,
          color: "var(--fg)",
          lineHeight: 1,
        }}
      >
        404
      </p>
      <p
        style={{
          marginTop: "12px",
          marginBottom: "24px",
          fontSize: "13px",
          color: "var(--dim)",
        }}
      >
        File not found — trang bạn tìm kiếm không tồn tại hoặc đã bị di
        chuyển.
      </p>

      <Link
        href="/"
        className="open-btn"
        style={{ textDecoration: "none" }}
      >
        $ cd / [HOME]
      </Link>
    </SubpageShell>
  );
}