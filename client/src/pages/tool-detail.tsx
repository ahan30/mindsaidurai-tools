import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ToolWorkspace from "@/components/tool-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

export default function ToolDetail() {
  const { slug } = useParams();
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Fetch tool details
  const { data: tool, isLoading: toolLoading, error } = useQuery({
    queryKey: ['/api/tools', slug],
    retry: false,
    enabled: !!slug,
  });

  // Fetch tool reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/tools', tool?.id, 'reviews'],
    retry: false,
    enabled: !!tool?.id,
  });

  // Check if tool is favorited (only if authenticated)
  const { data: favoriteCheck } = useQuery({
    queryKey: ['/api/favorites', tool?.id, 'check'],
    retry: false,
    enabled: !!tool?.id && isAuthenticated,
  });

  // Tool usage mutation
  const useToolMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/tools/${tool?.id}/use`, {
        metadata: { source: 'tool-detail' }
      });
    },
    onSuccess: () => {
      toast({
        title: "Tool Used Successfully",
        description: "Tool usage has been recorded.",
      });
      // Invalidate tool data to update usage count
      queryClient.invalidateQueries({ queryKey: ['/api/tools', slug] });
    },
    onError: (error) => {
      console.error("Error using tool:", error);
      toast({
        title: "Error",
        description: "Failed to use tool. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Favorite toggle mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteCheck?.isFavorited) {
        await apiRequest('DELETE', `/api/favorites/${tool?.id}`);
      } else {
        await apiRequest('POST', '/api/favorites', { toolId: tool?.id });
      }
    },
    onSuccess: () => {
      toast({
        title: favoriteCheck?.isFavorited ? "Removed from favorites" : "Added to favorites",
        description: favoriteCheck?.isFavorited 
          ? "Tool removed from your favorites" 
          : "Tool added to your favorites",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', tool?.id, 'check'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
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
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Review submission mutation
  const reviewMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/tools/${tool?.id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ['/api/tools', tool?.id, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tools', slug] });
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
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUseTool = () => {
    if (tool?.isPremium && !isAuthenticated) {
      toast({
        title: "Premium Tool",
        description: "Please sign in to use premium tools.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    useToolMutation.mutate();
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    favoriteMutation.mutate();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to submit reviews.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    if (reviewComment.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    reviewMutation.mutate();
  };

  if (error || (!toolLoading && !tool)) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navigation authenticated={isAuthenticated} />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-md mx-auto">
              <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-6"></i>
              <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
              <p className="text-gray-400 mb-8">
                The tool you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => setLocation('/tools')} className="gradient-primary">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Tools
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      {/* Tool Header */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          {toolLoading ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <Skeleton className="w-24 h-24 rounded-2xl bg-slate-700" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-12 bg-slate-700" />
                  <Skeleton className="h-6 bg-slate-700" />
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-32 bg-slate-700" />
                    <Skeleton className="h-10 w-32 bg-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Tool Icon */}
                <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <i className={`${tool?.icon || 'fas fa-tools'} text-white text-3xl`}></i>
                </div>

                {/* Tool Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">{tool?.name}</h1>
                      <p className="text-xl text-gray-400 mb-4">{tool?.shortDescription}</p>
                    </div>
                    {isAuthenticated && (
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={handleFavoriteToggle}
                        disabled={favoriteMutation.isPending}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <i className={`fas fa-heart ${favoriteCheck?.isFavorited ? '' : 'far'}`}></i>
                      </Button>
                    )}
                  </div>

                  {/* Badges and Stats */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Badge 
                      variant={tool?.isPremium ? "secondary" : "default"}
                      className={tool?.isPremium ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}
                    >
                      {tool?.isPremium ? 'Premium' : 'Free'}
                    </Badge>
                    
                    {tool?.isAiGenerated && (
                      <Badge className="bg-purple-500/20 text-purple-400">
                        <i className="fas fa-magic-wand-sparkles mr-1"></i>
                        AI Generated
                      </Badge>
                    )}

                    <div className="flex items-center text-sm text-gray-400">
                      <i className="fas fa-star text-yellow-400 mr-1"></i>
                      {tool?.rating || 0}/5 ({tool?.reviewCount || 0} reviews)
                    </div>

                    <div className="flex items-center text-sm text-gray-400">
                      <i className="fas fa-chart-line mr-1"></i>
                      {tool?.usageCount || 0} uses
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={handleUseTool}
                      disabled={useToolMutation.isPending}
                      className="gradient-primary px-8 py-3 text-lg"
                    >
                      {useToolMutation.isPending ? (
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fas fa-play mr-2"></i>
                      )}
                      {tool?.isPremium && !isAuthenticated ? 'Sign In to Use' : 'Use Tool'}
                    </Button>
                    
                    <Button variant="outline" className="glass border-white/20">
                      <i className="fas fa-share mr-2"></i>
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Tool Content */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="workspace" className="space-y-8">
            <TabsList className="glass border-white/20">
              <TabsTrigger value="workspace">Use Tool</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({tool?.reviewCount || 0})</TabsTrigger>
              <TabsTrigger value="usage">How to Use</TabsTrigger>
            </TabsList>

            <TabsContent value="workspace" className="space-y-8">
              <ToolWorkspace 
                tool={tool} 
                onUse={() => useToolMutation.mutate()} 
                isLoading={useToolMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="description" className="space-y-8">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>About This Tool</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {tool?.description || 'No detailed description available for this tool yet.'}
                  </p>
                  
                  {tool?.tags && tool.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="border-white/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews List */}
                <div className="lg:col-span-2">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>User Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reviewsLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="border-b border-white/10 pb-4 last:border-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="w-6 h-6 rounded-full bg-slate-700" />
                                <Skeleton className="h-4 w-32 bg-slate-700" />
                              </div>
                              <Skeleton className="h-4 mb-2 bg-slate-700" />
                              <Skeleton className="h-4 w-3/4 bg-slate-700" />
                            </div>
                          ))}
                        </div>
                      ) : reviews && reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map(review => (
                            <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                                    <i className="fas fa-user text-white text-sm"></i>
                                  </div>
                                  <span className="font-medium">Anonymous User</span>
                                </div>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <i 
                                      key={i}
                                      className={`fas fa-star ${
                                        i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-300">{review.comment}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <i className="fas fa-comments text-4xl mb-4 opacity-50"></i>
                          <p>No reviews yet</p>
                          <p className="text-sm">Be the first to review this tool!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Write Review */}
                <div>
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isAuthenticated ? (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setReviewRating(i + 1)}
                                  className={`text-2xl ${
                                    i < reviewRating ? 'text-yellow-400' : 'text-gray-600'
                                  } hover:text-yellow-400 transition-colors`}
                                >
                                  <i className="fas fa-star"></i>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Comment</label>
                            <Textarea 
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience with this tool..."
                              className="glass border-white/20 min-h-24"
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full gradient-primary"
                            disabled={reviewMutation.isPending || reviewComment.trim().length < 10}
                          >
                            {reviewMutation.isPending ? (
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                            ) : (
                              <i className="fas fa-paper-plane mr-2"></i>
                            )}
                            Submit Review
                          </Button>
                        </form>
                      ) : (
                        <div className="text-center py-6">
                          <i className="fas fa-sign-in-alt text-4xl text-gray-400 mb-4"></i>
                          <p className="text-gray-400 mb-4">Sign in to write a review</p>
                          <Button 
                            onClick={() => window.location.href = "/api/login"}
                            className="gradient-primary"
                          >
                            Sign In
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>How to Use This Tool</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Here's a step-by-step guide on how to use the {tool?.name}:
                    </p>
                    
                    <ol className="space-y-4 text-gray-300">
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Click "Use Tool" Button</h4>
                          <p>Start by clicking the "Use Tool" button above to access the tool interface.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Follow the Interface</h4>
                          <p>The tool will provide you with an intuitive interface to complete your task.</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Get Your Results</h4>
                          <p>Once processing is complete, you'll receive your results immediately.</p>
                        </div>
                      </li>
                    </ol>

                    <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-400">💡 Pro Tip</h4>
                      <p className="text-sm text-gray-300">
                        {tool?.isPremium 
                          ? "This is a premium tool with advanced features and faster processing times."
                          : "This free tool has some limitations. Upgrade to Pro for enhanced features."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
