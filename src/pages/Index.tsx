import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { StatsCard } from "@/components/StatsCard";
import { WeatherMap } from "@/components/WeatherMap";
import { Thermometer, Droplets, Wind, Eye, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock weather data - in production, this would come from OpenWeather API
const mockWeatherData = {
  current: {
    location: "New York City",
    temperature: 22,
    condition: "partly cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    feelsLike: 25,
    icon: "partly-cloudy"
  },
  nearby: [
    {
      location: "Brooklyn",
      temperature: 20,
      condition: "sunny",
      humidity: 60,
      windSpeed: 8,
      visibility: 15,
      feelsLike: 23,
      icon: "sunny"
    },
    {
      location: "Queens",
      temperature: 21,
      condition: "cloudy",
      humidity: 70,
      windSpeed: 10,
      visibility: 12,
      feelsLike: 24,
      icon: "cloudy"
    },
    {
      location: "Manhattan",
      temperature: 23,
      condition: "partly cloudy",
      humidity: 68,
      windSpeed: 15,
      visibility: 8,
      feelsLike: 26,
      icon: "partly-cloudy"
    }
  ],
  forecast: [
    { day: "Today", condition: "partly cloudy", high: 24, low: 18, precipitation: 20 },
    { day: "Tomorrow", condition: "sunny", high: 26, low: 19, precipitation: 5 },
    { day: "Wednesday", condition: "rainy", high: 20, low: 15, precipitation: 80 },
    { day: "Thursday", condition: "cloudy", high: 22, low: 16, precipitation: 30 },
    { day: "Friday", condition: "sunny", high: 25, low: 18, precipitation: 10 },
    { day: "Saturday", condition: "partly cloudy", high: 23, low: 17, precipitation: 25 },
    { day: "Sunday", condition: "snowy", high: 18, low: 12, precipitation: 90 }
  ]
};

const Index = () => {
  const [weatherData, setWeatherData] = useState(mockWeatherData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLocationChange = async (location: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWeatherData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          location: location
        }
      }));
      setIsLoading(false);
      toast({
        title: "Location Updated",
        description: `Weather data updated for ${location}`,
      });
    }, 1500);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Weather data has been updated",
      });
    }, 1000);
  };

  const airQualityStats = [
    {
      label: "Air Quality Index",
      value: "Good (42)",
      trend: "up" as const,
      trendValue: "+2",
      icon: <Wind className="w-4 h-4" />
    },
    {
      label: "UV Index",
      value: "Moderate (6)",
      trend: "neutral" as const,
      trendValue: "0",
      icon: <Sun className="w-4 h-4" />
    },
    {
      label: "Pressure",
      value: "1013 hPa",
      trend: "down" as const,
      trendValue: "-2",
      icon: <Thermometer className="w-4 h-4" />
    }
  ];

  const comfortStats = [
    {
      label: "Comfort Level",
      value: "Comfortable",
      trend: "up" as const,
      trendValue: "Good",
      icon: <Thermometer className="w-4 h-4" />
    },
    {
      label: "Dew Point",
      value: "14°C",
      trend: "neutral" as const,
      trendValue: "0",
      icon: <Droplets className="w-4 h-4" />
    },
    {
      label: "Moon Phase",
      value: "Waxing Crescent",
      icon: <Moon className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header 
          onLocationChange={handleLocationChange}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Current Time Display */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="text-3xl font-light text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-6xl font-thin gradient-text mt-2">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Main Weather Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Main Weather Card */}
          <WeatherCard 
            {...weatherData.current}
            isMain={true}
          />

          {/* Nearby Locations */}
          {weatherData.nearby.map((location, index) => (
            <WeatherCard 
              key={location.location}
              {...location}
            />
          ))}
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <StatsCard 
            title="Air Quality & UV"
            stats={airQualityStats}
          />
          
          <StatsCard 
            title="Comfort & Astronomy"
            stats={comfortStats}
          />

          {/* Weather Map */}
          <WeatherMap location={weatherData.current.location} />
        </div>

        {/* Forecast */}
        <div className="grid grid-cols-1 gap-6">
          <ForecastCard forecasts={weatherData.forecast} />
        </div>
      </div>
    </div>
  );
};

export default Index;
