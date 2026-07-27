import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circular' | 'bar';
  width?: string;
  height?: string;
}

export default function Skeleton({ 
  className, 
  variant = 'default', 
  width, 
  height 
}: SkeletonProps) {
  const variants = {
    default: 'rounded-lg',
    card: 'rounded-2xl',
    text: 'rounded h-4',
    circular: 'rounded-full',
    bar: 'rounded-full h-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      className={cn(
        'bg-muted shimmer',
        variants[variant],
        width && `w-[${width}]`,
        height && `h-[${height}]`,
        className
      )}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass border-0 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="bar" width="100%" />
      <Skeleton variant="bar" width="80%" />
      <Skeleton variant="bar" width="90%" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass border-0 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width="48px" height="48px" />
        <Skeleton variant="text" width="60px" />
      </div>
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="30%" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass border-0 rounded-2xl p-6 space-y-4">
      <Skeleton variant="text" width="40%" />
      <div className="h-[320px] flex items-center justify-center">
        <div className="space-y-3 w-full">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="bar" width="100%" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass border-0 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="20%" className="ml-auto" />
      </div>
      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="circular" width="40px" height="40px" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </div>
            <Skeleton variant="text" width="80px" />
          </div>
        ))}
      </div>
    </div>
  );
}
