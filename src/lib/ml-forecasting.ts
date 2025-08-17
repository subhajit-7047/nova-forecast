import { WeatherData } from './weather-api';

export interface MLPrediction {
  timeframe: string;
  temperature: number;
  condition: string;
  precipitation: number;
  confidence: number;
}

export interface MLForecast {
  predictions: MLPrediction[];
  insights: string[];
  accuracy: number;
  lastUpdated: Date;
}

// Simple ML-like algorithm for weather prediction
export const generateMLForecast = async (weatherData: WeatherData): Promise<MLForecast> => {
  // Simulate ML processing time
  await new Promise(resolve => setTimeout(resolve, 500));

  const current = weatherData.current;
  const forecast = weatherData.forecast;

  // Generate predictions based on current conditions and trends
  const predictions: MLPrediction[] = [
    {
      timeframe: "Next 3 Hours",
      temperature: current.temperature + getTemperatureTrend(current.condition, 3),
      condition: getPredictedCondition(current.condition, current.humidity, 0.1),
      precipitation: getPrecipitationChance(current.condition, current.humidity),
      confidence: 0.92
    },
    {
      timeframe: "Next 6 Hours", 
      temperature: current.temperature + getTemperatureTrend(current.condition, 6),
      condition: getPredictedCondition(current.condition, current.humidity, 0.2),
      precipitation: getPrecipitationChance(current.condition, current.humidity) + 5,
      confidence: 0.85
    },
    {
      timeframe: "Next 12 Hours",
      temperature: current.temperature + getTemperatureTrend(current.condition, 12),
      condition: getPredictedCondition(current.condition, current.humidity, 0.3),
      precipitation: forecast[0]?.precipitation || 20,
      confidence: 0.78
    },
    {
      timeframe: "Next 24 Hours",
      temperature: forecast[1]?.high || current.temperature + 2,
      condition: forecast[1]?.condition || current.condition,
      precipitation: forecast[1]?.precipitation || 25,
      confidence: 0.71
    }
  ];

  // Generate AI insights
  const insights = generateInsights(current, forecast, predictions);

  return {
    predictions,
    insights,
    accuracy: calculateAccuracy(predictions),
    lastUpdated: new Date()
  };
};

const getTemperatureTrend = (condition: string, hoursAhead: number): number => {
  const timeOfDay = new Date().getHours();
  let baseTrend = 0;

  // Time-based temperature trends
  if (timeOfDay >= 6 && timeOfDay <= 14) {
    baseTrend = hoursAhead <= 6 ? 2 : 1; // Rising temperature in morning/afternoon
  } else if (timeOfDay >= 15 && timeOfDay <= 20) {
    baseTrend = hoursAhead <= 3 ? 0 : -1; // Stable then falling in evening
  } else {
    baseTrend = -Math.floor(hoursAhead / 4); // Falling at night
  }

  // Condition-based adjustments
  if (condition.includes('rain') || condition.includes('storm')) {
    baseTrend -= 1;
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    baseTrend += 1;
  }

  return Math.max(-5, Math.min(5, baseTrend));
};

const getPredictedCondition = (currentCondition: string, humidity: number, uncertainty: number): string => {
  const conditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy'];
  
  // Higher humidity increases chance of precipitation
  if (humidity > 80 && Math.random() < 0.3 + uncertainty) {
    return Math.random() < 0.7 ? 'rainy' : 'stormy';
  }
  
  if (humidity > 65 && Math.random() < 0.4 + uncertainty) {
    return Math.random() < 0.8 ? 'cloudy' : 'partly cloudy';
  }
  
  // Otherwise, trend toward current condition with some variation
  const currentIndex = conditions.indexOf(currentCondition.toLowerCase()) || 0;
  const variation = Math.floor((Math.random() - 0.5) * 2 * (1 + uncertainty));
  const newIndex = Math.max(0, Math.min(conditions.length - 1, currentIndex + variation));
  
  return conditions[newIndex];
};

const getPrecipitationChance = (condition: string, humidity: number): number => {
  let baseChance = 0;
  
  if (condition.includes('rain') || condition.includes('storm')) {
    baseChance = 70;
  } else if (condition.includes('cloudy')) {
    baseChance = 25;
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    baseChance = 5;
  } else {
    baseChance = 15;
  }
  
  // Humidity adjustment
  const humidityBonus = Math.max(0, (humidity - 50) / 2);
  
  return Math.min(95, Math.round(baseChance + humidityBonus));
};

const generateInsights = (current: any, forecast: any[], predictions: MLPrediction[]): string[] => {
  const insights: string[] = [];
  
  // Temperature trends
  const tempTrend = predictions[3].temperature - current.temperature;
  if (tempTrend > 3) {
    insights.push("Significant warming expected over the next 24 hours");
  } else if (tempTrend < -3) {
    insights.push("Notable cooling trend predicted for tomorrow");
  }
  
  // Precipitation patterns
  const avgPrecip = predictions.reduce((sum, p) => sum + p.precipitation, 0) / predictions.length;
  if (avgPrecip > 60) {
    insights.push("High precipitation probability - consider indoor activities");
  } else if (avgPrecip < 20) {
    insights.push("Low rain chances - great weather for outdoor plans");
  }
  
  // Confidence analysis
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  if (avgConfidence > 0.85) {
    insights.push("High confidence in weather predictions due to stable atmospheric conditions");
  } else if (avgConfidence < 0.75) {
    insights.push("Weather patterns are less predictable - stay flexible with outdoor plans");
  }
  
  // Humidity insights
  if (current.humidity > 75) {
    insights.push("High humidity levels may make temperatures feel warmer than actual");
  } else if (current.humidity < 40) {
    insights.push("Low humidity creates comfortable conditions but may cause dryness");
  }
  
  // Wind patterns
  if (current.windSpeed > 20) {
    insights.push("Strong winds expected - secure loose outdoor items");
  }
  
  return insights.slice(0, 4); // Limit to 4 insights
};

const calculateAccuracy = (predictions: MLPrediction[]): number => {
  // Simulate accuracy based on confidence levels and prediction complexity
  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const complexityFactor = 0.95; // Base accuracy for our ML model
  
  return Math.round((avgConfidence * complexityFactor) * 100);
};
