import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, ...props }, ref) => {
    const MotionButton = motion.button;
    
    const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
      outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      gradient: 'gradient-bg text-white shadow-lg hover:shadow-xl hover:scale-105',
    };
    
    const sizes = {
      default: 'h-11 px-6 py-2.5',
      sm: 'h-9 rounded-lg px-4 text-xs',
      lg: 'h-14 rounded-xl px-8 text-base',
      icon: 'h-11 w-11',
    };

    return (
      <MotionButton
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          variant === 'gradient' && 'btn-hover',
          className
        )}
        whileHover={variant === 'gradient' ? { scale: 1.02 } : { scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
