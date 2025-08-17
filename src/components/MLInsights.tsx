import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { MLForecast } from "@/lib/ml-forecasting";

interface MLInsightsProps {
  forecast: MLForecast;
}

export const MLInsights = ({ forecast }: MLInsightsProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-500";
    if (confidence >= 0.6) return "text-yellow-500";
    return "text-red-500";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.6) return <TrendingUp className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <Card className="p-6 space-y-6 weather-card-glow">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold gradient-text">AI Weather Insights</h3>
          <p className="text-sm text-muted-foreground">Machine learning powered predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecast.predictions.map((prediction, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{prediction.timeframe}</span>
              <div className={`flex items-center space-x-1 ${getConfidenceColor(prediction.confidence)}`}>
                {getConfidenceIcon(prediction.confidence)}
                <span className="text-xs">
                  {Math.round(prediction.confidence * 100)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Temperature</span>
                <span className="text-sm font-medium">{prediction.temperature}°C</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Condition</span>
                <span className="text-sm font-medium capitalize">{prediction.condition}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Rain Chance</span>
                <span className="text-sm font-medium">{prediction.precipitation}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <h4 className="font-medium text-primary">AI Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          {forecast.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <span>Powered by AI/ML</span>
      </div>
    </Card>
  );
};