import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import Button from './Button';
import { useRouter } from 'next/navigation';

interface EmptyStateProps {
  type?: 'dashboard' | 'reflection' | 'analytics' | 'tasks';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  type = 'dashboard', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const router = useRouter();

  const content = {
    dashboard: {
      icon: Brain,
      title: title || 'Start Your Journey',
      description: description || 'Begin tracking your tasks and reflections to unlock AI-powered insights about your productivity patterns.',
      actionLabel: actionLabel || 'Add Your First Task',
      action: () => router.push('/dashboard/reflection'),
    },
    reflection: {
      icon: Sparkles,
      title: title || 'No Reflections Yet',
      description: description || 'Start reflecting on your day to help AI understand your behavioral patterns and provide personalized insights.',
      actionLabel: actionLabel || 'Create Your First Reflection',
      action: () => router.push('/dashboard/reflection'),
    },
    analytics: {
      icon: BarChart3,
      title: title || 'No Data to Analyze',
      description: description || 'Track your tasks and reflections for a few days to start seeing meaningful analytics and trends.',
      actionLabel: actionLabel || 'Go to Dashboard',
      action: () => router.push('/dashboard'),
    },
    tasks: {
      icon: Target,
      title: title || 'No Tasks Yet',
      description: description || 'Create your first task to start tracking your productivity and unlock AI insights.',
      actionLabel: actionLabel || 'Add Your First Task',
      action: () => router.push('/dashboard'),
    },
  };

  const current = content[type];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <Icon className="w-12 h-12 text-white" />
        </motion.div>
        <div className="absolute inset-0 gradient-bg rounded-3xl blur-2xl opacity-40" />
      </div>

      <h2 className="text-3xl font-bold mb-3 gradient-text text-center">{current.title}</h2>
      <p className="text-lg text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        {current.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          onClick={onAction || current.action}
          variant="gradient"
          size="lg"
          className="shadow-xl"
        >
          {current.actionLabel}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4"
        >
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-sm font-medium mb-1">Track Tasks</p>
          <p className="text-xs text-muted-foreground">Plan and complete your daily tasks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm font-medium mb-1">Reflect Daily</p>
          <p className="text-xs text-muted-foreground">Share your thoughts and feelings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4"
        >
          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-sm font-medium mb-1">Get Insights</p>
          <p className="text-xs text-muted-foreground">AI analyzes your patterns</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
