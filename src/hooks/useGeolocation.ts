import { useState, useEffect } from 'react'
import { useToast } from './use-toast'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
  country: string
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true
  })
  const { toast } = useToast()

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  const reverseGeocode = async (lat: number, lon: number): Promise<LocationData> => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to get location name')
    }
    
    const data = await response.json()
    if (!data.length) {
      throw new Error('No location found')
    }
    
    return {
      latitude: lat,
      longitude: lon,
      city: data[0].name,
      country: data[0].country
    }
  }

  const requestLocation = async (): Promise<LocationData | null> => {
    try {
      setLocation(prev => ({ ...prev, loading: true, error: null }))
      
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      
      const locationData = await reverseGeocode(latitude, longitude)
      
      setLocation({
        latitude,
        longitude,
        error: null,
        loading: false
      })

      toast({
        title: "Location detected",
        description: `Weather data for ${locationData.city}, ${locationData.country}`,
      })

      return locationData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location'
      setLocation({
        latitude: null,
        longitude: null,
        error: errorMessage,
        loading: false
      })

      toast({
        title: "Location access denied",
        description: "Using default location. Enable location access for personalized weather.",
        variant: "destructive"
      })

      return null
    }
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return {
    ...location,
    requestLocation,
    hasLocation: location.latitude !== null && location.longitude !== null
  }
}