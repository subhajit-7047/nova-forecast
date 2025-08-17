import { Cloud, CloudRain, Sun, Snowflake, Wind, Droplets, Eye, Thermometer } from "lucide-react";

interface WeatherCardProps {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  icon: string;
  isMain?: boolean;
}

const getWeatherIcon = (condition: string, size: number = 48) => {
  const iconProps = {
    size,
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

export const WeatherCard = ({ 
  location, 
  temperature, 
  condition, 
  humidity, 
  windSpeed, 
  visibility, 
  feelsLike,
  icon,
  isMain = false 
}: WeatherCardProps) => {
  return (
    <div className={`weather-card-glow animate-fade-in-up ${isMain ? 'col-span-2' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{location}</h3>
          <p className="text-sm text-muted-foreground capitalize">{condition}</p>
        </div>
        <div className="animate-float">
          {getWeatherIcon(condition, isMain ? 64 : 48)}
        </div>
      </div>

      {/* Temperature Display */}
      <div className="mb-6">
        <div className={`temp-display ${isMain ? 'text-6xl' : 'text-4xl'}`}>
          {temperature}°C
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Feels like {feelsLike}°C
        </p>
      </div>

      {/* Weather Details */}
      <div className={`grid ${isMain ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-medium">{humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-sm font-medium">{windSpeed} km/h</p>
          </div>
        </div>
        
        {isMain && (
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium">{visibility} km</p>
            </div>
          </div>
        )}
      </div>

      {/* Live indicator for main card */}
      {isMain && (
        <div className="mt-6 flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full pulse-glow"></div>
          <span className="text-xs text-muted-foreground">Live data</span>
        </div>
      )}
    </div>
  );
};