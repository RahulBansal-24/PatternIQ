import AIAnalysis from '../models/AIAnalysis';
import FortnightlyInsights from '../models/FortnightlyInsights';
import Task from '../models/Task';
import Reflection from '../models/Reflection';
import ScreenTime from '../models/ScreenTime';

export const generateFortnightlyInsights = async (userId: string) => {
  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  // Check if insights already exist for this period
  const existingInsights = await FortnightlyInsights.findOne({
    userId,
    startDate: fourteenDaysAgo
  });

  if (existingInsights) {
    return existingInsights;
  }

  // Fetch AI analyses for the past 14 days
  const aiAnalyses = await AIAnalysis.find({
    userId,
    date: { $gte: fourteenDaysAgo }
  }).sort({ date: 1 });

  // Fetch additional data for aggregation
  const [tasks, reflections, screenTimes] = await Promise.all([
    Task.find({
      userId,
      createdAt: { $gte: fourteenDaysAgo }
    }),
    Reflection.find({
      userId,
      createdAt: { $gte: fourteenDaysAgo }
    }),
    ScreenTime.find({
      userId,
      date: { $gte: fourteenDaysAgo }
    })
  ]);

  // Aggregate data
  const totalReflections = reflections.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const avgTaskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const avgScreenTime = screenTimes.length > 0 
    ? screenTimes.reduce((sum, st) => sum + st.totalMinutes, 0) / screenTimes.length 
    : 0;
  
  const avgProductiveTime = screenTimes.length > 0 
    ? screenTimes.reduce((sum, st) => sum + st.productiveMinutes, 0) / screenTimes.length 
    : 0;
  
  const avgEntertainmentTime = screenTimes.length > 0 
    ? screenTimes.reduce((sum, st) => sum + st.entertainmentMinutes, 0) / screenTimes.length 
    : 0;

  const moodTrends = reflections.reduce((acc, r) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const energyTrends = reflections.reduce((acc, r) => {
    acc[r.energy] = (acc[r.energy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const motivationTrends = reflections.reduce((acc, r) => {
    acc[r.motivation] = (acc[r.motivation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extract top behavioral patterns from AI analyses
  const patternFrequency: Record<string, { count: number; impact: string }> = {};
  
  aiAnalyses.forEach(analysis => {
    analysis.behavioralPatterns.forEach(pattern => {
      if (!patternFrequency[pattern.pattern]) {
        patternFrequency[pattern.pattern] = { count: 0, impact: pattern.impact };
      }
      patternFrequency[pattern.pattern].count++;
    });
  });

  const topBehavioralPatterns = Object.entries(patternFrequency)
    .map(([pattern, data]) => ({
      pattern,
      frequency: data.count,
      impact: data.impact
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  // Extract top recommendations from AI analyses
  const recommendationPriority: Record<string, { count: number; priority: string }> = {};
  
  aiAnalyses.forEach(analysis => {
    analysis.recommendations.forEach(rec => {
      if (!recommendationPriority[rec.title]) {
        recommendationPriority[rec.title] = { count: 0, priority: rec.priority };
      }
      recommendationPriority[rec.title].count++;
    });
  });

  const topRecommendations = Object.entries(recommendationPriority)
    .map(([title, data]) => ({
      title,
      priority: data.priority
    }))
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    })
    .slice(0, 3);

  // Generate insights based on aggregated data
  let patternDetected = 'Not enough data to detect patterns';
  let correlationFound = 'Not enough data to find correlations';
  let recommendation = 'Continue tracking your data to receive personalized insights';

  if (aiAnalyses.length > 0) {
    // Find most common pattern
    if (topBehavioralPatterns.length > 0) {
      const topPattern = topBehavioralPatterns[0];
      patternDetected = `${topPattern.pattern} (occurred ${topPattern.frequency} times)`;
    }

    // Find correlations based on data
    if (avgTaskCompletionRate > 70 && avgProductiveTime > 120) {
      correlationFound = 'Higher productive screen time correlates with better task completion';
    } else if (Object.keys(moodTrends).length > 0) {
      const dominantMood = Object.entries(moodTrends).sort((a, b) => b[1] - a[1])[0];
      correlationFound = `Your mood tends to be ${dominantMood[0].replace('_', ' ')} during this period`;
    }

    // Generate recommendation
    if (topRecommendations.length > 0) {
      recommendation = topRecommendations[0].title;
    } else if (avgEntertainmentTime > avgProductiveTime * 2) {
      recommendation = 'Consider reducing entertainment screen time to improve productivity';
    } else if (avgTaskCompletionRate < 50) {
      recommendation = 'Focus on completing fewer tasks with higher quality';
    } else {
      recommendation = 'Maintain your current productive habits';
    }
  }

  // Create and save fortnightly insights
  const insights = new FortnightlyInsights({
    userId,
    startDate: fourteenDaysAgo,
    endDate: today,
    patternDetected,
    correlationFound,
    recommendation,
    aggregatedData: {
      totalReflections,
      avgTaskCompletionRate,
      avgScreenTime,
      avgProductiveTime,
      avgEntertainmentTime,
      moodTrends,
      energyTrends,
      motivationTrends
    },
    topBehavioralPatterns,
    topRecommendations
  });

  await insights.save();
  return insights;
};

export const getLatestFortnightlyInsights = async (userId: string) => {
  const insights = await FortnightlyInsights.findOne({ userId })
    .sort({ startDate: -1 })
    .exec();
  
  return insights;
};
