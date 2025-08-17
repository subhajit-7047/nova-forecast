import { useState } from "react";
import { Search, MapPin, Settings, Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onLocationChange: (location: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const Header = ({ onLocationChange, onRefresh, isLoading = false }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onLocationChange(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <header className="glass-effect p-6 mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">WeatherPro</h1>
            <p className="text-sm text-muted-foreground">Professional Weather Dashboard</p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </form>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30"
          >
            <Bell className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};