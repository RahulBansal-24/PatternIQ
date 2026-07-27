import Groq from 'groq-sdk';
import Task from '../models/Task';
import Reflection from '../models/Reflection';
import ScreenTime from '../models/ScreenTime';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

interface EvidenceData {
  userId: string;
  currentDate: Date;
  currentDayData: {
    plannedTasks: number;
    completedTasks: number;
    taskCompletionRate: number;
    screenTime: number;
    reflection: string;
    mood: string;
    energy: string;
    motivation: string;
  };
  historicalData: {
    last30Days: {
      totalTasks: number;
      completedTasks: number;
      avgTaskCompletionRate: number;
      avgScreenTimeMinutes: number;
      avgProductiveTimeMinutes: number;
      moodDistribution: Record<string, number>;
      energyDistribution: Record<string, number>;
    };
  };
}

export const generateEvidence = async (userId: string, currentDate: Date): Promise<EvidenceData> => {
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch current day's data
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const [todayTasks, todayReflection, todayScreenTime] = await Promise.all([
    Task.find({ userId, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
    Reflection.findOne({ userId, createdAt: { $gte: startOfDay, $lte: endOfDay } }),
    ScreenTime.findOne({ userId, date: { $gte: startOfDay, $lte: endOfDay } })
  ]);

  const plannedTasks = todayTasks.length;
  const completedTasks = todayTasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = plannedTasks > 0 ? (completedTasks / plannedTasks) * 100 : 0;

  const screenTime = todayScreenTime?.totalMinutes || 0;
  const reflection = todayReflection?.text || '';
  const mood = todayReflection?.mood || 'neutral';
  const energy = todayReflection?.energy || 'neutral';
  const motivation = todayReflection?.motivation || 'neutral';

  // Fetch historical data (last 30 days)
  const [historicalTasks, historicalReflections, historicalScreenTimes] = await Promise.all([
    Task.find({ userId, createdAt: { $gte: thirtyDaysAgo, $lte: currentDate } }),
    Reflection.find({ userId, createdAt: { $gte: thirtyDaysAgo, $lte: currentDate } }),
    ScreenTime.find({ userId, date: { $gte: thirtyDaysAgo, $lte: currentDate } })
  ]);

  const totalTasks = historicalTasks.length;
  const historicalCompletedTasks = historicalTasks.filter(t => t.status === 'completed').length;
  const avgTaskCompletionRate = totalTasks > 0 ? (historicalCompletedTasks / totalTasks) * 100 : 0;

  const avgScreenTimeMinutes = historicalScreenTimes.length > 0
    ? historicalScreenTimes.reduce((sum, st) => sum + st.totalMinutes, 0) / historicalScreenTimes.length
    : 0;

  const avgProductiveTimeMinutes = historicalScreenTimes.length > 0
    ? historicalScreenTimes.reduce((sum, st) => sum + st.productiveMinutes, 0) / historicalScreenTimes.length
    : 0;

  const moodDistribution = historicalReflections.reduce((acc, r) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const energyDistribution = historicalReflections.reduce((acc, r) => {
    acc[r.energy] = (acc[r.energy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    userId,
    currentDate,
    currentDayData: {
      plannedTasks,
      completedTasks,
      taskCompletionRate,
      screenTime,
      reflection,
      mood,
      energy,
      motivation
    },
    historicalData: {
      last30Days: {
        totalTasks,
        completedTasks: historicalCompletedTasks,
        avgTaskCompletionRate,
        avgScreenTimeMinutes,
        avgProductiveTimeMinutes,
        moodDistribution,
        energyDistribution
      }
    }
  };
};

export const analyzeWithAI = async (evidence: EvidenceData) => {
  try {
    console.log('Initializing Groq AI model...');
    
    const systemPrompt = `You are an AI behavioral intelligence analyst for PatternIQ. Analyze the provided evidence about a user's productivity patterns and generate insights. Your response must be a valid JSON object with the following structure:
{
  "dailyGrowthAnalysis": "string - Detailed analysis of today's productivity",
  "rootCause": "string - Main factors influencing today's productivity",
  "confidenceScore": "number between 0 and 100",
  "personalizedRecommendation": "string - A personalized, actionable recommendation for the user based on their specific patterns and data",
  "behavioralPatterns": [{
    "pattern": "string - Name of the pattern",
    "description": "string - Description of the pattern",
    "frequency": "string - How often this occurs",
    "impact": "string - positive/negative/neutral"
  }],
  "recommendations": [{
    "title": "string - Title of recommendation",
    "description": "string - Detailed description",
    "priority": "string - high/medium/low"
  }],
  "efficiencyFactors": [{
    "factor": "string - Factor name",
    "impact": "string - positive/negative",
    "score": "number - 0-100"
  }]
}`;

    const userPrompt = `Analyze this behavioral evidence and provide insights:\n\n${JSON.stringify(evidence, null, 2)}`;

    console.log('Sending request to Groq AI...');
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content || '';
    console.log('Groq AI Response received:', response);
    
    console.log('Parsing JSON...');
    const analysisData = JSON.parse(response);
    console.log('Parsed Analysis Data:', analysisData);
    return analysisData;
  } catch (error: any) {
    console.error('Groq AI Analysis Error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('API Response:', error.response);
    }
    // Fallback response if AI fails
    return {
      dailyGrowthAnalysis: 'Unable to generate AI analysis at this time. Please try again later.',
      rootCause: 'AI service unavailable',
      confidenceScore: 0,
      personalizedRecommendation: 'Unable to generate personalized recommendation at this time.',
      behavioralPatterns: [],
      recommendations: [],
      efficiencyFactors: []
    };
  }
};
