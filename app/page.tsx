"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  MapPin,
  Zap,
  CreditCard,
  UserIcon,
  Navigation,
  LinkIcon,
  CheckCircle,
  Plus,
  Loader2,
  AlertCircle,
  X,
  SettingsIcon,
  BellIcon,
  MapIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { getNearbyChargers, formatDistance, type ChargerWithDistance } from "@/lib/charger-service"
import { getStoredAccounts, connectAccount, disconnectAccount, type NetworkAccount } from "@/lib/account-service"
import {
  getActiveSession,
  startChargingSession,
  stopChargingSession,
  saveSession,
  type ChargingSession,
} from "@/lib/charging-session-service"
import { useRealtimeUpdates } from "@/hooks/use-real-time-updates"
import { AccountLinkingModal } from "@/components/account-linking-modal"
import { ChargingSessionModal } from "@/components/charging-session-modal"
import { ActiveSessionCard } from "@/components/active-session-card"
import { NotificationPanel } from "@/components/notification-panel"
import { ChargerMap } from "@/components/charger-map"
import { HelpModal } from "@/components/help-modal"
import { SupportModal } from "@/components/support-modal"
import { PrivacyModal } from "@/components/privacy-modal"
import { authService } from "@/lib/auth"
import { AuthModal } from "@/components/auth-modal"

