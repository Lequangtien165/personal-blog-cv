import Link from "next/link";
import { PageShell } from "@/components/site/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="page-head">
        <h1 className="display">
          404<span className="dot-accent">.</span>
        </h1>
        <p className="lede">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>
      <Link href="/" className="btn btn-solid">
        ← Back home
      </Link>
    </PageShell>
  );
}
