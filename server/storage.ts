import {
  users,
  toolCategories,
  tools,
  toolUsage,
  aiToolRequests,
  userFavorites,
  toolReviews,
  type User,
  type UpsertUser,
  type ToolCategory,
  type Tool,
  type ToolUsage,
  type AiToolRequest,
  type UserFavorite,
  type ToolReview,
  type InsertToolCategory,
  type InsertTool,
  type InsertToolUsage,
  type InsertAiToolRequest,
  type InsertUserFavorite,
  type InsertToolReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Tool Category operations
  getToolCategories(): Promise<ToolCategory[]>;
  createToolCategory(category: InsertToolCategory): Promise<ToolCategory>;
  getToolCategory(id: number): Promise<ToolCategory | undefined>;
  getToolCategoryBySlug(slug: string): Promise<ToolCategory | undefined>;

  // Tool operations
  getTools(categoryId?: number, limit?: number, offset?: number): Promise<Tool[]>;
  getToolsByCategory(categoryId: number): Promise<Tool[]>;
  getFreeTools(): Promise<Tool[]>;
  getPremiumTools(): Promise<Tool[]>;
  getPopularTools(limit?: number): Promise<Tool[]>;
  getRecentTools(limit?: number): Promise<Tool[]>;
  searchTools(query: string): Promise<Tool[]>;
  getTool(id: number): Promise<Tool | undefined>;
  getToolBySlug(slug: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: number, tool: Partial<InsertTool>): Promise<Tool>;
  incrementToolUsage(toolId: number): Promise<void>;

  // Tool usage operations
  recordToolUsage(usage: InsertToolUsage): Promise<ToolUsage>;
  getUserToolUsage(userId: string): Promise<ToolUsage[]>;
  getToolUsageStats(toolId: number): Promise<{ count: number; uniqueUsers: number }>;

  // AI Tool Request operations
  createAiToolRequest(request: InsertAiToolRequest): Promise<AiToolRequest>;
  getAiToolRequest(id: number): Promise<AiToolRequest | undefined>;
  updateAiToolRequest(id: number, request: Partial<InsertAiToolRequest>): Promise<AiToolRequest>;
  getUserAiToolRequests(userId: string): Promise<AiToolRequest[]>;

  // User favorites operations
  addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeUserFavorite(userId: string, toolId: number): Promise<void>;
  getUserFavorites(userId: string): Promise<Tool[]>;
  isToolFavorited(userId: string, toolId: number): Promise<boolean>;

  // Tool reviews operations
  createToolReview(review: InsertToolReview): Promise<ToolReview>;
  getToolReviews(toolId: number): Promise<ToolReview[]>;
  getUserToolReview(userId: string, toolId: number): Promise<ToolReview | undefined>;
  updateToolReview(id: number, review: Partial<InsertToolReview>): Promise<ToolReview>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tool Category operations
  async getToolCategories(): Promise<ToolCategory[]> {
    return await db.select().from(toolCategories).orderBy(asc(toolCategories.name));
  }

  async createToolCategory(category: InsertToolCategory): Promise<ToolCategory> {
    const [newCategory] = await db.insert(toolCategories).values(category).returning();
    return newCategory;
  }

  async getToolCategory(id: number): Promise<ToolCategory | undefined> {
    const [category] = await db.select().from(toolCategories).where(eq(toolCategories.id, id));
    return category;
  }

  async getToolCategoryBySlug(slug: string): Promise<ToolCategory | undefined> {
    const [category] = await db.select().from(toolCategories).where(eq(toolCategories.slug, slug));
    return category;
  }

  // Tool operations
  async getTools(categoryId?: number, limit = 50, offset = 0): Promise<Tool[]> {
    if (categoryId) {
      return await db.select().from(tools)
        .where(and(eq(tools.isActive, true), eq(tools.categoryId, categoryId)))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(tools.usageCount));
    } else {
      return await db.select().from(tools)
        .where(eq(tools.isActive, true))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(tools.usageCount));
    }
  }

  async getToolsByCategory(categoryId: number): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(and(eq(tools.categoryId, categoryId), eq(tools.isActive, true)))
      .orderBy(desc(tools.usageCount));
  }

  async getFreeTools(): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(and(eq(tools.isPremium, false), eq(tools.isActive, true)))
      .limit(10)
      .orderBy(desc(tools.usageCount));
  }

  async getPremiumTools(): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(and(eq(tools.isPremium, true), eq(tools.isActive, true)))
      .orderBy(desc(tools.usageCount));
  }

  async getPopularTools(limit = 10): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(eq(tools.isActive, true))
      .limit(limit)
      .orderBy(desc(tools.usageCount));
  }

  async getRecentTools(limit = 10): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(eq(tools.isActive, true))
      .limit(limit)
      .orderBy(desc(tools.createdAt));
  }

  async searchTools(query: string): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .where(
        and(
          eq(tools.isActive, true),
          or(
            like(tools.name, `%${query}%`),
            like(tools.description, `%${query}%`),
            like(tools.shortDescription, `%${query}%`)
          )
        )
      )
      .orderBy(desc(tools.usageCount));
  }

  async getTool(id: number): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool;
  }

  async getToolBySlug(slug: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.slug, slug));
    return tool;
  }

  async createTool(tool: InsertTool): Promise<Tool> {
    const [newTool] = await db.insert(tools).values(tool).returning();
    return newTool;
  }

  async updateTool(id: number, tool: Partial<InsertTool>): Promise<Tool> {
    const [updatedTool] = await db
      .update(tools)
      .set({ ...tool, updatedAt: new Date() })
      .where(eq(tools.id, id))
      .returning();
    return updatedTool;
  }

  async incrementToolUsage(toolId: number): Promise<void> {
    await db
      .update(tools)
      .set({ usageCount: sql`${tools.usageCount} + 1` })
      .where(eq(tools.id, toolId));
  }

  // Tool usage operations
  async recordToolUsage(usage: InsertToolUsage): Promise<ToolUsage> {
    const [newUsage] = await db.insert(toolUsage).values(usage).returning();
    await this.incrementToolUsage(usage.toolId!);
    return newUsage;
  }

  async getUserToolUsage(userId: string): Promise<ToolUsage[]> {
    return await db
      .select()
      .from(toolUsage)
      .where(eq(toolUsage.userId, userId))
      .orderBy(desc(toolUsage.usedAt));
  }

  async getToolUsageStats(toolId: number): Promise<{ count: number; uniqueUsers: number }> {
    const [stats] = await db
      .select({
        count: sql<number>`count(*)`,
        uniqueUsers: sql<number>`count(distinct ${toolUsage.userId})`
      })
      .from(toolUsage)
      .where(eq(toolUsage.toolId, toolId));
    
    return stats || { count: 0, uniqueUsers: 0 };
  }

  // AI Tool Request operations
  async createAiToolRequest(request: InsertAiToolRequest): Promise<AiToolRequest> {
    const [newRequest] = await db.insert(aiToolRequests).values(request).returning();
    return newRequest;
  }

  async getAiToolRequest(id: number): Promise<AiToolRequest | undefined> {
    const [request] = await db.select().from(aiToolRequests).where(eq(aiToolRequests.id, id));
    return request;
  }

  async updateAiToolRequest(id: number, request: Partial<InsertAiToolRequest>): Promise<AiToolRequest> {
    const [updatedRequest] = await db
      .update(aiToolRequests)
      .set(request)
      .where(eq(aiToolRequests.id, id))
      .returning();
    return updatedRequest;
  }

  async getUserAiToolRequests(userId: string): Promise<AiToolRequest[]> {
    return await db
      .select()
      .from(aiToolRequests)
      .where(eq(aiToolRequests.userId, userId))
      .orderBy(desc(aiToolRequests.requestedAt));
  }

  // User favorites operations
  async addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const [newFavorite] = await db.insert(userFavorites).values(favorite).returning();
    return newFavorite;
  }

  async removeUserFavorite(userId: string, toolId: number): Promise<void> {
    await db
      .delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.toolId, toolId)));
  }

  async getUserFavorites(userId: string): Promise<Tool[]> {
    return await db
      .select({
        id: tools.id,
        name: tools.name,
        slug: tools.slug,
        description: tools.description,
        shortDescription: tools.shortDescription,
        categoryId: tools.categoryId,
        icon: tools.icon,
        isPremium: tools.isPremium,
        isAiGenerated: tools.isAiGenerated,
        usageCount: tools.usageCount,
        rating: tools.rating,
        reviewCount: tools.reviewCount,
        tags: tools.tags,
        metadata: tools.metadata,
        isActive: tools.isActive,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
      })
      .from(userFavorites)
      .innerJoin(tools, eq(userFavorites.toolId, tools.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
  }

  async isToolFavorited(userId: string, toolId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.toolId, toolId)));
    return !!favorite;
  }

  // Tool reviews operations
  async createToolReview(review: InsertToolReview): Promise<ToolReview> {
    const [newReview] = await db.insert(toolReviews).values(review).returning();
    
    // Update tool rating and review count
    const [stats] = await db
      .select({
        avgRating: sql<number>`avg(${toolReviews.rating})`,
        reviewCount: sql<number>`count(*)`
      })
      .from(toolReviews)
      .where(eq(toolReviews.toolId, review.toolId!));
    
    await db
      .update(tools)
      .set({
        rating: Math.round(stats.avgRating),
        reviewCount: stats.reviewCount
      })
      .where(eq(tools.id, review.toolId!));
    
    return newReview;
  }

  async getToolReviews(toolId: number): Promise<ToolReview[]> {
    return await db
      .select()
      .from(toolReviews)
      .where(eq(toolReviews.toolId, toolId))
      .orderBy(desc(toolReviews.createdAt));
  }

  async getUserToolReview(userId: string, toolId: number): Promise<ToolReview | undefined> {
    const [review] = await db
      .select()
      .from(toolReviews)
      .where(and(eq(toolReviews.userId, userId), eq(toolReviews.toolId, toolId)));
    return review;
  }

  async updateToolReview(id: number, review: Partial<InsertToolReview>): Promise<ToolReview> {
    const [updatedReview] = await db
      .update(toolReviews)
      .set(review)
      .where(eq(toolReviews.id, id))
      .returning();
    return updatedReview;
  }
}

export const storage = new DatabaseStorage();
