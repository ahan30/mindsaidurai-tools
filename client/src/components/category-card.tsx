import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color?: string;
  toolCount?: number;
  isPremium?: boolean;
}

interface CategoryCardProps {
  category: Category;
  onAuthRequired?: () => void;
}

export default function CategoryCard({ category, onAuthRequired }: CategoryCardProps) {
  const handleClick = () => {
    if (category.isPremium && onAuthRequired) {
      onAuthRequired();
      return;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/tools/${category.slug}`}>
        <Card 
          className="glass border-white/10 hover:bg-white/10 transition-all cursor-pointer group h-full"
          onClick={handleClick}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Category Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${category.color || 'from-purple-500 to-purple-600'} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <i className={`${category.icon} text-white text-2xl`}></i>
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </h3>
                  <motion.i 
                    className="fas fa-arrow-right text-purple-400 group-hover:translate-x-1 transition-transform"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  />
                </div>
                
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={category.isPremium ? "secondary" : "default"}
                    className={
                      category.isPremium 
                        ? "bg-yellow-500/20 text-yellow-400" 
                        : "bg-green-500/20 text-green-400"
                    }
                  >
                    {category.isPremium ? 'Premium' : `${category.toolCount || 0}+ Tools`}
                  </Badge>
                  
                  {category.isPremium && (
                    <div className="flex items-center text-xs text-yellow-400">
                      <i className="fas fa-crown mr-1"></i>
                      <span>Pro Access</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
