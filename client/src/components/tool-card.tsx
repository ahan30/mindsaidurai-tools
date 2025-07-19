import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

interface Tool {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  isPremium: boolean;
  isAiGenerated?: boolean;
  rating?: number;
  reviewCount?: number;
  usageCount?: number;
  icon?: string;
  image?: string;
}

interface ToolCardProps {
  tool: Tool;
  onAuthRequired?: () => void;
}

export default function ToolCard({ tool, onAuthRequired }: ToolCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  // Tool usage mutation
  const useToolMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/tools/${tool.id}/use`, {
        metadata: { source: 'tool-card' }
      });
    },
    onSuccess: () => {
      toast({
        title: "Tool Used Successfully",
        description: `${tool.name} is now ready to use.`,
      });
      // Invalidate queries to update usage count
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error("Error using tool:", error);
      toast({
        title: "Error",
        description: "Failed to use tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUseTool = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (tool.isPremium && !isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        toast({
          title: "Premium Tool",
          description: "Please sign in to use premium tools.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
      return;
    }
    
    useToolMutation.mutate();
  };

  const getToolImage = () => {
    if (tool.image) return tool.image;
    
    // Default images based on tool category/type
    const defaultImages = [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
    ];
    
    return defaultImages[tool.id % defaultImages.length];
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/tool/${tool.slug}`}>
        <Card 
          className="glass border-white/10 hover:bg-white/10 transition-all cursor-pointer overflow-hidden group card-responsive"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tool Image */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img
              src={getToolImage()}
              alt={tool.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge 
                variant={tool.isPremium ? "secondary" : "default"}
                className={tool.isPremium ? "bg-yellow-500/90 text-black" : "bg-green-500/90 text-white"}
              >
                {tool.isPremium ? 'Premium' : 'Free'}
              </Badge>
              
              {tool.isAiGenerated && (
                <Badge className="bg-purple-500/90 text-white">
                  <i className="fas fa-magic-wand-sparkles mr-1 text-xs"></i>
                  AI
                </Badge>
              )}
            </div>

            {/* Quick Action Button */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="icon"
                onClick={handleUseTool}
                disabled={useToolMutation.isPending}
                className="glass bg-white/20 hover:bg-white/30 border-white/20 text-white btn-touch"
              >
                {useToolMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-play"></i>
                )}
              </Button>
            </motion.div>
          </div>

          <CardContent className="p-4 md:p-6">
            {/* Tool Header */}
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors truncate">
                  {tool.name}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                  {tool.shortDescription || tool.description}
                </p>
              </div>
              
              <div className="w-10 h-10 md:w-12 md:h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 ml-3 md:ml-4">
                <i className={`${tool.icon || 'fas fa-tools'} text-white text-sm md:text-base`}></i>
              </div>
            </div>

            {/* Tool Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-400">
                {tool.rating && tool.reviewCount ? (
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span>{tool.rating}/5</span>
                    <span className="ml-1 hidden sm:inline">({tool.reviewCount})</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <i className="fas fa-star text-gray-600 mr-1"></i>
                    <span className="hidden sm:inline">No reviews</span>
                    <span className="sm:hidden">New</span>
                  </div>
                )}
                
                {tool.usageCount && (
                  <div className="flex items-center">
                    <i className="fas fa-chart-line mr-1"></i>
                    <span className="hidden sm:inline">{tool.usageCount.toLocaleString()} uses</span>
                    <span className="sm:hidden">{tool.usageCount > 1000 ? `${Math.floor(tool.usageCount/1000)}k` : tool.usageCount}</span>
                  </div>
                )}
              </div>

              <Button
                size="sm"
                onClick={handleUseTool}
                disabled={useToolMutation.isPending}
                className="gradient-primary hover:shadow-lg hover:shadow-purple-500/25 transition-all btn-touch w-full sm:w-auto"
              >
                {useToolMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-play mr-2"></i>
                )}
                <span className="hidden sm:inline">
                  {tool.isPremium && !isAuthenticated ? 'Try Premium' : 'Use Tool'}
                </span>
                <span className="sm:hidden">
                  {tool.isPremium && !isAuthenticated ? 'Premium' : 'Use'}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
