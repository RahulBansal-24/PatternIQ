import { Response } from 'express';
import Task from '../models/Task';
import ScreenTime from '../models/ScreenTime';
import Reflection from '../models/Reflection';
import AIAnalysis from '../models/AIAnalysis';
import DailyMetrics from '../models/DailyMetrics';
import { AuthRequest } from '../middleware/auth';
import {
  calculateProfessionalEfficiencyScore,
  calculateWellbeingScore,
  normalizeMoodToScore,
  normalizeEnergyToScore,
  normalizeMotivationToScore
} from '../utils/scoring';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const plannedTasks = todayTasks.filter(t => t.status === 'planned').length;
    const completedTasks = todayTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = todayTasks.filter(t => t.status === 'in_progress').length;
    const completionPercentage = plannedTasks > 0 ? Math.round((completedTasks / plannedTasks) * 100) : 0;

    const todayScreenTime = await ScreenTime.findOne({
      userId: req.userId,
      date: today
    });

    const todayReflection = await Reflection.findOne({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    let latestAnalysis = await AIAnalysis.findOne({
      userId: req.userId,
      date: today
    }).sort({ createdAt: -1 });

    // If no analysis for today, get the most recent one from last 30 days
    if (!latestAnalysis) {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      latestAnalysis = await AIAnalysis.findOne({
        userId: req.userId,
        date: { $gte: thirtyDaysAgo }
      }).sort({ createdAt: -1 });
    }

    const todayMetrics = await DailyMetrics.findOne({
      userId: req.userId,
      date: today
    });

    let professionalEfficiencyScore = 0;
    let wellbeingScore = 0;

    if (todayMetrics) {
      professionalEfficiencyScore = todayMetrics.professionalEfficiencyScore;
      wellbeingScore = todayMetrics.wellbeingScore;
    } else {
      const moodScore = todayReflection ? normalizeMoodToScore(todayReflection.mood) : 50;
      const energyScore = todayReflection ? normalizeEnergyToScore(todayReflection.energy) : 50;
      const motivationScore = todayReflection ? normalizeMotivationToScore(todayReflection.motivation) : 50;

      const totalScreenTime = todayScreenTime ? todayScreenTime.totalMinutes : 0;
      const productiveScreenTime = todayScreenTime ? todayScreenTime.productiveMinutes : 0;

      professionalEfficiencyScore = calculateProfessionalEfficiencyScore(
        completionPercentage,
        completionPercentage,
        productiveScreenTime,
        totalScreenTime,
        50
      );

      wellbeingScore = calculateWellbeingScore(
        moodScore,
        energyScore,
        motivationScore,
        moodScore
      );
    }

    const recentReflections = await Reflection.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      dashboard: {
        plannedTasks,
        completedTasks,
        inProgressTasks,
        completionPercentage,
        screenTime: todayScreenTime ? {
          total: todayScreenTime.totalMinutes,
          productive: todayScreenTime.productiveMinutes,
          entertainment: todayScreenTime.entertainmentMinutes
        } : { total: 0, productive: 0, entertainment: 0 },
        professionalEfficiencyScore,
        wellbeingScore,
        todayReflection,
        latestAnalysis,
        recentReflections
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const getWeeklySummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const weeklyTasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: weekAgo }
    });

    const weeklyScreenTime = await ScreenTime.find({
      userId: req.userId,
      date: { $gte: weekAgo }
    });

    const weeklyReflections = await Reflection.find({
      userId: req.userId,
      createdAt: { $gte: weekAgo }
    });

    const totalTasks = weeklyTasks.length;
    const completedTasksCount = weeklyTasks.filter(t => t.status === 'completed').length;
    const avgCompletion = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    const totalScreenTime = weeklyScreenTime.reduce((sum, st) => sum + st.totalMinutes, 0);
    const avgScreenTime = weeklyScreenTime.length > 0 ? Math.round(totalScreenTime / weeklyScreenTime.length) : 0;

    res.json({
      weeklySummary: {
        totalTasks,
        completedTasks: completedTasksCount,
        avgCompletion,
        totalScreenTime,
        avgScreenTime,
        reflectionCount: weeklyReflections.length
      }
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
};
