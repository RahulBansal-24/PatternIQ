'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { DashboardData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Brain, TrendingUp, Clock, CheckCircle, Activity, Lightbulb, Sparkles, ArrowUpRight, ArrowDownRight, Target, Calendar, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data.dashboard);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    try {
      toast.loading('Generating AI analysis...');
      const response = await api.post('/analysis/generate');
      toast.dismiss();
      toast.success('AI analysis generated successfully');
      fetchDashboardData();
    } catch (error: any) {
      toast.dismiss();
      toast.error('Failed to generate AI analysis');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteWarning) {
      setShowDeleteWarning(true);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete('/auth/delete-account');
      toast.success('Account deleted successfully');
      useAuthStore.getState().logout();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      router.push('/landing');
    } catch (error: any) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteWarning(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
          <p className="text-muted-foreground">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50">
        <Card className="glass border-0 max-w-md">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">Start tracking your tasks and reflections to unlock insights.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <Card className="glass border-0 card-hover h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CircularProgress = ({ value, label, color }: any) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted-foreground/20"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - value / 100)}`}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{value}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50">
      <div className="container mx-auto px-6 max-w-7xl py-8">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                {getGreeting()}, <span className="gradient-text">Welcome back</span>
              </h1>
              <p className="text-lg text-muted-foreground">Here's your behavioral intelligence overview</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full backdrop-blur-sm border border-white/20">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Banner */}
        {dashboardData.latestAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="gradient-border border-0 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">AI Insight</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                        {dashboardData.latestAnalysis.confidenceScore}% confidence
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{dashboardData.latestAnalysis.personalizedRecommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Planned Tasks"
            value={dashboardData.plannedTasks}
            icon={Target}
            color="bg-gradient-to-br from-cyan-500 to-blue-500"
          />
          <StatCard
            title="Completed Tasks"
            value={dashboardData.completedTasks}
            icon={CheckCircle}
            color="bg-gradient-to-br from-emerald-500 to-teal-500"
          />
          <StatCard
            title="Screen Time"
            value={`${Math.floor(dashboardData.screenTime.total / 60)}h ${dashboardData.screenTime.total % 60}m`}
            icon={Clock}
            color="bg-gradient-to-br from-teal-500 to-cyan-500"
          />
        </div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Detailed Analysis
                </CardTitle>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateAnalysis}
                  className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all"
                  title="Generate new AI analysis"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.latestAnalysis ? (
                <>
                  <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                    <h4 className="font-semibold text-sm text-teal-600 dark:text-teal-400 mb-2">Analysis</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{dashboardData.latestAnalysis.dailyGrowthAnalysis}</p>
                  </div>
                  <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <h4 className="font-semibold text-sm text-amber-600 dark:text-amber-400 mb-2">Root Cause</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{dashboardData.latestAnalysis.rootCause}</p>
                  </div>
                  {dashboardData.latestAnalysis.behavioralPatterns && dashboardData.latestAnalysis.behavioralPatterns.length > 0 && (
                    <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                      <h4 className="font-semibold text-sm text-purple-600 dark:text-purple-400 mb-2">Behavioral Patterns</h4>
                      <ul className="space-y-2">
                        {dashboardData.latestAnalysis.behavioralPatterns.map((pattern: any, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            <span className="font-medium">{pattern.pattern}</span>: {pattern.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dashboardData.latestAnalysis.recommendations && dashboardData.latestAnalysis.recommendations.length > 0 && (
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <h4 className="font-semibold text-sm text-blue-600 dark:text-blue-400 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {dashboardData.latestAnalysis.recommendations.map((rec: any, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            <span className="font-medium">{rec.title}</span>: {rec.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No AI analysis available</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateAnalysis}
                    className="px-4 py-2 rounded-xl gradient-bg text-white shadow-lg"
                  >
                    Generate Analysis
                  </motion.button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Reflection */}
        {dashboardData.todayReflection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Today's Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-6">{dashboardData.todayReflection.text}</p>
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Mood</p>
                        <p className="font-semibold capitalize">{dashboardData.todayReflection.mood.replace('_', ' ')}</p>
                      </div>
                      <div className="flex-1 p-4 bg-pink-50/50 dark:bg-pink-950/20 rounded-xl border border-pink-100 dark:border-pink-900/30 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Energy</p>
                        <p className="font-semibold capitalize">{dashboardData.todayReflection.energy.replace('_', ' ')}</p>
                      </div>
                      <div className="flex-1 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Motivation</p>
                        <p className="font-semibold capitalize">{dashboardData.todayReflection.motivation.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {dashboardData.todayReflection.mood === 'very_positive' && '🤩'}
                        {dashboardData.todayReflection.mood === 'positive' && '😊'}
                        {dashboardData.todayReflection.mood === 'neutral' && '😐'}
                        {dashboardData.todayReflection.mood === 'negative' && '😕'}
                        {dashboardData.todayReflection.mood === 'very_negative' && '😢'}
                      </div>
                      <p className="text-sm text-muted-foreground">Your mood today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Delete Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <Card className="glass border-0 border-red-200 dark:border-red-900/30">
            <CardContent className="p-6">
              {showDeleteWarning ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Warning: This action cannot be undone</h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Deleting your account will permanently remove all your data including tasks, reflections, screen time records, and AI analysis. This action is irreversible.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDeleteAccount}
                      variant="destructive"
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                    </Button>
                    <Button
                      onClick={() => setShowDeleteWarning(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
