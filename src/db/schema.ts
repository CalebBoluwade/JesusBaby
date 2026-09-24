import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  image: text("image"),
  created_at: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const testimonies = sqliteTable("testimonies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  addiction: text("addiction").notNull(),
  story: text("story").notNull(),
  video_url: text("video_url"),
  created_at: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const newsletters = sqliteTable("newsletters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  subscribed_at: integer("subscribed_at", { mode: "timestamp" }).default(new Date()),
  unsubscribed_at: integer("unsubscribed_at", { mode: "timestamp" }),
});

export const bible_verses = sqliteTable("bible_verses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  book: text("book").notNull(),
  verse: text("verse").notNull(),
  verse_text: text("verse_text").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  user_id: text("user_id").references(() => users.id),
  author_name: text("author_name").notNull(),
  author_email: text("author_email"),
  created_at: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const post_ratings = sqliteTable("post_ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  post_id: integer("post_id").notNull(),
  user_id: text("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  ratings: many(post_ratings),
}));

export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.user_id], references: [users.id] }),
  ratings: many(post_ratings),
}));

export const postRatingRelations = relations(post_ratings, ({ one }) => ({
  post: one(posts, { fields: [post_ratings.post_id], references: [posts.id] }),
  user: one(users, { fields: [post_ratings.user_id], references: [users.id] }),
}));
