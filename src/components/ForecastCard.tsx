import { Cloud, CloudRain, Sun, Snowflake } from "lucide-react";

interface ForecastData {
  day: string;
  condition: string;
  high: number;
  low: number;
  precipitation: number;
}

interface ForecastCardProps {
  forecasts: ForecastData[];
}

const getWeatherIcon = (condition: string) => {
  const iconProps = {
    size: 32,
    className: "weather-icon"
  };

  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun {...iconProps} className={`${iconProps.className} text-weather-sunny`} />;
    case 'cloudy':
    case 'partly cloudy':
      return <Cloud {...iconProps} className={`${iconProps.className} text-weather-cloudy`} />;
    case 'rainy':
    case 'rain':
      return <CloudRain {...iconProps} className={`${iconProps.className} text-weather-rainy`} />;
    case 'snowy':
    case 'snow':
      return <Snowflake {...iconProps} className={`${iconProps.className} text-weather-snowy`} />;
    default:
      return <Sun {...iconProps} className={`${iconProps.className} text-weather-sunny`} />;
  }
};

export const ForecastCard = ({ forecasts }: ForecastCardProps) => {
  return (
    <div className="weather-card-glow col-span-full animate-fade-in-up">
      <h3 className="text-xl font-semibold mb-6 gradient-text">7-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecasts.map((forecast, index) => (
          <div 
            key={forecast.day}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Day */}
            <div className="flex-1">
              <p className="font-medium text-foreground">{forecast.day}</p>
              <p className="text-sm text-muted-foreground capitalize">{forecast.condition}</p>
            </div>
            
            {/* Weather Icon */}
            <div className="flex-shrink-0 mx-4">
              {getWeatherIcon(forecast.condition)}
            </div>
            
            {/* Precipitation */}
            <div className="flex-shrink-0 text-center mx-4">
              <p className="text-xs text-muted-foreground">Precipitation</p>
              <p className="text-sm font-medium text-primary">{forecast.precipitation}%</p>
            </div>
            
            {/* Temperature Range */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-lg font-semibold text-foreground">{forecast.high}°</span>
              <span className="text-lg text-muted-foreground">{forecast.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};