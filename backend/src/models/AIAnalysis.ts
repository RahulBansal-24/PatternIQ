import mongoose, { Document, Schema } from 'mongoose';

export interface IAIAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const AIAnalysisSchema = new Schema<IAIAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    dailyGrowthAnalysis: {
      type: String,
      required: true
    },
    rootCause: {
      type: String,
      required: true
    },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    personalizedRecommendation: {
      type: String,
      required: false
    },
    behavioralPatterns: [{
      pattern: { type: String, required: true },
      description: { type: String, required: true },
      frequency: { type: String, required: true },
      impact: { type: String, required: true }
    }],
    recommendations: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      priority: { type: String, required: true }
    }],
    efficiencyFactors: [{
      factor: { type: String, required: true },
      impact: { type: String, required: true },
      score: { type: Number, required: true }
    }],
    evidence: {
      currentDayData: {
        plannedTasks: { type: Number, required: true },
        completedTasks: { type: Number, required: true },
        taskCompletionRate: { type: Number, required: true },
        screenTime: { type: Number, required: true },
        reflection: { type: String, required: true },
        mood: { type: String, required: true },
        energy: { type: String, required: true },
        motivation: { type: String, required: true }
      },
      historicalData: {
        last30Days: {
          totalTasks: { type: Number, required: true },
          completedTasks: { type: Number, required: true },
          avgTaskCompletionRate: { type: Number, required: true },
          avgScreenTimeMinutes: { type: Number, required: true },
          avgProductiveTimeMinutes: { type: Number, required: true },
          moodDistribution: { type: Map, of: Number, required: true },
          energyDistribution: { type: Map, of: Number, required: true }
        }
      }
    }
  },
  {
    timestamps: true
  }
);

AIAnalysisSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);
