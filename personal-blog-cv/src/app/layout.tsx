import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Personal Blog & CV",
  description: "Blog cá nhân và CV",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <nav className="nav">
          <Link href="/">Blog</Link>
          <Link href="/cv">CV</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}