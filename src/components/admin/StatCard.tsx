import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  className?: string;
}

const variantStyles = {
  default: {
    card: 'bg-card border border-border',
    icon: 'bg-primary/10 text-primary',
    text: 'text-foreground',
    subtext: 'text-muted-foreground',
  },
  primary: {
    card: 'bg-gradient-to-br from-primary to-primary/80 text-white border-0',
    icon: 'bg-white/20 text-white',
    text: 'text-white',
    subtext: 'text-white/80',
  },
  success: {
    card: 'bg-gradient-to-br from-success to-success/80 text-white border-0',
    icon: 'bg-white/20 text-white',
    text: 'text-white',
    subtext: 'text-white/80',
  },
  warning: {
    card: 'bg-gradient-to-br from-warning to-warning/80 text-white border-0',
    icon: 'bg-white/20 text-white',
    text: 'text-white',
    subtext: 'text-white/80',
  },
  info: {
    card: 'bg-gradient-to-br from-info to-info/80 text-white border-0',
    icon: 'bg-white/20 text-white',
    text: 'text-white',
    subtext: 'text-white/80',
  },
};

const StatCard = ({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in',
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', styles.subtext)}>
            {title}
          </p>
          <p className={cn('text-2xl lg:text-3xl font-bold tracking-tight', styles.text)}>
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'text-sm font-medium flex items-center gap-1',
                variant === 'default' 
                  ? (trend.isPositive ? 'text-success' : 'text-destructive')
                  : styles.subtext
              )}
            >
              <span className={cn(
                'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs',
                variant === 'default'
                  ? (trend.isPositive ? 'bg-success/10' : 'bg-destructive/10')
                  : 'bg-white/20'
              )}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {Math.abs(trend.value)}% so với tháng trước
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-xl',
            styles.icon
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
