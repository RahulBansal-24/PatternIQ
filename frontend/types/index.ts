export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planned' | 'in_progress' | 'completed';
  completedAt?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reflection {
  _id: string;
  userId: string;
  text: string;
  mood: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  energy: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  motivation: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  createdAt: string;
  updatedAt: string;
}

export interface ScreenTime {
  _id: string;
  userId: string;
  date: string;
  totalMinutes: number;
  productiveMinutes: number;
  entertainmentMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  _id: string;
  userId: string;
  date: string;
  dailyGrowthAnalysis: string;
  rootCause: string;
  confidenceScore: number;
  personalizedRecommendation: string;
  behavioralPatterns: Array<{
    pattern: string;
    description: string;
    frequency: string;
    impact: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: string;
  }>;
  efficiencyFactors: Array<{
    factor: string;
    impact: string;
    score: number;
  }>;
  evidence: {
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
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  plannedTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionPercentage: number;
  screenTime: {
    total: number;
    productive: number;
    entertainment: number;
  };
  professionalEfficiencyScore: number;
  wellbeingScore: number;
  todayReflection: Reflection | null;
  latestAnalysis: AIAnalysis | null;
  recentReflections: Reflection[];
}

export interface BehaviorPattern {
  _id: string;
  userId: string;
  pattern: string;
  description: string;
  confidenceScore: number;
  frequency: number;
  lastObserved: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
