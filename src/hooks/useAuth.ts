import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'

interface UserLocation {
  latitude: number
  longitude: number
  city: string
  country: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserLocation(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserLocation(session.user.id)
        } else {
          setUserLocation(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserLocation = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setUserLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country
        })
      }
    } catch (error) {
      console.error('Error loading user location:', error)
    }
  }

  const saveUserLocation = async (location: UserLocation) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          country: location.country,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setUserLocation(location)
      toast({
        title: "Location saved",
        description: `Your location has been saved as ${location.city}, ${location.country}`,
      })
    } catch (error) {
      console.error('Error saving user location:', error)
      toast({
        title: "Error",
        description: "Failed to save your location",
        variant: "destructive"
      })
    }
  }

  const signInAnonymously = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously()
      if (error) throw error
      
      toast({
        title: "Signed in",
        description: "You're now signed in anonymously",
      })
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Error",
        description: "Failed to sign in",
        variant: "destructive"
      })
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUserLocation(null)
      toast({
        title: "Signed out",
        description: "You have been signed out",
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      })
    }
  }

  return {
    user,
    session,
    loading,
    userLocation,
    saveUserLocation,
    signInAnonymously,
    signOut,
    isAuthenticated: !!user
  }
}