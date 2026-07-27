import mongoose, { Document, Schema } from 'mongoose';

export interface IReflection extends Document {
  userId: mongoose.Types.ObjectId;
  text: string;
  mood: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  energy: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  motivation: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  createdAt: Date;
  updatedAt: Date;
}

const ReflectionSchema = new Schema<IReflection>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    text: {
      type: String,
      required: [true, 'Reflection text is required'],
      trim: true,
      minlength: [10, 'Reflection must be at least 10 characters'],
      maxlength: [2000, 'Reflection cannot exceed 2000 characters']
    },
    mood: {
      type: String,
      enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'],
      required: true
    },
    energy: {
      type: String,
      enum: ['very_low', 'low', 'medium', 'high', 'very_high'],
      required: true
    },
    motivation: {
      type: String,
      enum: ['very_low', 'low', 'medium', 'high', 'very_high'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

ReflectionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IReflection>('Reflection', ReflectionSchema);
