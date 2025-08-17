import { useState } from "react";
import { MapPin, Layers, Satellite, Map as MapIcon } from "lucide-react";

interface WeatherMapProps {
  location: string;
}

export const WeatherMap = ({ location }: WeatherMapProps) => {
  const [mapType, setMapType] = useState<'satellite' | 'temperature' | 'precipitation'>('satellite');

  const mapTypes = [
    { id: 'satellite', label: 'Satellite', icon: <Satellite className="w-4 h-4" /> },
    { id: 'temperature', label: 'Temperature', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'precipitation', label: 'Precipitation', icon: <Layers className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="weather-card-glow animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold gradient-text">Weather Map</h3>
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
      </div>

      {/* Map Type Selector */}
      <div className="flex space-x-2 mb-4">
        {mapTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setMapType(type.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              mapType === type.id
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Mock Map Display */}
      <div className="relative h-64 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {mapTypes.find(t => t.id === mapType)?.icon && (
                <div className="text-primary text-2xl">
                  {mapTypes.find(t => t.id === mapType)?.icon}
                </div>
              )}
            </div>
            <p className="text-lg font-medium text-foreground">Interactive {mapType} Map</p>
            <p className="text-sm text-muted-foreground mt-1">
              {mapType === 'satellite' && 'Real-time satellite imagery'}
              {mapType === 'temperature' && 'Temperature overlay visualization'}
              {mapType === 'precipitation' && 'Precipitation radar data'}
            </p>
          </div>
        </div>

        {/* Animated overlay elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-weather-sunny rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Map Controls */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <span>Interactive map controls</span>
        <div className="flex space-x-2">
          <button className="hover:text-primary transition-colors">Zoom In</button>
          <span>•</span>
          <button className="hover:text-primary transition-colors">Zoom Out</button>
          <span>•</span>
          <button className="hover:text-primary transition-colors">Reset</button>
        </div>
      </div>
    </div>
  );
};