"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { post_ratings, posts, users } from "@/lib/db/schema";
import { avg, count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPosts() {
  const entries = await db
    .select({
      id: posts.id,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      author_name: sql<string>`coalesce(${users.name}, ${posts.author_name})`,
      created_at: posts.created_at,
      rating_average: avg(post_ratings.rating),
      rating_count: count(post_ratings.id),
    })
    .from(posts)
    .leftJoin(users, eq(posts.user_id, users.id))
    .leftJoin(post_ratings, eq(posts.id, post_ratings.post_id))
    .groupBy(posts.id)
    .orderBy(desc(posts.created_at));

  return entries.map((entry) => ({
    ...entry,
    created_at: entry.created_at?.toISOString() ?? null,
  }));
}

export async function createPost(input: { title: string; excerpt: string; content: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Sign in required");

  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const content = input.content.trim();
  if (!title || !excerpt || !content) throw new Error("Title, excerpt, and write-up are required");
  if (!session.user.email) throw new Error("A verified email is required to publish");

  const userId = session.user.email;
  await db.insert(users).values({
    id: userId,
    email: session.user.email,
    name: session.user.name ?? "JesusBaby community",
    image: session.user.image,
  }).onConflictDoUpdate({
    target: users.email,
    set: {
      name: session.user.name ?? "JesusBaby community",
      image: session.user.image,
      updated_at: new Date(),
    },
  });

  const [post] = await db.insert(posts).values({
    title,
    excerpt,
    content,
    user_id: userId,
    author_name: session.user.name ?? "JesusBaby community",
    author_email: session.user.email,
  }).returning();

  revalidatePath("/blog");
  revalidatePath("/journal");
  return {
    ...post,
    created_at: post.created_at?.toISOString() ?? null,
  };
}

export async function ratePost(postId: number, rating: number) {
  if (!Number.isInteger(postId) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be a whole number from 1 to 5");
  }

  const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId));
  if (!post) throw new Error("Post not found");

  const session = await auth();
  let userId: string | undefined;
  if (session?.user?.email) {
    userId = session.user.email;
    await db.insert(users).values({
      id: userId,
      email: session.user.email,
      name: session.user.name ?? "JesusBaby community",
      image: session.user.image,
    }).onConflictDoUpdate({
      target: users.email,
      set: { name: session.user.name ?? "JesusBaby community", image: session.user.image, updated_at: new Date() },
    });
  }

  await db.insert(post_ratings).values({ post_id: postId, rating, user_id: userId });
  revalidatePath("/journal");
  return { ok: true };
}