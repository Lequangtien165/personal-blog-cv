import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Quang Tiến - Blog & CV",
  description: "Blog cá nhân, dự án, và hồ sơ của Quang Tiến",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <nav className="nav">
          <Link href="/">Quang Tiến</Link>
          <Link href="/">Blog</Link>
          <Link href="/cv">CV</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}