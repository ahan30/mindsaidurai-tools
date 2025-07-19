import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import SearchBar from "@/components/search-bar";
import ToolCard from "@/components/tool-card";
import CategoryCard from "@/components/category-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tools() {
  const { category: categorySlug } = useParams();
  const [location, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("popular");
  const [filterBy, setFilterBy] = useState("all");

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    retry: false,
  });

  // Get current category
  const currentCategory = categories?.find(cat => cat.slug === categorySlug);

  // Fetch tools based on current category and filters
  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: ['/api/tools', { 
      category: currentCategory?.id,
      type: sortBy === 'popular' ? 'popular' : sortBy === 'recent' ? 'recent' : undefined,
      limit: '50'
    }],
    retry: false,
    enabled: !categorySlug || !!currentCategory,
  });

  // Filter tools based on premium/free filter
  const filteredTools = tools?.filter(tool => {
    if (filterBy === 'free') return !tool.isPremium;
    if (filterBy === 'premium') return tool.isPremium;
    return true;
  });

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      setLocation('/tools');
    } else {
      setLocation(`/tools/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-12 gradient-mesh">
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {currentCategory ? (
              <>
                <div className={`w-20 h-20 bg-gradient-to-r ${currentCategory.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <i className={`${currentCategory.icon} text-white text-3xl`}></i>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {currentCategory.name}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {currentCategory.description}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  All <span className="text-gradient-primary">Tools</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Discover our complete collection of AI-powered tools
                </p>
              </>
            )}
            
            <SearchBar />
          </motion.div>
        </div>
      </section>

      <div className="container-responsive py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Mobile Responsive */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="glass border-white/10 lg:sticky lg:top-24">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !categorySlug ? 'bg-purple-600/20 text-purple-400' : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    All Tools
                  </button>
                  
                  {categoriesLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 bg-slate-700" />
                    ))
                  ) : (
                    categories?.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          categorySlug === category.slug 
                            ? 'bg-purple-600/20 text-purple-400' 
                            : 'hover:bg-white/5 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {category.toolCount}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <hr className="border-white/10 my-6" />

                <h4 className="font-semibold mb-3">Filter</h4>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-white/20">
                    <SelectItem value="all">All Tools</SelectItem>
                    <SelectItem value="free">Free Only</SelectItem>
                    <SelectItem value="premium">Premium Only</SelectItem>
                  </SelectContent>
                </Select>

                <h4 className="font-semibold mb-3 mt-4">Sort By</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-dark border-white/20">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {currentCategory ? currentCategory.name : 'All Tools'}
                </h2>
                <p className="text-gray-400">
                  {filteredTools ? (
                    `${filteredTools.length} tools found`
                  ) : (
                    'Loading tools...'
                  )}
                </p>
              </div>
            </div>

            {/* Tools Grid - Mobile Responsive */}
            {toolsLoading ? (
              <div className="grid-responsive-tools">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl overflow-hidden">
                    <Skeleton className="w-full h-40 sm:h-48 bg-slate-700" />
                    <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                      <Skeleton className="h-5 md:h-6 bg-slate-700" />
                      <Skeleton className="h-3 md:h-4 bg-slate-700" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 md:h-4 w-20 md:w-24 bg-slate-700" />
                        <Skeleton className="h-7 md:h-8 w-16 md:w-20 bg-slate-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTools && filteredTools.length > 0 ? (
              <motion.div 
                className="grid-responsive-tools"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ToolCard tool={tool} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="glass border-white/10 p-12 text-center">
                <div className="text-gray-400">
                  <i className="fas fa-search text-6xl mb-6 opacity-50"></i>
                  <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                  <p className="text-sm">
                    {currentCategory 
                      ? `No tools available in ${currentCategory.name} category yet.`
                      : 'Try adjusting your filters or search criteria.'
                    }
                  </p>
                  {currentCategory && (
                    <Button className="mt-6 gradient-primary">
                      <i className="fas fa-magic-wand-sparkles mr-2"></i>
                      Request AI to Create Tools
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
