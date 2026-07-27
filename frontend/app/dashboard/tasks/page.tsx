'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, CheckCircle, Circle, Clock, Trash2, Edit, Calendar, TrendingUp } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planned' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt: string;
}

export default function TasksPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const, dueDate: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchTasks();
  }, [isAuthenticated, router]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data.task]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowAddForm(false);
      toast.success('Task added successfully');
    } catch (error: any) {
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus as any } : task
      ));
      toast.success('Task status updated');
    } catch (error: any) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted');
    } catch (error: any) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const response = await api.put(`/tasks/${editingTask._id}`, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate
      });
      setTasks(tasks.map(task => 
        task._id === editingTask._id ? response.data.task : task
      ));
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error: any) {
      toast.error('Failed to update task');
    }
  };

  const ongoingTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'planned');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-cyan-50/50 to-emerald-100/50 dark:from-slate-950 dark:via-teal-950/50 dark:to-emerald-950/50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Tasks</h1>
            <p className="text-muted-foreground">Manage your daily tasks and track progress</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gradient-bg text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </motion.div>

        {/* Add Task Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="glass border-0">
              <CardContent className="p-6">
                <form onSubmit={handleAddTask} className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="bg-white/50 dark:bg-gray-800/50"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                  <div className="flex gap-4">
                    <select
                      value={newTask.priority}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="flex-1 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="flex-1 bg-white/50 dark:bg-gray-800/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="gradient-bg text-white">
                      Add Task
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Ongoing Tasks</p>
                    <p className="text-3xl font-bold">{ongoingTasks.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
                    <p className="text-3xl font-bold">{completedTasks.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="glass border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold">
                      {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ongoing Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="glass border-0 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Ongoing Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ongoingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No ongoing tasks</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ongoingTasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold mb-1">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdateTaskStatus(task._id, 'completed')}
                              className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                              title="Mark as complete"
                            >
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </button>
                            <button
                              onClick={() => setEditingTask(task)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Completed Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="glass border-0 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed tasks yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedTasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl opacity-70"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold mb-1 line-through text-muted-foreground">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-through">{task.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdateTaskStatus(task._id, 'in_progress')}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Mark as ongoing"
                            >
                              <Circle className="w-5 h-5 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Edit Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditTask} className="space-y-4">
                    <Input
                      placeholder="Task title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="bg-white/50 dark:bg-gray-800/50"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-teal-500"
                      rows={3}
                    />
                    <div className="flex gap-4">
                      <select
                        value={editingTask.priority}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                        className="flex-1 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <Input
                        type="date"
                        value={editingTask.dueDate || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                        className="flex-1 bg-white/50 dark:bg-gray-800/50"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="gradient-bg text-white">
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingTask(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
