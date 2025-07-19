import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const stats = [
    { value: "1000+", label: "AI Tools", icon: "fas fa-tools", color: "text-cyan-400" },
    { value: "24/7", label: "AI Generation", icon: "fas fa-clock", color: "text-green-400" },
    { value: "100K+", label: "Happy Users", icon: "fas fa-users", color: "text-yellow-400" },
    { value: "99.9%", label: "Uptime", icon: "fas fa-chart-line", color: "text-purple-400" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-mesh">
      <div className="absolute inset-0 bg-slate-900/50"></div>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Revolutionary AI-Powered
            </span>
            <br />
            <span className="text-gradient-primary">Tools Hub</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience the future of digital tools. Our AI automatically creates any tool you need, 
            offering 1000+ premium utilities in one revolutionary platform.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 gradient-primary rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:scale-105"
            >
              <i className="fas fa-rocket mr-2"></i>
              Start Creating Tools
            </Button>
            
            <Button 
              variant="outline"
              className="w-full sm:w-auto px-8 py-4 glass border-white/20 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all"
            >
              <i className="fas fa-play mr-2"></i>
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass border-white/10 hover:bg-white/10 transition-all">
                  <CardContent className="p-6 text-center">
                    <motion.i 
                      className={`${stat.icon} ${stat.color} text-2xl mb-3`}
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
        animate={{ 
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"
        animate={{ 
          y: [10, -15, 10],
          x: [5, -5, 5],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl"
        animate={{ 
          y: [-8, 12, -8],
          x: [-3, 7, -3],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
    </section>
  );
}
