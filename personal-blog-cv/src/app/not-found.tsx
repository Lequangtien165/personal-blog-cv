import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container">
      <div className="not-found">
        <p className="not-found-code">404</p>
        <h1>Không tìm thấy trang</h1>
        <p className="not-found-desc">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
