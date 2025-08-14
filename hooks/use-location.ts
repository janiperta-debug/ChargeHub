"use client"

import { useState, useEffect } from "react"

interface LocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        loading: false,
      }))
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      })
    }

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Unknown error occurred"
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Salli sijainti asetuksista käyttääksesi lähimmät latauspisteet"
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Sijaintitietoja ei ole saatavilla"
          break
        case error.TIMEOUT:
          errorMessage = "Sijainnin haku aikakatkaistiin"
          break
      }

      setLocation({
        latitude: 60.1699,
        longitude: 24.9384,
        error: errorMessage,
        loading: false,
      })
    }

    const fallbackTimer = setTimeout(() => {
      setLocation({
        latitude: 60.1699,
        longitude: 24.9384,
        error: "Käytetään Helsinki-alueen sijaintia",
        loading: false,
      })
    }, 5000) // Reduced from 8000ms to 5000ms

    // Try to get location with high accuracy first
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 4000, // Reduced timeout
      maximumAge: 300000, // 5 minutes
    })

    return () => clearTimeout(fallbackTimer)
  }, []) // Removed location.loading dependency to fix the bug

  return location
}
