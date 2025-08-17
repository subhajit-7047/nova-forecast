export interface WeatherData {
  current: {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    feelsLike: number;
    icon: string;
  };
  nearby: Array<{
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    feelsLike: number;
    icon: string;
  }>;
  forecast: Array<{
    day: string;
    condition: string;
    high: number;
    low: number;
    precipitation: number;
  }>;
}

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenWeather API key not found, using mock data');
    return getMockWeatherData(location);
  }

  try {
    // Determine if location is coordinates or city name
    const isCoordinates = location.includes(',') && 
      !isNaN(parseFloat(location.split(',')[0])) && 
      !isNaN(parseFloat(location.split(',')[1]));

    let weatherUrl: string;
    
    if (isCoordinates) {
      const [lat, lon] = location.split(',');
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    }

    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Fetch forecast data
    let forecastUrl: string;
    if (isCoordinates) {
      const [lat, lon] = location.split(',');
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    }

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    return transformWeatherData(data, forecastData);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return getMockWeatherData(location);
  }
};

const transformWeatherData = (current: any, forecast: any): WeatherData => {
  const currentWeather = {
    location: current.name,
    temperature: Math.round(current.main.temp),
    condition: current.weather[0].description,
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
    visibility: Math.round((current.visibility || 10000) / 1000), // Convert to km
    feelsLike: Math.round(current.main.feels_like),
    icon: current.weather[0].icon
  };

  // Generate nearby locations (mock data for now)
  const nearby = [
    {
      location: "Nearby Area 1",
      temperature: currentWeather.temperature - 2,
      condition: "partly cloudy",
      humidity: currentWeather.humidity - 5,
      windSpeed: currentWeather.windSpeed + 3,
      visibility: currentWeather.visibility,
      feelsLike: currentWeather.feelsLike - 2,
      icon: "02d"
    },
    {
      location: "Nearby Area 2",
      temperature: currentWeather.temperature + 1,
      condition: "sunny",
      humidity: currentWeather.humidity + 3,
      windSpeed: currentWeather.windSpeed - 2,
      visibility: currentWeather.visibility + 2,
      feelsLike: currentWeather.feelsLike + 1,
      icon: "01d"
    },
    {
      location: "Nearby Area 3",
      temperature: currentWeather.temperature,
      condition: currentWeather.condition,
      humidity: currentWeather.humidity,
      windSpeed: currentWeather.windSpeed,
      visibility: currentWeather.visibility,
      feelsLike: currentWeather.feelsLike,
      icon: currentWeather.icon
    }
  ];

  // Transform forecast data
  const dailyForecasts = [];
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  for (let i = 0; i < 7; i++) {
    const dayData = forecast.list?.[i * 8] || forecast.list?.[0]; // Get data every 8 items (24h apart)
    if (dayData) {
      dailyForecasts.push({
        day: days[i] || new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        condition: dayData.weather[0].description,
        high: Math.round(dayData.main.temp_max),
        low: Math.round(dayData.main.temp_min),
        precipitation: Math.round((dayData.pop || 0) * 100)
      });
    }
  }

  return {
    current: currentWeather,
    nearby,
    forecast: dailyForecasts
  };
};

const getMockWeatherData = (location: string): WeatherData => {
  const locationName = typeof location === 'string' && location.includes(',') 
    ? "Current Location" 
    : location || "New York City";

  return {
    current: {
      location: locationName,
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
        location: "Nearby Area 1",
        temperature: 20,
        condition: "sunny",
        humidity: 60,
        windSpeed: 8,
        visibility: 15,
        feelsLike: 23,
        icon: "sunny"
      },
      {
        location: "Nearby Area 2",
        temperature: 21,
        condition: "cloudy",
        humidity: 70,
        windSpeed: 10,
        visibility: 12,
        feelsLike: 24,
        icon: "cloudy"
      },
      {
        location: "Nearby Area 3",
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
};