import { getAllPosts } from "@/lib/content";
import { TerminalPortfolio } from "@/components/terminal/terminal-portfolio";

export default function HomePage() {
  const posts = getAllPosts();
  return <TerminalPortfolio posts={posts} />;
}