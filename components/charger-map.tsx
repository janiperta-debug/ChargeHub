"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Navigation,
  Zap,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  ZoomIn,
  ZoomOut,
  Locate,
  AlertCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ChargerWithDistance } from "@/lib/charger-service"

interface ChargerMapProps {
  chargers: ChargerWithDistance[]
  userLocation: { latitude: number; longitude: number } | null
  onChargerSelect: (charger: ChargerWithDistance) => void
  isLoading: boolean
  locationError?: string | null
}

export function ChargerMap({ chargers, userLocation, onChargerSelect, isLoading, locationError }: ChargerMapProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedCharger, setSelectedCharger] = useState<ChargerWithDistance | null>(null)

  // Get unique networks for filtering
  const availableNetworks = Array.from(new Set(chargers.map((c) => c.network)))

  // Filter chargers based on search and network selection
  const filteredChargers = chargers.filter((charger) => {
    const matchesSearch =
      charger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charger.network.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesNetwork = selectedNetworks.length === 0 || selectedNetworks.includes(charger.network)
    return matchesSearch && matchesNetwork
  })

  const handleNetworkToggle = (network: string) => {
    setSelectedNetworks((prev) => (prev.includes(network) ? prev.filter((n) => n !== network) : [...prev, network]))
  }

  const getChargerColor = (charger: ChargerWithDistance) => {
    if (charger.status === "available") return "bg-green-500"
    if (charger.status === "busy") return "bg-orange-500"
    return "bg-red-500"
  }

  const getChargerPosition = (charger: ChargerWithDistance, index: number) => {
    // Create a more realistic distribution of chargers across Finland
    const positions = [
      { left: 25, top: 20 }, // Helsinki area
      { left: 35, top: 25 }, // Espoo area
      { left: 45, top: 30 }, // Vantaa area
      { left: 20, top: 45 }, // Turku area
      { left: 55, top: 35 }, // Tampere area
      { left: 65, top: 25 }, // Lahti area
      { left: 40, top: 55 }, // Pori area
      { left: 70, top: 45 }, // Jyväskylä area
      { left: 30, top: 70 }, // Rauma area
      { left: 75, top: 60 }, // Kuopio area
      { left: 15, top: 35 }, // Salo area
      { left: 50, top: 75 }, // Joensuu area
    ]

    const position = positions[index % positions.length]
    // Add some randomness to avoid exact overlaps
    const randomOffsetX = (Math.random() - 0.5) * 8
    const randomOffsetY = (Math.random() - 0.5) * 8

    return {
      left: `${Math.max(10, Math.min(85, position.left + randomOffsetX))}%`,
      top: `${Math.max(10, Math.min(80, position.top + randomOffsetY))}%`,
    }
  }

  return (
    <div className="space-y-4">
      {/* Location Error Alert */}
      {locationError && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Sijaintia ei voitu määrittää: {locationError}. Kartta näyttää lähialueen latauspisteet.
          </AlertDescription>
        </Alert>
      )}

      {/* Map Controls */}
      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Hae latauspisteitä..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Suodata verkot</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {availableNetworks.map((network) => (
                    <div key={network} className="flex items-center space-x-2">
                      <Checkbox
                        id={network}
                        checked={selectedNetworks.includes(network)}
                        onCheckedChange={() => handleNetworkToggle(network)}
                      />
                      <label htmlFor={network} className="text-sm font-medium">
                        {network}
                      </label>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setSelectedNetworks([])} className="w-full">
                    Tyhjennä suodattimet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 2))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={!userLocation}>
                <Locate className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-slate-600">{filteredChargers.length} latauspistettä</div>
          </div>
        </CardContent>
      </Card>

      {/* Map View */}
      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <CardContent className="p-0">
          <div
            className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 rounded-lg overflow-hidden border-2 border-slate-200"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
          >
            <div className="absolute inset-0">
              {/* Simulated Finland coastline and lakes */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-30">
                {/* Simulated roads and cities */}
                <div className="absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-slate-400"></div>
                <div className="absolute top-1/2 left-1/5 right-1/5 h-0.5 bg-slate-400"></div>
                <div className="absolute top-3/4 left-1/3 right-1/3 h-0.5 bg-slate-400"></div>
                <div className="absolute left-1/4 top-1/5 bottom-1/5 w-0.5 bg-slate-400"></div>
                <div className="absolute left-1/2 top-1/4 bottom-1/4 w-0.5 bg-slate-400"></div>
                <div className="absolute left-3/4 top-1/3 bottom-1/3 w-0.5 bg-slate-400"></div>
              </div>
              {/* City markers */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-600 rounded-full opacity-50"></div>
              <div className="absolute top-1/3 left-3/5 w-2 h-2 bg-slate-600 rounded-full opacity-50"></div>
              <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-slate-600 rounded-full opacity-50"></div>
            </div>

            {/* User location marker */}
            {userLocation && (
              <div
                className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-20"
                style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
              >
                <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-30">
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Ladataan karttaa...</span>
                </div>
              </div>
            )}

            {!isLoading &&
              filteredChargers.map((charger, index) => (
                <div
                  key={charger.id}
                  className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:z-20 transition-all duration-200 hover:scale-110"
                  style={getChargerPosition(charger, index)}
                  onClick={() => setSelectedCharger(charger)}
                  title={`${charger.name} - ${charger.network}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-3 border-white shadow-lg ${getChargerColor(charger)} flex items-center justify-center hover:shadow-xl transition-shadow`}
                  >
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  {charger.accountConnected && (
                    <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
                  )}
                  {/* Charger info on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {charger.name}
                  </div>
                </div>
              ))}

            {!isLoading && filteredChargers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Ei latauspisteitä hakuehdoilla</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Vapaana</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Varattu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Ei käytössä</span>
              </div>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Sinun sijaintisi</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Charger Details */}
      {selectedCharger && (
        <Card className="bg-white/70 backdrop-blur-sm border-violet-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-violet-600" />
              {selectedCharger.name}
            </CardTitle>
            <CardDescription>{selectedCharger.address}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                {selectedCharger.network}
              </Badge>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {selectedCharger.power}
              </span>
              <span>{selectedCharger.price}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Saatavuus</p>
                <p
                  className={`font-medium ${selectedCharger.status === "available" ? "text-green-600" : "text-orange-600"}`}
                >
                  {selectedCharger.available}/{selectedCharger.total} vapaana
                </p>
              </div>
              <div>
                <p className="text-slate-600">Etäisyys</p>
                <p className="font-medium text-slate-800">
                  {userLocation ? `${selectedCharger.distance.toFixed(1)} km` : "Sijainti ei saatavilla"}
                </p>
              </div>
            </div>

            {selectedCharger.amenities && selectedCharger.amenities.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 mb-2">Palvelut</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCharger.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => {
                  // Simulate opening navigation
                  window.open(
                    `https://maps.google.com/maps?daddr=${selectedCharger.latitude},${selectedCharger.longitude}`,
                    "_blank",
                  )
                }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigoi
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={!selectedCharger.accountConnected}
                onClick={() => onChargerSelect(selectedCharger)}
              >
                <Zap className="w-4 h-4 mr-2" />
                {selectedCharger.accountConnected ? "Lataa" : "Yhdistä tili"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
