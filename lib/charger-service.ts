"use client"

export interface Charger {
  id: string
  name: string
  network: string
  latitude: number
  longitude: number
  available: number
  total: number
  power: string
  price: string
  status: "available" | "busy" | "offline"
  accountConnected: boolean
  address: string
  amenities: string[]
}

interface OpenChargeMapLocation {
  ID: number
  Title: string
  AddressInfo: {
    Title: string
    AddressLine1: string
    Town: string
    Postcode: string
    Country: {
      Title: string
    }
    Latitude: number
    Longitude: number
  }
  OperatorInfo?: {
    Title: string
  }
  Connections: Array<{
    PowerKW?: number
    Quantity?: number
    ConnectionType?: {
      Title: string
    }
  }>
  StatusType?: {
    Title: string
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function convertOpenChargeMapToCharger(location: OpenChargeMapLocation): Charger {
  const connection = location.Connections?.[0] || {}
  const powerKW = connection.PowerKW || 22
  const quantity = connection.Quantity || 1

  // Map operator names to our network names
  const operatorName = location.OperatorInfo?.Title || "Tuntematon"
  let network = operatorName
  const operatorLower = operatorName?.toLowerCase() || ""
  if (operatorLower.includes("virta")) network = "Virta"
  else if (operatorLower.includes("helen")) network = "Helen"
  else if (operatorLower.includes("k-lataus") || operatorLower.includes("kesko")) network = "K-Lataus"
  else if (operatorLower.includes("abc")) network = "ABC Lataus"
  else if (operatorLower.includes("fortum")) network = "Fortum"
  else if (operatorLower.includes("recharge")) network = "Recharge"

  // Determine status and availability
  const statusTitle = location.StatusType?.Title?.toLowerCase() || ""
  let status: "available" | "busy" | "offline" = "available"
  let available = Math.floor(Math.random() * quantity) + 1 // Random availability for demo

  if (statusTitle.includes("offline") || statusTitle.includes("out of service")) {
    status = "offline"
    available = 0
  } else if (statusTitle.includes("busy") || statusTitle.includes("in use")) {
    status = "busy"
    available = Math.floor(quantity / 2)
  }

  // Generate realistic pricing based on power
  let price = "0.45 €/kWh"
  if (powerKW >= 150) price = "0.55 €/kWh"
  else if (powerKW >= 50) price = "0.48 €/kWh"
  else price = "0.38 €/kWh"

  // Common amenities based on location type
  const amenities: string[] = []
  const title = (location.Title || "").toLowerCase()
  if (title.includes("market") || title.includes("kauppa")) amenities.push("Kauppa")
  if (title.includes("abc") || title.includes("ravintola")) amenities.push("Ravintola")
  if (title.includes("hotel") || title.includes("hotelli")) amenities.push("Hotelli")
  amenities.push("WC") // Most locations have WC

  return {
    id: `ocm-${location.ID}`,
    name: location.Title || "Nimetön latauspiste",
    network,
    latitude: location.AddressInfo.Latitude,
    longitude: location.AddressInfo.Longitude,
    available,
    total: quantity,
    power: `${powerKW} kW`,
    price,
    status,
    accountConnected: ["Virta", "Helen", "K-Lataus", "ABC Lataus"].includes(network),
    address: `${location.AddressInfo.AddressLine1 || ""}, ${location.AddressInfo.Town || ""}`.trim(),
    amenities,
  }
}

export interface ChargerWithDistance extends Charger {
  distance: number
}

export async function getNearbyChargers(
  latitude: number,
  longitude: number,
  radiusKm = 10,
): Promise<ChargerWithDistance[]> {
  try {
    const response = await fetch(`/api/chargers?latitude=${latitude}&longitude=${longitude}&radius=${radiusKm}`)

    if (!response.ok) {
      throw new Error("Failed to fetch charging data")
    }

    const locations: OpenChargeMapLocation[] = await response.json()

    const chargers = locations
      .map(convertOpenChargeMapToCharger)
      .map((charger) => ({
        ...charger,
        distance: calculateDistance(latitude, longitude, charger.latitude, charger.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)

    return chargers
  } catch (error) {
    console.error("Error fetching charging data:", error)
    return []
  }
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  }
  return `${distance.toFixed(1)} km`
}
