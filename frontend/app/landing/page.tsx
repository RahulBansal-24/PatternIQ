'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Brain, TrendingUp, Shield, Zap, BarChart3, Target, Sparkles, ArrowRight, CheckCircle2, MessageSquare, Clock, PieChart, Activity, ChevronRight, Star } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 0.95]), { stiffness: 100, damping: 30 });

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized behavioral analysis powered by Google Gemini AI to understand your productivity patterns.',
      color: 'from-teal-600 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your professional efficiency and wellbeing scores over time with beautiful visualizations.',
      color: 'from-emerald-600 to-teal-500',
    },
    {
      icon: Target,
      title: 'Task Management',
      description: 'Plan and track your tasks with intelligent completion tracking and productivity metrics.',
      color: 'from-cyan-600 to-blue-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure with encrypted storage and you control what gets shared.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Get instant AI analysis of your daily reflections and behavioral patterns.',
      color: 'from-lime-500 to-green-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep dive into your productivity trends with comprehensive charts and reports.',
      color: 'from-sky-500 to-indigo-500',
    },
  ];

  const benefits = [
    'AI-powered behavioral analysis',
    'Personalized productivity insights',
    'Beautiful data visualizations',
    'Secure and private',
    'Cross-platform support',
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Track Your Day',
      description: 'Log your tasks, reflections, and screen time to build comprehensive behavioral data.',
      icon: Target,
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Gemini AI analyzes your patterns to identify correlations and insights.',
      icon: Brain,
    },
    {
      step: '03',
      title: 'Get Insights',
      description: 'Receive personalized recommendations to optimize your productivity and wellbeing.',
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      content: 'PatternIQ helped me understand that my productivity peaks on Tuesday mornings. Now I schedule my most important work then.',
      rating: 5,
    },
    {
      name: 'Alex Rivera',
      role: 'Software Engineer',
      content: 'The AI insights are incredibly accurate. I never realized how much my energy levels affected my work quality.',
      rating: 5,
    },
    {
      name: 'Jordan Lee',
      role: 'Designer',
      content: 'Finally, a productivity tool that actually explains WHY I work the way I do. Game changer.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How does PatternIQ use AI?',
      answer: 'PatternIQ uses Google Gemini AI to analyze your behavioral data and generate personalized insights about your productivity patterns.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all data is encrypted and stored securely. You have full control over your data and can delete it at any time.',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for an account, start tracking your tasks and reflections, and let AI do the rest.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 max-w-7xl py-32 md:py-48">
        <motion.div
          style={{ opacity, scale }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="mx-auto w-32 h-32 gradient-bg rounded-3xl flex items-center justify-center mb-10 shadow-2xl float pulse-glow"
          >
            <Brain className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
          >
            <span className="gradient-text">PatternIQ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl md:text-4xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Understand <span className="gradient-text font-semibold">WHY</span> your productivity changes with AI-powered behavioral intelligence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={() => router.push('/auth/register')}
              variant="gradient"
              size="lg"
              className="text-lg shadow-2xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push('/auth/login')}
              variant="outline"
              size="lg"
              className="text-lg border-2"
            >
              Sign In
            </Button>
          </motion.div>

          {/* Floating Productivity Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full backdrop-blur-sm border border-white/20"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {benefit}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </section>

      {/* Why PatternIQ Section */}
      <section className="relative container mx-auto px-6 max-w-7xl py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Why PatternIQ
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text tracking-tight">Understand Your Patterns</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            PatternIQ goes beyond simple tracking. It helps you understand the deeper patterns that drive your productivity and wellbeing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <Card className="glass border-0 h-full card-hover">
                <CardContent className="p-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring' }}
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative container mx-auto px-6 max-w-7xl py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-6"
          >
            <Target className="w-4 h-4" />
            How It Works
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text tracking-tight">Simple Steps to Insights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get started in minutes and unlock your productivity potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              <Card className="glass border-0 h-full card-hover">
                <CardContent className="p-8">
                  <div className="text-6xl font-bold gradient-text mb-4 opacity-30">{step.step}</div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-8 h-8 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative container mx-auto px-6 max-w-7xl py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4" />
            Loved by Users
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text tracking-tight">What People Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have transformed their productivity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="glass border-0 h-full card-hover">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative container mx-auto px-6 max-w-7xl py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          >
            <MessageSquare className="w-4 h-4" />
            FAQ
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 gradient-text tracking-tight">Common Questions</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="glass border-0 card-hover">
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 max-w-7xl py-32 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="gradient-bg-alt border-0 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
            <CardContent className="p-16 md:p-24 text-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-10"
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to Transform Your Productivity?</h2>
              <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who are already understanding their behavioral patterns with PatternIQ.
              </p>
              <Button
                onClick={() => router.push('/auth/register')}
                size="lg"
                className="h-16 px-12 bg-white text-teal-600 hover:bg-gray-100 font-semibold text-xl shadow-2xl"
              >
                Start Your Journey Today
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 relative z-10 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 max-w-7xl py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-2xl gradient-text">PatternIQ</span>
            </motion.div>
            <p className="text-muted-foreground">
              © 2024 PatternIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
6