import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planned' | 'in_progress' | 'completed';
  completedAt?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed'],
      default: 'planned'
    },
    completedAt: {
      type: Date,
      default: null
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, status: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
