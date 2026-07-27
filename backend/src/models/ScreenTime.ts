import mongoose, { Document, Schema } from 'mongoose';

export interface IScreenTime extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  totalMinutes: number;
  productiveMinutes: number;
  entertainmentMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScreenTimeSchema = new Schema<IScreenTime>(
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
    totalMinutes: {
      type: Number,
      required: true,
      min: [0, 'Total minutes cannot be negative']
    },
    productiveMinutes: {
      type: Number,
      required: true,
      min: [0, 'Productive minutes cannot be negative']
    },
    entertainmentMinutes: {
      type: Number,
      required: true,
      min: [0, 'Entertainment minutes cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

ScreenTimeSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IScreenTime>('ScreenTime', ScreenTimeSchema);
