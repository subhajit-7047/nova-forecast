import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

interface StatsCardProps {
  title: string;
  stats: StatItem[];
}

export const StatsCard = ({ title, stats }: StatsCardProps) => {
  return (
    <div className="weather-card-glow animate-fade-in-up">
      <h3 className="text-lg font-semibold mb-6 gradient-accent-text">{title}</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-all duration-300"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center space-x-3">
              {stat.icon && (
                <div className="text-primary">
                  {stat.icon}
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
            
            {stat.trend && stat.trendValue && (
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' 
                  ? 'text-green-400' 
                  : stat.trend === 'down' 
                    ? 'text-red-400' 
                    : 'text-muted-foreground'
              }`}>
                {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                {stat.trend === 'neutral' && <Activity className="w-4 h-4" />}
                <span>{stat.trendValue}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};