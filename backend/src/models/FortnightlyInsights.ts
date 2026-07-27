import mongoose, { Document, Schema } from 'mongoose';

export interface IFortnightlyInsights extends Document {
  userId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  patternDetected: string;
  correlationFound: string;
  recommendation: string;
  aggregatedData: {
    totalReflections: number;
    avgTaskCompletionRate: number;
    avgScreenTime: number;
    avgProductiveTime: number;
    avgEntertainmentTime: number;
    moodTrends: Record<string, number>;
    energyTrends: Record<string, number>;
    motivationTrends: Record<string, number>;
  };
  topBehavioralPatterns: Array<{
    pattern: string;
    frequency: number;
    impact: string;
  }>;
  topRecommendations: Array<{
    title: string;
    priority: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const FortnightlyInsightsSchema = new Schema<IFortnightlyInsights>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: true,
      index: true
    },
    patternDetected: {
      type: String,
      required: true
    },
    correlationFound: {
      type: String,
      required: true
    },
    recommendation: {
      type: String,
      required: true
    },
    aggregatedData: {
      totalReflections: { type: Number, required: true },
      avgTaskCompletionRate: { type: Number, required: true },
      avgScreenTime: { type: Number, required: true },
      avgProductiveTime: { type: Number, required: true },
      avgEntertainmentTime: { type: Number, required: true },
      moodTrends: { type: Map, of: Number, required: true },
      energyTrends: { type: Map, of: Number, required: true },
      motivationTrends: { type: Map, of: Number, required: true }
    },
    topBehavioralPatterns: [{
      pattern: { type: String, required: true },
      frequency: { type: Number, required: true },
      impact: { type: String, required: true }
    }],
    topRecommendations: [{
      title: { type: String, required: true },
      priority: { type: String, required: true }
    }]
  },
  {
    timestamps: true
  }
);

FortnightlyInsightsSchema.index({ userId: 1, startDate: -1 });

export default mongoose.model<IFortnightlyInsights>('FortnightlyInsights', FortnightlyInsightsSchema);
