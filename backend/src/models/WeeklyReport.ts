import mongoose, { Document, Schema } from 'mongoose';

export interface IWeeklyReport extends Document {
  userId: mongoose.Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  summary: string;
  keyInsights: string[];
  achievements: string[];
  improvements: string[];
  averageEfficiencyScore: number;
  averageWellbeingScore: number;
  totalTasksCompleted: number;
  totalScreenTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyReportSchema = new Schema<IWeeklyReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    weekStart: {
      type: Date,
      required: true,
      index: true
    },
    weekEnd: {
      type: Date,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    keyInsights: [{
      type: String
    }],
    achievements: [{
      type: String
    }],
    improvements: [{
      type: String
    }],
    averageEfficiencyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    averageWellbeingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    totalTasksCompleted: {
      type: Number,
      required: true,
      min: 0
    },
    totalScreenTime: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

WeeklyReportSchema.index({ userId: 1, weekStart: -1 });

export default mongoose.model<IWeeklyReport>('WeeklyReport', WeeklyReportSchema);
