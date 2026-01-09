import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number; // % từ BE
    isPositive: boolean; // giữ để tương thích
    label?: string; // vd: so với hôm qua
  };
  variant?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
}

const variantStyles = {
  default: {
    card: "bg-card border border-border",
    icon: "bg-primary/10 text-primary",
    text: "text-foreground",
    subtext: "text-muted-foreground",
  },
  primary: {
    card: "bg-card border border-border",
    icon: "bg-primary/10 text-primary",
    text: "text-foreground",
    subtext: "text-muted-foreground",
  },
  success: {
    card: "bg-card border border-border",
    icon: "bg-success/10 text-success",
    text: "text-foreground",
    subtext: "text-muted-foreground",
  },
  warning: {
    card: "bg-card border border-border",
    icon: "bg-warning/10 text-warning",
    text: "text-foreground",
    subtext: "text-muted-foreground",
  },
  info: {
    card: "bg-card border border-border",
    icon: "bg-info/10 text-info",
    text: "text-foreground",
    subtext: "text-muted-foreground",
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-shadow hover:shadow-md",
        styles.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className={cn("text-sm font-medium", styles.subtext)}>{title}</p>

          <p className={cn("text-2xl font-semibold", styles.text)}>{value}</p>

          {trend && (
            <p className="text-sm flex items-center gap-1">
              <span
                className={cn(
                  trend.value < 0 ? "text-destructive" : "text-success"
                )}
              >
                {trend.value < 0 ? "↓" : "↑"}
              </span>

              <span
                className={cn(
                  trend.value < 0 ? "text-destructive" : "text-success"
                )}
              >
                {Math.abs(trend.value)}%
              </span>

              <span className={styles.subtext}>
                {trend.label || "so với tháng trước"}
              </span>
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            styles.icon
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
