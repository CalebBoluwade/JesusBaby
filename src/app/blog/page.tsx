import { auth } from "@/auth";
import BlogWorkspace from "@/components/BlogWorkspace";

export default async function BlogPage() {
  const session = await auth();
  return <BlogWorkspace userName={session?.user?.name ?? "friend"} />;
}