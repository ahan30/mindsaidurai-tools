import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Footer() {
  const footerSections = [
    {
      title: "Tools",
      links: [
        { name: "PDF Tools", href: "/tools/pdf-tools" },
        { name: "Image Tools", href: "/tools/image-tools" },
        { name: "Video Tools", href: "/tools/video-tools" },
        { name: "AI Tools", href: "/tools/ai-tools" },
        { name: "Developer Tools", href: "/tools/developer-tools" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
        { name: "Press", href: "/press" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "API Docs", href: "/api-docs" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Status", href: "/status" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: "fab fa-twitter", href: "https://twitter.com/mindsai" },
    { name: "LinkedIn", icon: "fab fa-linkedin", href: "https://linkedin.com/company/mindsai" },
    { name: "GitHub", icon: "fab fa-github", href: "https://github.com/mindsai" },
    { name: "Discord", icon: "fab fa-discord", href: "https://discord.gg/mindsai" }
  ];

  return (
    <footer className="bg-slate-800 py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/">
              <motion.div 
                className="flex items-center space-x-2 mb-6 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <i className="fas fa-brain text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gradient-primary">MindsAI</h3>
                  <p className="text-xs text-gray-400">ToolsHub</p>
                </div>
              </motion.div>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Revolutionary AI-powered tools platform that creates any tool you need, instantly. 
              Transform your workflow with intelligent automation.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-700 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`${social.icon} text-gray-300 hover:text-white`}></i>
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="md:col-span-1">
              <h4 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors cursor-pointer block">
                      <motion.span 
                        whileHover={{ x: 4 }}
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get notified about new AI tools and platform updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <motion.button
                className="px-6 py-2 gradient-primary rounded-lg font-semibold hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              &copy; 2025 MindsAI ToolsHub. All rights reserved. Built with ❤️ using AI.
            </p>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <i className="fas fa-shield-alt mr-2 text-green-400"></i>
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