export default function ChargeHubApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [nearbyChargers, setNearbyChargers] = useState<ChargerWithDistance[]>([])
  const [filteredChargers, setFilteredChargers] = useState<ChargerWithDistance[]>([])
  const [chargersLoading, setChargersLoading] = useState(false)
  const [chargersError, setChargersError] = useState<string | null>(null)
  const [networkAccounts, setNetworkAccounts] = useState<NetworkAccount[]>([])
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkAccount | null>(null)
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false)
  const [selectedCharger, setSelectedCharger] = useState<ChargerWithDistance | null>(null)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [activeSession, setActiveSession] = useState<ChargingSession | null>(null)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

  // Authentication state
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Filter states
  const [powerFilter, setPowerFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [networkFilter, setNetworkFilter] = useState<string>("all")

  // Profile settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [userName, setUserName] = useState("EV-kuljettaja")
  const [isEditingName, setIsEditingName] = useState(false)

  const location = useLocation()
  const {
    notifications,
    isConnected,
    lastUpdate,
    markNotificationRead,
    clearAllNotifications,
    simulateChargerUpdates,
    simulateSessionNotifications,
  } = useRealtimeUpdates()

  // Load accounts and active session on component mount
  useEffect(() => {
    setNetworkAccounts(getStoredAccounts())
    setActiveSession(getActiveSession())

    // Load saved settings
    const savedSettings = localStorage.getItem("chargehub-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setNotificationsEnabled(settings.notifications ?? true)
      setAutoUpdateEnabled(settings.autoUpdate ?? true)
      setLocationEnabled(settings.location ?? true)
      setUserName(settings.userName ?? "EV-kuljettaja")
    }
  }, [])

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    setAuthLoading(false)
    if (!user) {
      setShowAuthModal(true)
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    const settings = {
      notifications: notificationsEnabled,
      autoUpdate: autoUpdateEnabled,
      location: locationEnabled,
      userName: userName,
    }
    localStorage.setItem("chargehub-settings", JSON.stringify(settings))
  }, [notificationsEnabled, autoUpdateEnabled, locationEnabled, userName])

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name)
    }

    // Load saved settings
    const savedSettings = localStorage.getItem("chargehub-settings")
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setNotificationsEnabled(settings.notifications ?? true)
      setAutoUpdateEnabled(settings.autoUpdate ?? true)
      setLocationEnabled(settings.location ?? true)
      if (!currentUser) {
        setUserName(settings.userName ?? "EV-kuljettaja")
      }
    }
  }, [currentUser])

  useEffect(() => {
    if (location.latitude && location.longitude && !location.loading && locationEnabled) {
      setChargersLoading(true)
      setChargersError(null)

      getNearbyChargers(location.latitude, location.longitude)
        .then((chargers) => {
          // Update charger account connection status based on stored accounts
          const updatedChargers = chargers.map((charger) => ({
            ...charger,
            accountConnected: networkAccounts.some((acc) => acc.name === charger.network && acc.status === "connected"),
          }))
          setNearbyChargers(updatedChargers)
          setChargersLoading(false)
        })
        .catch((error) => {
          setChargersError("Failed to load nearby chargers")
          setChargersLoading(false)
        })
    }
  }, [location.latitude, location.longitude, location.loading, networkAccounts, locationEnabled])

  // Filter chargers based on selected filters
  useEffect(() => {
    let filtered = nearbyChargers

    if (powerFilter !== "all") {
      filtered = filtered.filter((charger) => {
        const powerStr = charger.power.toLowerCase()
        let power = 0

        if (powerStr.includes("kw")) {
          power = Number.parseInt(powerStr.replace(/[^\d]/g, ""))
        } else {
          power = Number.parseInt(charger.power.replace(/[^\d]/g, ""))
        }

        if (powerFilter === "fast") {
          return power >= 50 && power < 150
        }
        if (powerFilter === "rapid") {
          return power >= 150
        }
        if (powerFilter === "slow") {
          return power < 50
        }
        return true
      })
    }

    if (availabilityFilter !== "all") {
      filtered = filtered.filter((charger) => {
        if (availabilityFilter === "available") {
          return charger.available > 0
        }
        if (availabilityFilter === "busy") {
          return charger.available === 0
        }
        return true
      })
    }

    if (networkFilter !== "all") {
      filtered = filtered.filter((charger) => charger.network === networkFilter)
    }

    console.log("Filtering:", {
      original: nearbyChargers.length,
      filtered: filtered.length,
      powerFilter,
      availabilityFilter,
      networkFilter,
    })

    setFilteredChargers(filtered)
  }, [nearbyChargers, powerFilter, availabilityFilter, networkFilter])

  // Real-time charger updates (only if auto-update is enabled)
  useEffect(() => {
    if (nearbyChargers.length > 0 && isConnected && autoUpdateEnabled) {
      const interval = setInterval(() => {
        setNearbyChargers((prev) => simulateChargerUpdates(prev))
      }, 15000) // Update every 15 seconds

      return () => clearInterval(interval)
    }
  }, [nearbyChargers.length, isConnected, autoUpdateEnabled, simulateChargerUpdates])

  // Session completion notifications (only if notifications are enabled)
  useEffect(() => {
    if (
      activeSession &&
      (activeSession.status === "completed" || activeSession.status === "error") &&
      notificationsEnabled
    ) {
      simulateSessionNotifications(activeSession)
    }
  }, [activeSession, notificationsEnabled, simulateSessionNotifications])

  const recentCharges = [
    {
      date: "2024-01-15",
      location: "K-Market Kamppi",
      network: "K-Lataus",
      energy: "28 kWh",
      billedTo: "K-Lataus tili",
    },
    {
      date: "2024-01-12",
      location: "ABC Herttoniemi",
      network: "ABC Lataus",
      energy: "35 kWh",
      billedTo: "ABC Lataus tili",
    },
    { date: "2024-01-10", location: "Virta Pasila", network: "Virta", energy: "22 kWh", billedTo: "Virta tili" },
  ]

  const connectedCount = networkAccounts.filter((n) => n.status === "connected").length
  const uniqueNetworks = [...new Set(nearbyChargers.map((c) => c.network))]

  const handleConnectAccount = (network: NetworkAccount) => {
    setSelectedNetwork(network)
    setIsLinkingModalOpen(true)
  }

  const handleAccountLinked = (networkName: string, email: string) => {
    const updatedAccounts = connectAccount(networkName, email)
    setNetworkAccounts(updatedAccounts)
  }

  const handleDisconnectAccount = (networkName: string) => {
    const updatedAccounts = disconnectAccount(networkName)
    setNetworkAccounts(updatedAccounts)
  }

  const handleStartCharging = (charger: ChargerWithDistance) => {
    setSelectedCharger(charger)
    setIsSessionModalOpen(true)
  }

  const handleSessionStart = async (
    chargerId: string,
    chargerName: string,
    network: string,
    maxEnergy?: number,
    targetTime?: string,
  ) => {
    const session = await startChargingSession(chargerId, chargerName, network, maxEnergy, targetTime)
    setActiveSession(session)
  }

  const handleStopSession = async (sessionId: string) => {
    const session = await stopChargingSession(sessionId)
    setActiveSession(null)
  }

  const handleSessionUpdate = (session: ChargingSession) => {
    saveSession(session)
    setActiveSession(session)
  }

  const handleAuthSuccess = () => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    authService.signOut()
    setCurrentUser(null)
    setShowAuthModal(true)
  }

  const handleSaveName = () => {
    if (currentUser) {
      const updatedUser = authService.updateProfile({ name: userName })
      setCurrentUser(updatedUser)
    }
    setIsEditingName(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen dynamic-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-electric-green to-electric-blue rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ChargeHub</h1>
          <div className="flex items-center gap-2 text-white/80">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Ladataan...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <AuthModal isOpen={true} onSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen dynamic-background">
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      <div className="content-overlay">
        <header className="electric-gradient glow-electric sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center glow-green">
                  <Zap className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h1 className="font-bold text-2xl text-white drop-shadow-lg">ChargeHub</h1>
                  <p className="text-sm text-white/90 drop-shadow-sm">Tervetuloa, {currentUser?.name || userName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationPanel
                  notifications={notifications}
                  onMarkRead={markNotificationRead}
                  onClearAll={clearAllNotifications}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-white/90">
                    <WifiIcon className="w-4 h-4 text-emerald-300" />
                    <span className="text-sm">Yhdistetty</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-white/90">
                    <WifiOffIcon className="w-4 h-4 text-orange-300" />
                    <span className="text-sm">Ei yhteyttä</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-white/70">
                {connectedCount}/{networkAccounts.length} verkko{connectedCount !== 1 ? "a" : ""} yhdistetty
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="home" className="space-y-6 mt-6">
              {activeSession && (
                <ActiveSessionCard
                  session={activeSession}
                  onStopSession={handleStopSession}
                  onSessionUpdate={handleSessionUpdate}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-0 glow-electric overflow-hidden">
                  <div className="absolute inset-0 electric-gradient opacity-5"></div>
                  <CardContent className="p-4 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-slate-800">Lähellä</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{filteredChargers.length}</p>
                    <p className="text-sm text-slate-600">latauspistettä</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-0 glow-blue overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5"></div>
                  <CardContent className="p-4 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-800">Tilit</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{connectedCount}</p>
                    <p className="text-sm text-slate-600">yhdistetty</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-electric overflow-hidden">
                <div className="absolute inset-0 electric-gradient opacity-5"></div>
                <CardHeader className="pb-3 relative">
                  <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 electric-gradient rounded-lg flex items-center justify-center glow-green">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    Karttanäkymä
                    {isConnected && autoUpdateEnabled && (
                      <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 glow-green">
                        Live
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <div className="h-64">
                    <ChargerMap
                      chargers={filteredChargers}
                      userLocation={
                        location.latitude && location.longitude && locationEnabled
                          ? { latitude: location.latitude, longitude: location.longitude }
                          : null
                      }
                      onChargerSelect={handleStartCharging}
                      isLoading={chargersLoading}
                      locationError={locationEnabled ? location.error : "Sijainti pois käytöstä asetuksissa"}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-green overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-base text-slate-800">Tämän kuun tilastot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white glow-green">
                      <p className="text-xl font-bold">8</p>
                      <p className="text-xs opacity-90">Latausta</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white glow-blue">
                      <p className="text-xl font-bold">125</p>
                      <p className="text-xs opacity-90">kWh</p>
                    </div>
                    <div className="text-center p-3 electric-gradient rounded-xl text-white glow-electric">
                      <p className="text-xl font-bold">€45</p>
                      <p className="text-xs opacity-90">Säästetty</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stations" className="space-y-6 mt-6">
              {!locationEnabled ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <MapIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Sijainti pois käytöstä</p>
                    <p className="text-xs text-slate-500">Ota käyttöön profiiliasetuksista</p>
                  </div>
                </div>
              ) : location.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Haetaan sijaintia...</span>
                  </div>
                </div>
              ) : location.error ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-orange-600 mb-1">Sijaintia ei saatu</p>
                    <p className="text-xs text-slate-500">{location.error}</p>
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Käytetään Helsinki-alueen pisteitä</strong>
                        <br />
                        Salli sijainti selaimessa tarkempien tulosten saamiseksi
                      </p>
                    </div>
                  </div>
                </div>
              ) : chargersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Ladataan latauspisteitä...</span>
                  </div>
                </div>
              ) : chargersError ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{chargersError}</span>
                  </div>
                </div>
              ) : nearbyChargers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <span className="text-slate-600">Ei latauspisteitä lähistöllä</span>
                  </div>
                </div>
              ) : filteredChargers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <span className="text-slate-600">Ei latauspisteitä suodattimilla</span>
                  </div>
                </div>
              ) : (
                filteredChargers.map((charger) => (
                  <div
                    key={charger.id}
                    className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-slate-100 hover:glow-electric transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{charger.name}</h3>
                        <Badge className="text-xs bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0">
                          {charger.network}
                        </Badge>
                        {charger.accountConnected ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50">
                            Yhdistä tili
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {formatDistance(charger.distance)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {charger.power}
                        </span>
                        <span>{charger.price}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${charger.status === "available" ? "text-emerald-600" : "text-orange-600"}`}
                      >
                        {charger.available}/{charger.total} vapaana
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 electric-gradient hover:electric-gradient-light text-white border-0 glow-electric transition-all duration-300 hover:scale-105"
                        disabled={!charger.accountConnected || !!activeSession}
                        onClick={() => handleStartCharging(charger)}
                      >
                        {activeSession ? "Lataus käynnissä" : charger.accountConnected ? "Lataa" : "Yhdistä ensin"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6 mt-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-blue overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    Tiliyhteydet
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Yhdistä olemassa olevat tilisi helpompaan lataukseen
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-3">
                    {networkAccounts.map((network, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-slate-100 hover:glow-blue transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{network.logo}</span>
                          <div>
                            <p className="font-semibold text-slate-800">{network.name}</p>
                            <p className="text-xs text-slate-600">{network.stations}</p>
                            {network.status === "connected" && network.accountEmail && (
                              <p className="text-xs text-emerald-600 font-medium">Yhdistetty: {network.accountEmail}</p>
                            )}
                            {network.status === "error" && network.errorMessage && (
                              <p className="text-xs text-red-600">{network.errorMessage}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {network.status === "connected" ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDisconnectAccount(network.name)}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          ) : network.status === "connecting" ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          ) : (
                            <Button
                              size="sm"
                              className="text-xs electric-gradient hover:electric-gradient-light text-white border-0 glow-electric"
                              onClick={() => handleConnectAccount(network)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Yhdistä
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-green overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-base text-slate-800">Vinkkejä</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Yhdistä kaikki tilisi</strong> saadaksesi parhaan kokemuksen. ChargeHub valitsee
                      automaattisesti edullisimman vaihtoehdon.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm text-emerald-800">
                      <strong>Turvallista:</strong> Tallennamme vain sähköpostiosoitteesi tunnistamista varten.
                      Salasanoja ei tallenneta.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6 mt-6">
              {/* ... existing billing content ... */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-electric overflow-hidden">
                <div className="absolute inset-0 electric-gradient opacity-5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 electric-gradient rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    Lataushistoria
                  </CardTitle>
                  <CardDescription>Lataukset laskutetaan suoraan alkuperäisille tileillesi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="electric-gradient text-white p-6 rounded-xl glow-electric">
                    <p className="text-sm opacity-90">Tämän kuun lataukset</p>
                    <p className="text-3xl font-bold">8 latausta</p>
                    <p className="text-sm opacity-90">125 kWh • 3 eri verkossa</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-800">Viimeisimmät lataukset</h3>
                    {recentCharges.map((charge, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-slate-100 hover:glow-electric transition-all duration-300"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{charge.location}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Badge className="text-xs bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0">
                              {charge.network}
                            </Badge>
                            <span>{charge.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{charge.energy}</p>
                          <p className="text-xs text-slate-600">Laskutettu: {charge.billedTo}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Huomio:</strong> Kaikki maksut käsitellään suoraan latausverkon omien tiliesi kautta.
                      ChargeHub ei käsittele maksuja - toimimme vain yhdistävänä sovelluksena.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 mt-6">
              {/* ... existing profile content ... */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-blue overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-xl flex items-center gap-2 text-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    Käyttäjäprofiili
                  </CardTitle>
                  <CardDescription>Hallitse tiliäsi ja sovelluksen asetuksia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="flex items-center gap-4 p-6 electric-gradient rounded-xl glow-electric">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      {isEditingName ? (
                        <div className="space-y-2">
                          <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                            onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={handleSaveName}>
                              Tallenna
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsEditingName(false)}
                              className="text-white/90"
                            >
                              Peruuta
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-lg">{currentUser?.name || userName}</h3>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsEditingName(true)}
                              className="text-white/70 hover:text-white hover:bg-white/20 p-1"
                            >
                              <SettingsIcon className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-white/90">{currentUser?.email || "ev-kuljettaja@example.com"}</p>
                          <Badge className="mt-1 bg-white/20 text-white border-white/30">
                            {connectedCount} verkko{connectedCount !== 1 ? "a" : ""} yhdistetty
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-green overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-base text-slate-800">Tilastot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white glow-green">
                      <p className="text-3xl font-bold">8</p>
                      <p className="text-sm opacity-90">Latausta tässä kuussa</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white glow-blue">
                      <p className="text-3xl font-bold">125</p>
                      <p className="text-sm opacity-90">kWh ladattu</p>
                    </div>
                  </div>
                  <div className="text-center p-4 electric-gradient rounded-xl text-white glow-electric">
                    <p className="text-xl font-bold">€45.20 säästetty</p>
                    <p className="text-sm opacity-90">Verrattuna yksittäisiin sovelluksiin</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 glow-electric overflow-hidden">
                <div className="absolute inset-0 electric-gradient opacity-5"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-base text-slate-800">Asetukset</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <BellIcon className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Ilmoitukset</p>
                        <p className="text-sm text-slate-600">Latauksen päättyminen ja virheet</p>
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <WifiIcon className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Automaattinen päivitys</p>
                        <p className="text-sm text-slate-600">Latauspistetiedot reaaliajassa</p>
                      </div>
                    </div>
                    <Switch checked={autoUpdateEnabled} onCheckedChange={setAutoUpdateEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-semibold text-slate-800">Sijainti</p>
                        <p className="text-sm text-slate-600">Lähimpien latauspisteen haku</p>
                      </div>
                    </div>
                    <Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                    >
                      Kirjaudu ulos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 glow-electric">
          <div className="max-w-md mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              <Button
                variant={activeTab === "home" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("home")}
                className={
                  activeTab === "home"
                    ? "electric-gradient hover:electric-gradient-light text-white glow-electric"
                    : "text-slate-600 hover:text-slate-800"
                }
              >
                <Zap className="w-4 h-4 mr-1" />
                Koti
              </Button>
              <Button
                variant={activeTab === "stations" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("stations")}
                className={
                  activeTab === "stations"
                    ? "electric-gradient hover:electric-gradient-light text-white glow-electric"
                    : "text-slate-600 hover:text-slate-800"
                }
              >
                <Navigation className="w-4 h-4 mr-1" />
                Pisteet
              </Button>
              <Button
                variant={activeTab === "accounts" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("accounts")}
                className={
                  activeTab === "accounts"
                    ? "electric-gradient hover:electric-gradient-light text-white glow-electric"
                    : "text-slate-600 hover:text-slate-800"
                }
              >
                <LinkIcon className="w-4 h-4 mr-1" />
                Tilit
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("profile")}
                className={
                  activeTab === "profile"
                    ? "electric-gradient hover:electric-gradient-light text-white glow-electric"
                    : "text-slate-600 hover:text-slate-800"
                }
              >
                <UserIcon className="w-4 h-4 mr-1" />
                Profiili
              </Button>
            </div>
          </div>
        </nav>

        <AccountLinkingModal
          isOpen={isLinkingModalOpen}
          onClose={() => setIsLinkingModalOpen(false)}
          network={selectedNetwork}
          onAccountLinked={handleAccountLinked}
        />

        <ChargingSessionModal
          isOpen={isSessionModalOpen}
          onClose={() => setIsSessionModalOpen(false)}
          charger={selectedCharger}
          onSessionStart={handleSessionStart}
        />

        <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
        <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
        <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      </div>
    </div>
  )
}
