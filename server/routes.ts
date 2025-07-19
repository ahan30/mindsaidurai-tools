import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertToolUsageSchema, insertAiToolRequestSchema, insertUserFavoriteSchema, insertToolReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tool Categories routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getToolCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/categories/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getToolCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Tools routes
  app.get('/api/tools', async (req, res) => {
    try {
      const { category, limit = '50', offset = '0', type } = req.query;
      const categoryId = category ? parseInt(category as string) : undefined;
      const limitNum = parseInt(limit as string);
      const offsetNum = parseInt(offset as string);

      let tools;
      if (type === 'free') {
        tools = await storage.getFreeTools();
      } else if (type === 'premium') {
        tools = await storage.getPremiumTools();
      } else if (type === 'popular') {
        tools = await storage.getPopularTools(limitNum);
      } else if (type === 'recent') {
        tools = await storage.getRecentTools(limitNum);
      } else {
        tools = await storage.getTools(categoryId, limitNum, offsetNum);
      }

      res.json(tools);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  app.get('/api/tools/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const tools = await storage.searchTools(q);
      res.json(tools);
    } catch (error) {
      console.error("Error searching tools:", error);
      res.status(500).json({ message: "Failed to search tools" });
    }
  });

  app.get('/api/tools/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const tool = await storage.getToolBySlug(slug);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      console.error("Error fetching tool:", error);
      res.status(500).json({ message: "Failed to fetch tool" });
    }
  });

  // Tool usage tracking
  app.post('/api/tools/:id/use', async (req, res) => {
    try {
      const { id } = req.params;
      const toolId = parseInt(id);
      
      // Optional auth - record usage if user is logged in
      let userId = null;
      if (req.isAuthenticated && req.isAuthenticated()) {
        userId = (req.user as any)?.claims?.sub;
      }

      const usage = await storage.recordToolUsage({
        userId,
        toolId,
        sessionId: req.sessionID,
        metadata: req.body.metadata || null,
      });

      res.json(usage);
    } catch (error) {
      console.error("Error recording tool usage:", error);
      res.status(500).json({ message: "Failed to record tool usage" });
    }
  });

  // AI Tool Request routes (protected)
  app.post('/api/ai-tools/request', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { query, metadata } = insertAiToolRequestSchema.parse(req.body);
      
      const aiRequest = await storage.createAiToolRequest({
        userId,
        query,
        metadata,
      });

      res.json(aiRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating AI tool request:", error);
      res.status(500).json({ message: "Failed to create AI tool request" });
    }
  });

  app.get('/api/ai-tools/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getUserAiToolRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching AI tool requests:", error);
      res.status(500).json({ message: "Failed to fetch AI tool requests" });
    }
  });

  // User favorites routes (protected)
  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { toolId } = insertUserFavoriteSchema.parse(req.body);
      
      const favorite = await storage.addUserFavorite({
        userId,
        toolId,
      });

      res.json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:toolId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const toolId = parseInt(req.params.toolId);
      
      await storage.removeUserFavorite(userId, toolId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.get('/api/favorites/:toolId/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const toolId = parseInt(req.params.toolId);
      
      const isFavorited = await storage.isToolFavorited(userId, toolId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: "Failed to check favorite" });
    }
  });

  // Tool reviews routes (protected)
  app.post('/api/tools/:toolId/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const toolId = parseInt(req.params.toolId);
      const { rating, comment } = insertToolReviewSchema.parse(req.body);
      
      // Check if user already reviewed this tool
      const existingReview = await storage.getUserToolReview(userId, toolId);
      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this tool" });
      }

      const review = await storage.createToolReview({
        userId,
        toolId,
        rating,
        comment,
      });

      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/tools/:toolId/reviews', async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      const reviews = await storage.getToolReviews(toolId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/popular-tools', async (req, res) => {
    try {
      const { limit = '10' } = req.query;
      const tools = await storage.getPopularTools(parseInt(limit as string));
      res.json(tools);
    } catch (error) {
      console.error("Error fetching popular tools:", error);
      res.status(500).json({ message: "Failed to fetch popular tools" });
    }
  });

  app.get('/api/user/usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const usage = await storage.getUserToolUsage(userId);
      res.json(usage);
    } catch (error) {
      console.error("Error fetching user usage:", error);
      res.status(500).json({ message: "Failed to fetch user usage" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
