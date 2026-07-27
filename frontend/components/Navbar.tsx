'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Brain, Home, BarChart3, LogOut, Menu, X, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckCircle },
    { name: 'Reflection', href: '/dashboard/reflection', icon: Sparkles },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    useAuthStore.getState().logout();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/auth/login');
  };

  const isActive = (href: string) => pathname === href;

  if (pathname.startsWith('/auth') || pathname === '/landing') {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-subtle border-b border-white/20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(isAuthenticated ? '/dashboard' : '/landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-11 h-11 gradient-bg rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 gradient-bg rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">PatternIQ</span>
          </motion.div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(item.href)}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10 font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-4.5 h-4.5 relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/login')}
                  className="px-5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 font-medium"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/register')}
                  className="px-5 py-2.5 rounded-xl gradient-bg text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-accent/50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/20 overflow-hidden glass-subtle"
          >
            <div className="p-4 space-y-1">
              {isAuthenticated && (
                navItems.map((item) => (
                  <motion.button
                    key={item.href}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      router.push(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </motion.button>
                ))
              )}
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      router.push('/auth/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  >
                    <span className="font-medium">Login</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      router.push('/auth/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl gradient-bg text-white shadow-lg"
                  >
                    <span className="font-medium">Sign Up</span>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
