import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  userId: mongoose.Types.ObjectId;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    dailyReminder: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    shareData: boolean;
    anonymousAnalytics: boolean;
  };
  preferences: {
    defaultTaskPriority: 'low' | 'medium' | 'high';
    reflectionReminderTime: string;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      dailyReminder: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true }
    },
    privacy: {
      shareData: { type: Boolean, default: false },
      anonymousAnalytics: { type: Boolean, default: true }
    },
    preferences: {
      defaultTaskPriority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      reflectionReminderTime: {
        type: String,
        default: '20:00'
      },
      timezone: {
        type: String,
        default: 'UTC'
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
