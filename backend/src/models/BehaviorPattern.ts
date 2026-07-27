import mongoose, { Document, Schema } from 'mongoose';

export interface IBehaviorPattern extends Document {
  userId: mongoose.Types.ObjectId;
  pattern: string;
  description: string;
  confidenceScore: number;
  frequency: number;
  lastObserved: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BehaviorPatternSchema = new Schema<IBehaviorPattern>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    pattern: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    frequency: {
      type: Number,
      required: true,
      min: 1
    },
    lastObserved: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

BehaviorPatternSchema.index({ userId: 1, isActive: 1 });
BehaviorPatternSchema.index({ userId: 1, confidenceScore: -1 });

export default mongoose.model<IBehaviorPattern>('BehaviorPattern', BehaviorPatternSchema);
