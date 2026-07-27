import { Response } from 'express';
import Task from '../models/Task';
import ScreenTime from '../models/ScreenTime';
import DailyMetrics from '../models/DailyMetrics';
import { AuthRequest } from '../middleware/auth';
import { generateFortnightlyInsights, getLatestFortnightlyInsights } from '../services/fortnightlyInsightsService';

export const getEfficiencyTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    const daysNum = Number(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const metrics = await DailyMetrics.find({
      userId: req.userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const trend = metrics.map(m => ({
      date: m.date.toISOString().split('T')[0],
      efficiency: m.professionalEfficiencyScore,
      wellbeing: m.wellbeingScore
    }));

    res.json({ trend });
  } catch (error) {
    console.error('Get efficiency trend error:', error);
    res.status(500).json({ error: 'Failed to fetch efficiency trend' });
  }
};

export const getTaskCompletionTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    const daysNum = Number(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    const dailyStats: { [key: string]: { planned: number; completed: number } } = {};

    tasks.forEach(task => {
      const date = task.createdAt.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { planned: 0, completed: 0 };
      }
      dailyStats[date].planned++;
      if (task.status === 'completed') {
        dailyStats[date].completed++;
      }
    });

    const trend = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      planned: stats.planned,
      completed: stats.completed,
      rate: stats.planned > 0 ? Math.round((stats.completed / stats.planned) * 100) : 0
    }));

    res.json({ trend });
  } catch (error) {
    console.error('Get task completion trend error:', error);
    res.status(500).json({ error: 'Failed to fetch task completion trend' });
  }
};

export const getScreenTimeTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    const daysNum = Number(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const screenTimeData = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const trend = screenTimeData.map(st => ({
      date: st.date.toISOString().split('T')[0],
      total: st.totalMinutes,
      productive: st.productiveMinutes,
      entertainment: st.entertainmentMinutes
    }));

    res.json({ trend });
  } catch (error) {
    console.error('Get screen time trend error:', error);
    res.status(500).json({ error: 'Failed to fetch screen time trend' });
  }
};

export const getWeeklyComparison = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekTasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: thisWeekStart }
    });

    const lastWeekTasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: lastWeekStart, $lt: thisWeekStart }
    });

    const thisWeekCompleted = thisWeekTasks.filter(t => t.status === 'completed').length;
    const lastWeekCompleted = lastWeekTasks.filter(t => t.status === 'completed').length;

    const thisWeekScreenTime = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: thisWeekStart }
    });

    const lastWeekScreenTime = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: lastWeekStart, $lt: thisWeekStart }
    });

    const thisWeekTotalScreenTime = thisWeekScreenTime.reduce((sum, st) => sum + st.totalMinutes, 0);
    const lastWeekTotalScreenTime = lastWeekScreenTime.reduce((sum, st) => sum + st.totalMinutes, 0);

    res.json({
      comparison: {
        tasks: {
          thisWeek: thisWeekCompleted,
          lastWeek: lastWeekCompleted,
          change: lastWeekCompleted > 0 ? Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100) : 0
        },
        screenTime: {
          thisWeek: thisWeekTotalScreenTime,
          lastWeek: lastWeekTotalScreenTime,
          change: lastWeekTotalScreenTime > 0 ? Math.round(((thisWeekTotalScreenTime - lastWeekTotalScreenTime) / lastWeekTotalScreenTime) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get weekly comparison error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly comparison' });
  }
};

export const getMonthlyComparison = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const thisMonthTasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: thisMonthStart }
    });

    const lastMonthTasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: lastMonthStart, $lt: thisMonthStart }
    });

    const thisMonthCompleted = thisMonthTasks.filter(t => t.status === 'completed').length;
    const lastMonthCompleted = lastMonthTasks.filter(t => t.status === 'completed').length;

    const thisMonthScreenTime = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: thisMonthStart }
    });

    const lastMonthScreenTime = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: lastMonthStart, $lt: thisMonthStart }
    });

    const thisMonthTotalScreenTime = thisMonthScreenTime.reduce((sum, st) => sum + st.totalMinutes, 0);
    const lastMonthTotalScreenTime = lastMonthScreenTime.reduce((sum, st) => sum + st.totalMinutes, 0);

    res.json({
      comparison: {
        tasks: {
          thisMonth: thisMonthCompleted,
          lastMonth: lastMonthCompleted,
          change: lastMonthCompleted > 0 ? Math.round(((thisMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100) : 0
        },
        screenTime: {
          thisMonth: thisMonthTotalScreenTime,
          lastMonth: lastMonthTotalScreenTime,
          change: lastMonthTotalScreenTime > 0 ? Math.round(((thisMonthTotalScreenTime - lastMonthTotalScreenTime) / lastMonthTotalScreenTime) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get monthly comparison error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly comparison' });
  }
};

export const getFortnightlyInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Try to get existing insights first
    let insights = await getLatestFortnightlyInsights(req.userId!);
    
    // If no insights exist or they're older than 14 days, generate new ones
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    if (!insights || new Date(insights.startDate) < fourteenDaysAgo) {
      insights = await generateFortnightlyInsights(req.userId!);
    }

    res.json({ insights });
  } catch (error) {
    console.error('Get fortnightly insights error:', error);
    res.status(500).json({ error: 'Failed to fetch fortnightly insights' });
  }
};
