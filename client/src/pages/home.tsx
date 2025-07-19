import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import SearchBar from "@/components/search-bar";
import CategoryCard from "@/components/category-card";
import ToolCard from "@/components/tool-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch data
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const { data: popularTools, isLoading: toolsLoading } = useQuery({
    queryKey: ['/api/tools', { type: 'popular', limit: '6' }],
    retry: false,
  });

  const { data: recentTools, isLoading: recentLoading } = useQuery({
    queryKey: ['/api/tools', { type: 'recent', limit: '4' }],
    retry: false,
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/favorites'],
    retry: false,
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['/api/user/usage'],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />

      {/* Welcome Section */}
      <section className="pt-24 pb-12 gradient-mesh">
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="responsive-large-heading font-bold mb-4 md:mb-6">
              {greeting}, {user?.firstName || user?.email?.split('@')[0] || 'there'}! 👋
            </h1>
            <p className="responsive-text text-gray-300 mb-6 md:mb-8">
              What amazing tool would you like to create or use today?
            </p>
            
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 md:py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {usageLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="glass border-white/10">
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-16 mb-2 bg-slate-700" />
                    <Skeleton className="h-4 bg-slate-700" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="glass border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {usage?.length || 0}
                    </div>
                    <div className="text-gray-400">Tools Used</div>
                  </CardContent>
                </Card>
                <Card className="glass border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {favorites?.length || 0}
                    </div>
                    <div className="text-gray-400">Favorites</div>
                  </CardContent>
                </Card>
                <Card className="glass border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {user?.plan === 'pro' ? '∞' : '50'}
                    </div>
                    <div className="text-gray-400">AI Generations</div>
                  </CardContent>
                </Card>
                <Card className="glass border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {user?.plan === 'free' ? 'Free' : user?.plan === 'pro' ? 'Pro' : 'Enterprise'}
                    </div>
                    <div className="text-gray-400">Current Plan</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-responsive pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* Popular Tools */}
            <section>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="responsive-heading font-bold">
                  Popular <span className="text-gradient-primary">Tools</span>
                </h2>
                <Button variant="outline" className="glass border-white/20 btn-touch">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {toolsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl overflow-hidden">
                      <Skeleton className="w-full h-48 bg-slate-700" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 bg-slate-700" />
                        <Skeleton className="h-4 bg-slate-700" />
                      </div>
                    </div>
                  ))
                ) : (
                  popularTools?.slice(0, 4).map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))
                )}
              </div>
            </section>

            {/* Tool Categories */}
            <section>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="responsive-heading font-bold">
                  Explore <span className="text-gradient-accent">Categories</span>
                </h2>
              </div>
              
              <div className="grid-responsive-categories">
                {categoriesLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="w-16 h-16 rounded-xl bg-slate-700" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 bg-slate-700" />
                          <Skeleton className="h-4 bg-slate-700" />
                          <Skeleton className="h-4 w-20 bg-slate-700" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  categories?.slice(0, 6).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Tools */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-clock mr-2 text-cyan-400"></i>
                  Recently Added
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <Skeleton className="w-10 h-10 rounded-lg bg-slate-700" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 bg-slate-700" />
                        <Skeleton className="h-3 w-16 bg-slate-700" />
                      </div>
                    </div>
                  ))
                ) : (
                  recentTools?.map((tool) => (
                    <div key={tool.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                        <i className={`${tool.icon || "fas fa-tools"} text-white text-sm`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{tool.name}</div>
                        <div className="text-xs text-gray-400">
                          {tool.isPremium ? 'Premium' : 'Free'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-heart mr-2 text-red-400"></i>
                  Your Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
                        <Skeleton className="w-10 h-10 rounded-lg bg-slate-700" />
                        <Skeleton className="h-4 flex-1 bg-slate-700" />
                      </div>
                    ))}
                  </div>
                ) : favorites && favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.slice(0, 5).map((tool) => (
                      <div key={tool.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                          <i className={`${tool.icon || "fas fa-tools"} text-white text-sm`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{tool.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <i className="fas fa-heart text-3xl mb-4 opacity-50"></i>
                    <p>No favorites yet</p>
                    <p className="text-sm">Start using tools to add favorites</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Tool Generator */}
            <Card className="glass border-white/10 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-magic-wand-sparkles mr-2 text-purple-400"></i>
                  AI Tool Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Can't find the tool you need? Describe it and our AI will create it for you!
                </p>
                <Button className="w-full gradient-primary">
                  <i className="fas fa-plus mr-2"></i>
                  Generate New Tool
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
