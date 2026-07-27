'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Brain, Send, Sparkles, Mic, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function ReflectionPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [formData, setFormData] = useState({
    text: '',
    mood: 'neutral' as const,
    energy: 'medium' as const,
    motivation: 'medium' as const,
    productiveMinutes: '' as string,
    entertainmentMinutes: '' as string,
  });
  const [todayReflection, setTodayReflection] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchTodayReflection();
  }, [isAuthenticated, router]);

  const fetchTodayReflection = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/reflections/today');
      setTodayReflection(response.data.reflection);
    } catch (error) {
      // No reflection today is fine
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.text.length < 10) {
      toast.error('Reflection must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setIsAIThinking(true);

    try {
      const response = await api.post('/reflections', {
        ...formData,
        productiveMinutes: parseInt(formData.productiveMinutes) || 0,
        entertainmentMinutes: parseInt(formData.entertainmentMinutes) || 0
      });
      toast.success(response.data.message);
      setTodayReflection(response.data.reflection);
      setAiAnalysis(response.data.aiAnalysis);
      setFormData({
        text: '',
        mood: 'neutral',
        energy: 'medium',
        motivation: 'medium',
        productiveMinutes: '',
        entertainmentMinutes: '',
      });
      setCurrentStep(0);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit reflection');
    } finally {
      setIsSubmitting(false);
      setIsAIThinking(false);
    }
  };

  const moodOptions = [
    { value: 'very_negative', emoji: '😢', label: 'Very Low' },
    { value: 'negative', emoji: '😕', label: 'Low' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'positive', emoji: '😊', label: 'Good' },
    { value: 'very_positive', emoji: '🤩', label: 'Great' },
  ];

  const energyOptions = [
    { value: 'very_low', emoji: '🪫', label: 'Drained' },
    { value: 'low', emoji: '🔋', label: 'Low' },
    { value: 'medium', emoji: '⚡', label: 'Moderate' },
    { value: 'high', emoji: '💪', label: 'High' },
    { value: 'very_high', emoji: '🚀', label: 'Peak' },
  ];

  const motivationOptions = [
    { value: 'very_low', emoji: '😴', label: 'None' },
    { value: 'low', emoji: '😩', label: 'Low' },
    { value: 'medium', emoji: '🙂', label: 'Moderate' },
    { value: 'high', emoji: '😤', label: 'High' },
    { value: 'very_high', emoji: '🔥', label: 'Driven' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 gradient-bg rounded-2xl blur-xl opacity-50" />
          </div>
          <p className="text-muted-foreground">Loading your reflection...</p>
        </div>
      </div>
    );
  }

  if (todayReflection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-rose-50/50 dark:from-slate-950 dark:via-purple-950/50 dark:to-pink-950/50 p-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold">Today's Reflection</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(todayReflection.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                  <p className="text-lg leading-relaxed">{todayReflection.text}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30 text-center">
                    <div className="text-3xl mb-2">
                      {todayReflection.mood === 'very_positive' && '🤩'}
                      {todayReflection.mood === 'positive' && '😊'}
                      {todayReflection.mood === 'neutral' && '😐'}
                      {todayReflection.mood === 'negative' && '😕'}
                      {todayReflection.mood === 'very_negative' && '😢'}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Mood</p>
                    <p className="font-semibold capitalize">{todayReflection.mood.replace('_', ' ')}</p>
                  </div>
                  <div className="p-4 bg-pink-50/50 dark:bg-pink-950/20 rounded-2xl border border-pink-100 dark:border-pink-900/30 text-center">
                    <div className="text-3xl mb-2">
                      {todayReflection.energy === 'very_high' && '🚀'}
                      {todayReflection.energy === 'high' && '💪'}
                      {todayReflection.energy === 'medium' && '⚡'}
                      {todayReflection.energy === 'low' && '🔋'}
                      {todayReflection.energy === 'very_low' && '🪫'}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Energy</p>
                    <p className="font-semibold capitalize">{todayReflection.energy.replace('_', ' ')}</p>
                  </div>
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center">
                    <div className="text-3xl mb-2">
                      {todayReflection.motivation === 'very_high' && '🔥'}
                      {todayReflection.motivation === 'high' && '😤'}
                      {todayReflection.motivation === 'medium' && '🙂'}
                      {todayReflection.motivation === 'low' && '😩'}
                      {todayReflection.motivation === 'very_low' && '😴'}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Motivation</p>
                    <p className="font-semibold capitalize">{todayReflection.motivation.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Daily Limit Reached</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You can only submit one reflection per day. Come back tomorrow for your next reflection!
                    </p>
                  </div>
                </div>

                {/* AI Analysis Section */}
                {aiAnalysis && (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <h3 className="font-semibold text-teal-800 dark:text-teal-200">AI Analysis</h3>
                      </div>
                      <p className="text-sm leading-relaxed">{aiAnalysis.dailyGrowthAnalysis}</p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200">Root Cause</h3>
                      </div>
                      <p className="text-sm leading-relaxed">{aiAnalysis.rootCause}</p>
                    </div>

                    {aiAnalysis.behavioralPatterns && aiAnalysis.behavioralPatterns.length > 0 && (
                      <div className="p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <h3 className="font-semibold text-purple-800 dark:text-purple-200">Behavioral Patterns</h3>
                        </div>
                        <ul className="space-y-2">
                          {aiAnalysis.behavioralPatterns.map((pattern: any, index: number) => (
                            <li key={index} className="text-sm">
                              <span className="font-medium">{pattern.pattern}</span>: {pattern.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                      <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Recommendations</h3>
                        </div>
                        <ul className="space-y-2">
                          {aiAnalysis.recommendations.map((rec: any, index: number) => (
                            <li key={index} className="text-sm">
                              <span className="font-medium">{rec.title}</span>: {rec.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Back to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50 p-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl pulse-glow"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-3 gradient-text">Daily Reflection</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Take a moment to reflect on your day. Your responses will be analyzed by AI to provide personalized insights.
            </p>
          </div>

          <Card className="glass border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                          currentStep >= step - 1
                            ? 'gradient-bg text-white shadow-lg'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {currentStep > step - 1 ? <CheckCircle2 className="w-5 h-5" /> : step}
                      </div>
                      {step < 5 && (
                        <div
                          className={`w-16 h-1 mx-2 rounded-full transition-all ${
                            currentStep > step - 1 ? 'gradient-bg' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Text Reflection */}
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label htmlFor="text" className="text-lg font-semibold">
                          How was your day? What went well? What could be improved?
                        </label>
                        <textarea
                          id="text"
                          rows={6}
                          className="flex w-full rounded-2xl border-2 border-input bg-background px-5 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                          placeholder="Share your thoughts about your productivity, challenges, and achievements..."
                          value={formData.text}
                          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                          required
                          minLength={10}
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {formData.text.length} / 2000 characters
                          </p>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            disabled={formData.text.length < 10}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 2: Mood */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <label className="text-lg font-semibold">How are you feeling?</label>
                        <div className="grid grid-cols-5 gap-3">
                          {moodOptions.map((mood) => (
                            <motion.button
                              key={mood.value}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFormData({ ...formData, mood: mood.value as any })}
                              className={`p-4 rounded-2xl border-2 transition-all ${
                                formData.mood === mood.value
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg'
                                  : 'border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
                              }`}
                            >
                              <span className="text-3xl block mb-1">{mood.emoji}</span>
                              <p className="text-xs font-medium">{mood.label}</p>
                            </motion.button>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(0)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-accent transition-all"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Energy */}
                <AnimatePresence mode="wait">
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <label className="text-lg font-semibold">What's your energy level?</label>
                        <div className="grid grid-cols-5 gap-3">
                          {energyOptions.map((energy) => (
                            <motion.button
                              key={energy.value}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFormData({ ...formData, energy: energy.value as any })}
                              className={`p-4 rounded-2xl border-2 transition-all ${
                                formData.energy === energy.value
                                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 shadow-lg'
                                  : 'border-border hover:border-pink-300 hover:bg-pink-50/50 dark:hover:bg-pink-900/20'
                              }`}
                            >
                              <span className="text-3xl block mb-1">{energy.emoji}</span>
                              <p className="text-xs font-medium">{energy.label}</p>
                            </motion.button>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-accent transition-all"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 4: Motivation */}
                <AnimatePresence mode="wait">
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <label className="text-lg font-semibold">How motivated do you feel?</label>
                        <div className="grid grid-cols-5 gap-3">
                          {motivationOptions.map((motivation) => (
                            <motion.button
                              key={motivation.value}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFormData({ ...formData, motivation: motivation.value as any })}
                              className={`p-4 rounded-2xl border-2 transition-all ${
                                formData.motivation === motivation.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                                  : 'border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                              }`}
                            >
                              <span className="text-3xl block mb-1">{motivation.emoji}</span>
                              <p className="text-xs font-medium">{motivation.label}</p>
                            </motion.button>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-accent transition-all"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 5: Screen Time */}
                <AnimatePresence mode="wait">
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <label className="text-lg font-semibold">How much screen time did you have today?</label>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Clock className="w-6 h-6 text-emerald-600" />
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="number"
                                placeholder="Productive minutes"
                                value={formData.productiveMinutes}
                                onChange={(e) => setFormData({ ...formData, productiveMinutes: e.target.value })}
                                className="flex-1 p-4 rounded-2xl border-2 border-input bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary transition-all"
                                min="0"
                              />
                              <span className="text-muted-foreground font-medium">min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Clock className="w-6 h-6 text-amber-600" />
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="number"
                                placeholder="Entertainment minutes"
                                value={formData.entertainmentMinutes}
                                onChange={(e) => setFormData({ ...formData, entertainmentMinutes: e.target.value })}
                                className="flex-1 p-4 rounded-2xl border-2 border-input bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary transition-all"
                                min="0"
                              />
                              <span className="text-muted-foreground font-medium">min</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Break down your screen time into productive and entertainment categories. Leave blank if you don't want to track this.
                        </p>
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-accent transition-all"
                          >
                            Back
                          </button>
                          <Button
                            type="submit"
                            variant="gradient"
                            size="lg"
                            className="shadow-xl"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <Send className="w-4 h-4 animate-pulse" />
                                Submitting...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Submit Reflection
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Thinking Animation */}
                <AnimatePresence>
                  {isAIThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                      <Card className="glass border-0 max-w-md mx-4">
                        <CardContent className="p-8 text-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                          >
                            <Sparkles className="w-10 h-10 text-white ai-thinking" />
                          </motion.div>
                          <h3 className="text-xl font-semibold mb-2">AI is analyzing...</h3>
                          <p className="text-muted-foreground">Generating personalized insights from your reflection</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
