'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Clock, Monitor, TrendingUp, Calendar, Plus } from 'lucide-react';

interface ScreenTimeData {
  _id: string;
  date: string;
  totalMinutes: number;
  productiveMinutes: number;
  entertainmentMinutes: number;
}

export default function ScreenTimePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScreenTime, setNewScreenTime] = useState({
    totalMinutes: '',
    productiveMinutes: '',
    entertainmentMinutes: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchScreenTimeData();
  }, [isAuthenticated, router]);

  const fetchScreenTimeData = async () => {
    try {
      const response = await api.get('/screen-time');
      setScreenTimeData(response.data.screenTime || []);
    } catch (error: any) {
      toast.error('Failed to fetch screen time data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScreenTime = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const total = parseInt(newScreenTime.totalMinutes);
    const productive = parseInt(newScreenTime.productiveMinutes) || 0;
    const entertainment = parseInt(newScreenTime.entertainmentMinutes) || 0;

    if (!total || total < 0) {
      toast.error('Please enter valid total minutes');
      return;
    }

    if (productive + entertainment > total) {
      toast.error('Productive + entertainment minutes cannot exceed total minutes');
      return;
    }

    try {
      const response = await api.post('/screen-time', {
        totalMinutes: total,
        productiveMinutes: productive,
        entertainmentMinutes: entertainment,
        date: new Date().toISOString()
      });
      
      setScreenTimeData([response.data.screenTime, ...screenTimeData]);
      setNewScreenTime({ totalMinutes: '', productiveMinutes: '', entertainmentMinutes: '' });
      setShowAddForm(false);
      toast.success('Screen time recorded successfully');
    } catch (error: any) {
      toast.error('Failed to record screen time');
    }
  };

  const canAddTodayScreenTime = () => {
    const today = new Date().toDateString();
    return !screenTimeData.some(st => new Date(st.date).toDateString() === today);
  };

  const getAverageScreenTime = () => {
    if (screenTimeData.length === 0) return 0;
    const totalMinutes = screenTimeData.reduce((sum, st) => sum + st.totalMinutes, 0);
    return Math.round(totalMinutes / screenTimeData.length);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTodayScreenTime = () => {
    const today = new Date().toDateString();
    return screenTimeData.find(st => new Date(st.date).toDateString() === today);
  };

  const getTotalScreenTime = () => {
    return screenTimeData.reduce((sum, st) => sum + st.totalMinutes, 0);
  };

  const ClockVisual = ({ minutes }: { minutes: number }) => {
    const totalMinutesInDay = 24 * 60;
    const percentage = Math.min((minutes / totalMinutesInDay) * 100, 100);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-800"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="drop-shadow-lg"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-teal-500 mb-2" />
          <p className="text-3xl font-bold">{hours}h {mins}m</p>
          <p className="text-sm text-muted-foreground">Today</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading screen time data...</p>
        </div>
      </div>
    );
  }

  const todayData = getTodayScreenTime();
  const totalScreenTime = getTotalScreenTime();
  const avgScreenTime = getAverageScreenTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Screen Time</h1>
            <p className="text-muted-foreground">Track your digital wellness and productivity</p>
          </div>
          {canAddTodayScreenTime() && (
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="gradient-bg text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Today's Screen Time
            </Button>
          )}
        </motion.div>

        {/* Add Screen Time Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="glass border-0">
              <CardContent className="p-6">
                <form onSubmit={handleAddScreenTime} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Total Minutes</label>
                      <Input
                        type="number"
                        placeholder="e.g., 240"
                        value={newScreenTime.totalMinutes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScreenTime({ ...newScreenTime, totalMinutes: e.target.value })}
                        className="bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Productive Minutes</label>
                      <Input
                        type="number"
                        placeholder="e.g., 180"
                        value={newScreenTime.productiveMinutes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScreenTime({ ...newScreenTime, productiveMinutes: e.target.value })}
                        className="bg-white/50 dark:bg-gray-800/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Entertainment Minutes</label>
                      <Input
                        type="number"
                        placeholder="e.g., 60"
                        value={newScreenTime.entertainmentMinutes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewScreenTime({ ...newScreenTime, entertainmentMinutes: e.target.value })}
                        className="bg-white/50 dark:bg-gray-800/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="gradient-bg text-white">
                      Save Screen Time
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Clock Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="glass border-0 h-full">
              <CardContent className="p-8">
                <ClockVisual minutes={todayData?.totalMinutes || 0} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="glass border-0 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg mb-4">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Today's Total</p>
                  <p className="text-3xl font-bold">{formatTime(todayData?.totalMinutes || 0)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="glass border-0 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Average Daily</p>
                  <p className="text-3xl font-bold">{formatTime(avgScreenTime)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="glass border-0 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Tracked</p>
                  <p className="text-3xl font-bold">{screenTimeData.length} days</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Productivity Breakdown */}
        {todayData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Today's Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Productive Time</span>
                      <span className="text-sm text-muted-foreground">{formatTime(todayData.productiveMinutes)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(todayData.productiveMinutes / todayData.totalMinutes) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Entertainment Time</span>
                      <span className="text-sm text-muted-foreground">{formatTime(todayData.entertainmentMinutes)}</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(todayData.entertainmentMinutes / todayData.totalMinutes) * 100}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="glass border-0">
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent>
              {screenTimeData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No screen time data recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {screenTimeData.slice(0, 7).map((st, index) => (
                    <motion.div
                      key={st.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{new Date(st.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(st.productiveMinutes)} productive / {formatTime(st.entertainmentMinutes)} entertainment
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">{formatTime(st.totalMinutes)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
