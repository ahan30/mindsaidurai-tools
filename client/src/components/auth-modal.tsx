import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    window.location.href = "/api/login";
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // For now, redirect to login since we're using Replit Auth
    window.location.href = "/api/login";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-dark border-white/20 max-w-md">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <i className="fas fa-brain text-white text-xl"></i>
            </div>
          </motion.div>
          <DialogTitle className="text-2xl font-bold">
            Welcome to MindsAI
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSignUp 
              ? "Create your account to access 1000+ AI-powered tools"
              : "Sign in to access premium tools and AI generation"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 transition-colors flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fab fa-google"></i>
              )}
              Continue with Google
            </Button>
            
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
            >
              <i className="fab fa-github"></i>
              Continue with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-white/20" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 text-gray-400 text-sm">
              or
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="glass border-white/20 bg-white/5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass border-white/20 bg-white/5"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : null}
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* Toggle Sign Up/In */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-purple-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
