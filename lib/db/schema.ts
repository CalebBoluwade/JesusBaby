import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. Define a table
export const testimonies = sqliteTable('testimonies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  addiction: text('addiction').notNull(),
  story: text('story').notNull(),
  video_url: text('video_url'),
  created_at: integer('created_at', { mode: 'timestamp' }).default(new Date()),
});

export const newsletters = sqliteTable('newsletters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  subscribed_at: integer('subscribed_at', { mode: 'timestamp' }).default(new Date()),
  unsubscribed_at: integer('unsubscribed_at', { mode: 'timestamp' }),
});

export const bible_verses = sqliteTable('bible_verses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  book: text('book').notNull(),
  verse: text('verse').notNull(),
  verse_text: text('verse_text').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).default(new Date()),
});
