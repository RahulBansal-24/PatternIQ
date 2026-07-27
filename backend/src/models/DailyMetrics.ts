import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyMetrics extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  professionalEfficiencyScore: number;
  wellbeingScore: number;
  taskCompletionRate: number;
  planningAccuracy: number;
  consistencyScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyMetricsSchema = new Schema<IDailyMetrics>(
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
    professionalEfficiencyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    wellbeingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    taskCompletionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    planningAccuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    consistencyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

DailyMetricsSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IDailyMetrics>('DailyMetrics', DailyMetricsSchema);
