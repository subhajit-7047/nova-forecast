import { useState, useEffect } from 'react';
import { fetchWeatherData, WeatherData } from '@/lib/weather-api';
import { generateMLForecast, MLForecast } from '@/lib/ml-forecasting';
import { useToast } from './use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export const useWeatherData = (locationData: LocationData | null = null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [mlForecast, setMlForecast] = useState<MLForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!locationData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching weather data for:', locationData);
      
      // Use coordinates if available, otherwise fall back to city name
      const query = locationData.latitude && locationData.longitude 
        ? `${locationData.latitude},${locationData.longitude}`
        : `${locationData.city},${locationData.country}`;
        
      const data = await fetchWeatherData(query);
      setWeatherData(data);
      
      // Generate ML forecast
      const mlForecast = await generateMLForecast(data);
      setMlForecast(mlForecast);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast({
        title: "Weather Data Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [locationData?.latitude, locationData?.longitude, locationData?.city]);

  const refetch = () => {
    fetchData();
  };

  return {
    weatherData,
    mlForecast,
    loading,
    error,
    refetch
  };
};