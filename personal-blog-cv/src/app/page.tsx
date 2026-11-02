import { getAllPosts } from "@/lib/content";
import { HomePage } from "@/components/site/home-page";

export default function Page() {
  const posts = getAllPosts();
  return <HomePage posts={posts} />;
}
