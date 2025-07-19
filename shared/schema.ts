import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan").default("free"), // free, pro, enterprise
  planExpiresAt: timestamp("plan_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tool categories
export const toolCategories = pgTable("tool_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  icon: varchar("icon").notNull(),
  description: text("description"),
  color: varchar("color").notNull(),
  toolCount: integer("tool_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tools
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  shortDescription: varchar("short_description"),
  categoryId: integer("category_id").references(() => toolCategories.id),
  icon: varchar("icon"),
  isPremium: boolean("is_premium").default(false),
  isAiGenerated: boolean("is_ai_generated").default(false),
  usageCount: integer("usage_count").default(0),
  rating: integer("rating").default(0), // out of 5
  reviewCount: integer("review_count").default(0),
  tags: text("tags").array(),
  metadata: jsonb("metadata"), // tool-specific configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User tool usage tracking
export const toolUsage = pgTable("tool_usage", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  toolId: integer("tool_id").references(() => tools.id),
  sessionId: varchar("session_id"),
  usedAt: timestamp("used_at").defaultNow(),
  metadata: jsonb("metadata"), // usage-specific data
});

// AI tool requests (when users request tools that don't exist)
export const aiToolRequests = pgTable("ai_tool_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  query: text("query").notNull(),
  status: varchar("status").default("pending"), // pending, processing, completed, failed
  generatedToolId: integer("generated_tool_id").references(() => tools.id),
  metadata: jsonb("metadata"),
  requestedAt: timestamp("requested_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// User favorites
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  toolId: integer("tool_id").references(() => tools.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tool reviews
export const toolReviews = pgTable("tool_reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  toolId: integer("tool_id").references(() => tools.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertToolCategory = typeof toolCategories.$inferInsert;
export type ToolCategory = typeof toolCategories.$inferSelect;

export type InsertTool = typeof tools.$inferInsert;
export type Tool = typeof tools.$inferSelect;

export type InsertToolUsage = typeof toolUsage.$inferInsert;
export type ToolUsage = typeof toolUsage.$inferSelect;

export type InsertAiToolRequest = typeof aiToolRequests.$inferInsert;
export type AiToolRequest = typeof aiToolRequests.$inferSelect;

export type InsertUserFavorite = typeof userFavorites.$inferInsert;
export type UserFavorite = typeof userFavorites.$inferSelect;

export type InsertToolReview = typeof toolReviews.$inferInsert;
export type ToolReview = typeof toolReviews.$inferSelect;

// Zod schemas
export const insertToolCategorySchema = createInsertSchema(toolCategories);
export const insertToolSchema = createInsertSchema(tools);
export const insertToolUsageSchema = createInsertSchema(toolUsage);
export const insertAiToolRequestSchema = createInsertSchema(aiToolRequests);
export const insertUserFavoriteSchema = createInsertSchema(userFavorites);
export const insertToolReviewSchema = createInsertSchema(toolReviews);
