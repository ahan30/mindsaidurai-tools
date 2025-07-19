import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  authenticated?: boolean;
  onAuthAction?: () => void;
}

export default function Navigation({ authenticated, onAuthAction }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  
  const isAuth = authenticated ?? !!user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-primary">MindsAI</h1>
                <p className="text-xs text-gray-400">ToolsHub</p>
              </div>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">
              Tools
            </Link>
            <Link href="/tools/ai-ml" className="text-gray-300 hover:text-white transition-colors">
              AI Generator
            </Link>
            <Link href="/tools/image-photo" className="text-gray-300 hover:text-white transition-colors">
              Image Tools
            </Link>
            <Link href="/tools/video-audio" className="text-gray-300 hover:text-white transition-colors">
              Video Tools
            </Link>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user?.profileImageUrl} 
                        alt={user?.firstName || user?.email} 
                      />
                      <AvatarFallback className="gradient-primary text-white">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-dark border-white/20 w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.plan === 'free' ? 'Free Plan' : user?.plan === 'pro' ? 'Pro Plan' : 'Enterprise'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="hover:bg-white/10">
                    <i className="fas fa-user mr-2"></i>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10">
                    <i className="fas fa-heart mr-2"></i>
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10">
                    <i className="fas fa-history mr-2"></i>
                    Usage History
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/10">
                    <i className="fas fa-cog mr-2"></i>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="hover:bg-white/10 text-red-400"
                    onClick={() => window.location.href = "/api/logout"}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/api/login"}
                  className="text-gray-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onAuthAction || (() => window.location.href = "/api/login")}
                  className="gradient-primary hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-4 pt-4">
              <Link href="/tools" className="text-gray-300 hover:text-white transition-colors py-2">
                All Tools
              </Link>
              <Link href="/tools/ai-ml" className="text-gray-300 hover:text-white transition-colors py-2">
                AI Generator
              </Link>
              <Link href="/tools/image-photo" className="text-gray-300 hover:text-white transition-colors py-2">
                Image Tools
              </Link>
              <Link href="/tools/video-audio" className="text-gray-300 hover:text-white transition-colors py-2">
                Video Tools
              </Link>
              <Link href="/tools/business-productivity" className="text-gray-300 hover:text-white transition-colors py-2">
                Business Tools
              </Link>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors py-2">Pricing</a>
              
              <div className="pt-4 border-t border-white/10 space-y-2">
                {isAuth ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || user?.email} />
                        <AvatarFallback className="gradient-primary text-white text-sm">
                          {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.plan === 'free' ? 'Free Plan' : user?.plan === 'pro' ? 'Pro Plan' : 'Enterprise'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = "/api/logout"}
                      className="w-full glass border-white/20 text-red-400"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = "/api/login"}
                      className="w-full glass border-white/20"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={onAuthAction || (() => window.location.href = "/api/login")}
                      className="w-full gradient-primary"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
