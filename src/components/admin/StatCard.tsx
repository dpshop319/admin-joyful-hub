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
  variant?: 'default' | 'primary';
}

const StatCard = ({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) => {
  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-200',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground'
          : 'bg-card border border-border hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                'mt-2 text-sm',
                trend.isPositive ? 'text-success' : 'text-destructive',
                variant === 'primary' && 'text-primary-foreground/90'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% so với tháng trước
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            variant === 'primary'
              ? 'bg-primary-foreground/10'
              : 'bg-primary/10'
          )}
        >
          <Icon
            className={cn(
              'h-6 w-6',
              variant === 'primary' ? 'text-primary-foreground' : 'text-primary'
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
