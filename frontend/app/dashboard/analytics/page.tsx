'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, TrendingUp, Clock, Activity, Target, Sparkles, ArrowUpRight, ArrowDownRight, Calendar, Brain } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [efficiencyTrend, setEfficiencyTrend] = useState<any[]>([]);
  const [taskCompletionTrend, setTaskCompletionTrend] = useState<any[]>([]);
  const [screenTimeTrend, setScreenTimeTrend] = useState<any[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<any>(null);
  const [fortnightlyInsights, setFortnightlyInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchAnalyticsData();
  }, [isAuthenticated, router]);

  const fetchAnalyticsData = async () => {
    try {
      const [efficiencyRes, tasksRes, screenTimeRes, weeklyRes, insightsRes] = await Promise.all([
        api.get('/charts/efficiency'),
        api.get('/charts/task-completion'),
        api.get('/charts/screen-time'),
        api.get('/charts/weekly-comparison'),
        api.get('/charts/fortnightly-insights'),
      ]);

      setEfficiencyTrend(efficiencyRes.data.trend);
      setTaskCompletionTrend(tasksRes.data.trend);
      setScreenTimeTrend(screenTimeRes.data.trend);
      setWeeklyComparison(weeklyRes.data.comparison);
      setFortnightlyInsights(insightsRes.data.insights);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 gradient-bg rounded-2xl blur-xl opacity-50" />
          </div>
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-xl border border-border/20 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50 p-6">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight gradient-text">Analytics</h1>
              <p className="text-lg text-muted-foreground">Track your productivity trends and patterns</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full backdrop-blur-sm border border-white/20">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last 30 days</span>
            </div>
          </div>
        </motion.div>


        {/* Task Completion Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Task Completion Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={taskCompletionTrend} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis dataKey="date" stroke="rgba(128, 128, 128, 0.3)" fontSize={12} />
                  <YAxis stroke="rgba(128, 128, 128, 0.3)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="planned" fill="#14b8a6" name="Planned Tasks" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Screen Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Screen Time Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={screenTimeTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis dataKey="date" stroke="rgba(128, 128, 128, 0.3)" fontSize={12} />
                  <YAxis stroke="rgba(128, 128, 128, 0.3)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total (min)" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="productive" stroke="#10b981" name="Productive (min)" strokeWidth={2} dot={{ fill: '#10b981' }} />
                  <Line type="monotone" dataKey="entertainment" stroke="#f59e0b" name="Entertainment (min)" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="gradient-border border-0 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-600" />
                <span className="gradient-text">AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fortnightlyInsights ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-sm">Pattern Detected</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{fortnightlyInsights.patternDetected}</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-sm">Correlation Found</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{fortnightlyInsights.correlationFound}</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-cyan-600" />
                      <span className="font-semibold text-sm">Recommendation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{fortnightlyInsights.recommendation}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Submit more reflections to generate AI insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Comparison Detail */}
        {weeklyComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Weekly Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-teal-600" />
                      Tasks Completed
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                        <span className="text-muted-foreground">This Week</span>
                        <span className="text-2xl font-bold">{weeklyComparison.tasks.thisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="text-muted-foreground">Last Week</span>
                        <span className="text-2xl font-bold">{weeklyComparison.tasks.lastWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <span className="text-muted-foreground">Change</span>
                        <span className={`text-2xl font-bold ${weeklyComparison.tasks.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {weeklyComparison.tasks.change >= 0 ? '+' : ''}{weeklyComparison.tasks.change}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Screen Time (minutes)
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <span className="text-muted-foreground">This Week</span>
                        <span className="text-2xl font-bold">{weeklyComparison.screenTime.thisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <span className="text-muted-foreground">Last Week</span>
                        <span className="text-2xl font-bold">{weeklyComparison.screenTime.lastWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <span className="text-muted-foreground">Change</span>
                        <span className={`text-2xl font-bold ${weeklyComparison.screenTime.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {weeklyComparison.screenTime.change >= 0 ? '+' : ''}{weeklyComparison.screenTime.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
