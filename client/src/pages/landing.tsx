import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import SearchBar from "@/components/search-bar";
import CategoryCard from "@/components/category-card";
import ToolCard from "@/components/tool-card";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import AuthModal from "@/components/auth-modal";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const toolCategories = [
  {
    id: 1,
    name: "PDF Tools",
    slug: "pdf-tools",
    description: "Convert, merge, split, compress PDFs with AI-powered features",
    icon: "fas fa-file-pdf",
    color: "from-red-500 to-red-600",
    toolCount: 25
  },
  {
    id: 2,
    name: "Image Tools",
    slug: "image-tools", 
    description: "AI background removal, upscaling, filters, and editing",
    icon: "fas fa-image",
    color: "from-purple-500 to-purple-600",
    toolCount: 30
  },
  {
    id: 3,
    name: "Video Tools",
    slug: "video-tools",
    description: "Convert, compress, edit videos with AI enhancements", 
    icon: "fas fa-video",
    color: "from-blue-500 to-blue-600",
    toolCount: 20
  },
  {
    id: 4,
    name: "AI Tools",
    slug: "ai-tools",
    description: "ChatGPT, image generation, voice cloning, data analysis",
    icon: "fas fa-brain",
    color: "from-green-500 to-green-600",
    toolCount: 0,
    isPremium: true
  },
  {
    id: 5,
    name: "Developer Tools",
    slug: "developer-tools",
    description: "Code formatters, JSON validators, API testing tools",
    icon: "fas fa-code", 
    color: "from-indigo-500 to-indigo-600",
    toolCount: 15
  },
  {
    id: 6,
    name: "Security Tools",
    slug: "security-tools",
    description: "Password generators, encryption, malware scanning",
    icon: "fas fa-shield-alt",
    color: "from-orange-500 to-orange-600", 
    toolCount: 12
  },
  {
    id: 7,
    name: "Productivity",
    slug: "productivity-tools",
    description: "Resume builders, document writers, grammar checkers",
    icon: "fas fa-briefcase",
    color: "from-teal-500 to-teal-600",
    toolCount: 18
  },
  {
    id: 8,
    name: "Design Tools",
    slug: "design-tools",
    description: "Logo makers, color palettes, UI prototyping, 3D models",
    icon: "fas fa-palette",
    color: "from-pink-500 to-pink-600",
    toolCount: 0,
    isPremium: true
  }
];

