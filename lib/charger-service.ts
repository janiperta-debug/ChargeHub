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

// Simulated charger data for Helsinki area
const MOCK_CHARGERS: Charger[] = [
  {
    id: "k-kamppi-1",
    name: "K-Market Kamppi",
    network: "K-Lataus",
    latitude: 60.1695,
    longitude: 24.9354,
    available: 2,
    total: 4,
    power: "50 kW",
    price: "0.45 €/kWh",
    status: "available",
    accountConnected: true,
    address: "Urho Kekkosen katu 1, Helsinki",
    amenities: ["Kauppa", "Kahvila", "WC"],
  },
  {
    id: "abc-herttoniemi-1",
    name: "ABC Herttoniemi",
    network: "ABC Lataus",
    latitude: 60.1867,
    longitude: 25.0312,
    available: 1,
    total: 2,
    power: "150 kW",
    price: "0.52 €/kWh",
    status: "available",
    accountConnected: true,
    address: "Itäväylä 1, Helsinki",
    amenities: ["Ravintola", "Kauppa", "WC", "Suihku"],
  },
  {
    id: "helen-pasila-1",
    name: "Helen Charging Hub Pasila",
    network: "Helen",
    latitude: 60.1988,
    longitude: 24.9339,
    available: 0,
    total: 6,
    power: "22 kW",
    price: "0.38 €/kWh",
    status: "busy",
    accountConnected: false,
    address: "Pasilanraitio 5, Helsinki",
    amenities: ["Kauppa", "WC"],
  },
  {
    id: "virta-kalasatama-1",
    name: "Virta Kalasatama",
    network: "Virta",
    latitude: 60.1756,
    longitude: 24.9756,
    available: 3,
    total: 4,
    power: "75 kW",
    price: "0.48 €/kWh",
    status: "available",
    accountConnected: true,
    address: "Sörnäistenkatu 1, Helsinki",
    amenities: ["Ravintola", "WC"],
  },
  {
    id: "fortum-vantaa-1",
    name: "Fortum Charge Vantaa",
    network: "Fortum",
    latitude: 60.2934,
    longitude: 25.0378,
    available: 2,
    total: 3,
    power: "100 kW",
    price: "0.55 €/kWh",
    status: "available",
    accountConnected: false,
    address: "Lentäjänkuja 3, Vantaa",
    amenities: ["Kauppa", "Kahvila"],
  },
]

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

export interface ChargerWithDistance extends Charger {
  distance: number
}

export async function getNearbyChargers(
  latitude: number,
  longitude: number,
  radiusKm = 10,
): Promise<ChargerWithDistance[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const chargersWithDistance = MOCK_CHARGERS.map((charger) => ({
    ...charger,
    distance: calculateDistance(latitude, longitude, charger.latitude, charger.longitude),
  }))
    .filter((charger) => charger.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)

  return chargersWithDistance
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  }
  return `${distance.toFixed(1)} km`
}
