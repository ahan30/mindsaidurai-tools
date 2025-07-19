import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

interface SearchBarProps {
  onAuthRequired?: () => void;
}

export default function SearchBar({ onAuthRequired }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const suggestions = [
    "PDF Merger",
    "Image Upscaler", 
    "Video Converter",
    "Background Remover",
    "QR Code Generator",
    "Resume Builder",
    "Logo Maker",
    "Audio Compressor"
  ];

  // AI tool request mutation
  const aiRequestMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      return await apiRequest('POST', '/api/ai-tools/request', {
        query: searchQuery,
        metadata: { source: 'search-bar' }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "AI Tool Request Submitted",
        description: "Our AI is analyzing your request. You'll be notified when the tool is ready!",
      });
      setQuery("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        if (onAuthRequired) {
          onAuthRequired();
        } else {
          toast({
            title: "Unauthorized",
            description: "You are logged out. Logging in again...",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 500);
        }
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit AI tool request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // First, try to search existing tools
    setLocation(`/tools?search=${encodeURIComponent(query.trim())}`);
    
    // If authenticated, also submit AI request for potential new tool generation
    if (isAuthenticated && query.trim().length > 3) {
      aiRequestMutation.mutate(query.trim());
    } else if (!isAuthenticated && query.trim().length > 3) {
      // For non-authenticated users, show a toast about AI features
      toast({
        title: "AI Tool Generation Available",
        description: "Sign in to unlock AI-powered tool generation for custom tools!",
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setLocation(`/tools?search=${encodeURIComponent(suggestion)}`);
  };

  const handleGenerate = () => {
    if (!query.trim()) {
      toast({
        title: "Enter a Description",
        description: "Please describe the tool you need before generating.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        toast({
          title: "Sign In Required",
          description: "Please sign in to use AI tool generation.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
      return;
    }

    aiRequestMutation.mutate(query.trim());
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="glass rounded-2xl p-2 flex items-center">
          <div className="flex-1 flex items-center">
            <i className="fas fa-search text-gray-400 ml-4 mr-3"></i>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search or describe any tool you need..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none focus:ring-0 py-3"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-search"></i>
            </Button>
            
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={aiRequestMutation.isPending}
              className="px-6 py-3 gradient-primary rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {aiRequestMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-magic-wand-sparkles mr-2"></i>
              )}
              Generate
            </Button>
          </div>
        </div>
      </form>
      
      {/* AI Suggestions */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-4 z-50"
        >
          <div className="text-sm text-gray-400 mb-2 flex items-center">
            <i className="fas fa-magic-wand-sparkles mr-2 text-purple-400"></i>
            AI Suggestions:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-purple-500/20 hover:border-purple-400/50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
          
          {!isAuthenticated && (
            <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center text-sm text-purple-400">
                <i className="fas fa-info-circle mr-2"></i>
                <span>Sign in to unlock AI-powered tool generation!</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