const featuredTools = [
  {
    id: 1,
    name: "PDF to Word Converter",
    slug: "pdf-to-word",
    shortDescription: "Convert PDF documents to editable Word format with AI-powered accuracy.",
    isPremium: false,
    rating: 4.9,
    reviewCount: 12000,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
  },
  {
    id: 2,
    name: "AI Background Remover", 
    slug: "ai-background-remover",
    shortDescription: "Remove backgrounds from images instantly using advanced AI technology.",
    isPremium: true,
    rating: 4.8,
    reviewCount: 8000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
  },
  {
    id: 3,
    name: "Video Converter",
    slug: "video-converter", 
    shortDescription: "Convert videos between any formats with lightning-fast processing.",
    isPremium: false,
    rating: 4.9,
    reviewCount: 15000,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: 0,
    period: "",
    description: "Perfect for getting started",
    features: [
      "5 basic tools access",
      "No login required", 
      "Standard processing speed",
      { text: "AI tool generation", included: false },
      { text: "Premium tools", included: false }
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const
  },
  {
    name: "Pro", 
    price: 19,
    period: "month",
    description: "For power users",
    features: [
      "1000+ tools access",
      "AI tool generation (50/month)",
      "Priority processing",
      "Download history",
      "Email support"
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: 99, 
    period: "month",
    description: "For teams & businesses",
    features: [
      "Unlimited tool access",
      "Unlimited AI generation", 
      "API access",
      "Team collaboration",
      "24/7 priority support"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch popular tools
  const { data: popularTools, isLoading: toolsLoading } = useQuery({
    queryKey: ['/api/tools', { type: 'popular', limit: '3' }],
    retry: false,
  });

  const handleAuthAction = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation onAuthAction={handleAuthAction} />
      
      {/* Hero Section */}
      <HeroSection onGetStarted={handleAuthAction} />

      {/* Search Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gradient-primary">AI-Powered</span> Tool Discovery
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Search for any tool. If it doesn't exist, our AI will create it instantly.
            </motion.p>
            
            <SearchBar onAuthRequired={handleAuthAction} />
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Explore <span className="text-gradient-primary">Tool Categories</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard 
                  category={category}
                  onAuthRequired={handleAuthAction}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Most <span className="text-gradient-primary">Popular Tools</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolsLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass rounded-2xl overflow-hidden">
                  <Skeleton className="w-full h-48 bg-slate-700" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 bg-slate-700" />
                    <Skeleton className="h-4 bg-slate-700" />
                    <Skeleton className="h-4 w-2/3 bg-slate-700" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24 bg-slate-700" />
                      <Skeleton className="h-8 w-20 bg-slate-700" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Use fetched tools or fallback to featured tools
              (popularTools || featuredTools).slice(0, 3).map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ToolCard 
                    tool={tool}
                    onAuthRequired={handleAuthAction}
                  />
                </motion.div>
              ))
            )}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button 
              className="px-8 py-4 glass rounded-xl font-semibold hover:bg-white/20 transition-all"
              onClick={handleAuthAction}
            >
              <i className="fas fa-grid-2-plus mr-2"></i>
              View All 1000+ Tools
            </button>
          </motion.div>
        </div>
      </section>

      {/* AI Auto-Generation Feature */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  AI That <span className="text-gradient-primary">Creates Tools</span> For You
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Our revolutionary AI analyzes your request and automatically generates custom tools when they don't exist. 
                  Experience the future of on-demand software creation.
                </p>
                
                <div className="space-y-6">
                  {[
                    {
                      icon: "fas fa-search",
                      title: "Smart Detection", 
                      description: "AI analyzes your search query and understands exactly what tool you need.",
                      gradient: "gradient-primary"
                    },
                    {
                      icon: "fas fa-magic-wand-sparkles",
                      title: "Instant Generation",
                      description: "Creates fully functional tools in seconds using advanced AI models.",
                      gradient: "gradient-accent"
                    },
                    {
                      icon: "fas fa-rocket", 
                      title: "Auto-Deployment",
                      description: "Tools are immediately available for use and saved for the entire community.",
                      gradient: "from-cyan-500 to-green-500"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <i className={`${feature.icon} text-white`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  className="mt-8 px-8 py-4 gradient-primary rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:scale-105"
                  onClick={handleAuthAction}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-play mr-2"></i>
                  See AI in Action
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Premium software dashboard with analytics and modern interface" 
                  className="rounded-2xl shadow-2xl w-full"
                />
                
                {/* Floating AI Elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-24 h-24 glass rounded-2xl flex items-center justify-center"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <i className="fas fa-brain text-purple-400 text-2xl"></i>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-20 h-20 glass rounded-2xl flex items-center justify-center"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                >
                  <i className="fas fa-magic-wand-sparkles text-cyan-400 text-xl"></i>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="text-gradient-primary">Plan</span>
            </h2>
            <p className="text-xl text-gray-400">Start free, upgrade when you need more power</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingCard 
                  plan={plan}
                  onSelectPlan={handleAuthAction}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="text-gradient-primary">Workflow?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users who are already saving hours daily with our AI-powered tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                className="w-full sm:w-auto px-8 py-4 gradient-primary rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
                onClick={handleAuthAction}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-rocket mr-2"></i>
                Start Building Tools Now
              </motion.button>
              <motion.button 
                className="w-full sm:w-auto px-8 py-4 glass rounded-xl text-lg font-semibold hover:bg-white/20 transition-all"
                onClick={handleAuthAction}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-calendar mr-2"></i>
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
      />
    </div>
  );
}
