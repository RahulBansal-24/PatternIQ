import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Task title is required' });
      return;
    }

    const task = new Task({
      userId: req.userId,
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    await task.save();

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority } = req.query;
    const filter: any = { userId: req.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) {
      task.status = status;
      if (status === 'completed' && !task.completedAt) {
        task.completedAt = new Date();
      }
    }
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const getTodayTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: req.userId,
      createdAt: { $gte: today, $lt: tomorrow }
    }).sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch today tasks' });
  }
};
