import { MapPin, Shield, User } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useGeolocation } from "@/hooks/useGeolocation"

interface LocationPermissionProps {
  onLocationGranted: (location: { latitude: number; longitude: number; city: string; country: string }) => void
}

export const LocationPermission = ({ onLocationGranted }: LocationPermissionProps) => {
  const { isAuthenticated, signInAnonymously, saveUserLocation } = useAuth()
  const { requestLocation, loading } = useGeolocation()

  const handleRequestLocation = async () => {
    const location = await requestLocation()
    if (location) {
      if (isAuthenticated) {
        await saveUserLocation(location)
      }
      onLocationGranted(location)
    }
  }

  const handleSignInAndRequestLocation = async () => {
    await signInAnonymously()
    const location = await requestLocation()
    if (location) {
      // The auth hook will automatically save the location after sign in
      onLocationGranted(location)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-6 animate-fade-in-up">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold gradient-text">
              Get Weather for Your Location
            </h2>
            <p className="text-muted-foreground mt-2">
              Allow location access to get personalized weather forecasts and save your preferences.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {!isAuthenticated ? (
            <Button 
              onClick={handleSignInAndRequestLocation}
              className="w-full"
              disabled={loading}
            >
              <User className="w-4 h-4 mr-2" />
              {loading ? "Getting Location..." : "Sign In & Enable Location"}
            </Button>
          ) : (
            <Button 
              onClick={handleRequestLocation}
              className="w-full"
              disabled={loading}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {loading ? "Getting Location..." : "Enable Location Access"}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => onLocationGranted({
              latitude: 40.7128,
              longitude: -74.0060,
              city: "New York",
              country: "US"
            })}
            className="w-full"
          >
            <Shield className="w-4 h-4 mr-2" />
            Continue with Default Location
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-2">
          <p>
            🔒 Your location data is securely stored and only used for weather forecasts.
          </p>
          <p>
            ✨ Sign in to save your location preferences across devices.
          </p>
        </div>
      </Card>
    </div>
  )
}