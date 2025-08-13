"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MapPin, Zap, CreditCard, User, Navigation, Link, CheckCircle, Plus } from "lucide-react"

export default function ChargeHubApp() {
  const [activeTab, setActiveTab] = useState("home")

  const nearbyChargers = [
    {
      name: "K-Market Kamppi",
      network: "K-Lataus",
      distance: "0.2 km",
      available: 2,
      total: 4,
      power: "50 kW",
      price: "0.45 €/kWh",
      status: "available",
      accountConnected: true,
    },
    {
      name: "ABC Herttoniemi",
      network: "ABC Lataus",
      distance: "0.8 km",
      available: 1,
      total: 2,
      power: "150 kW",
      price: "0.52 €/kWh",
      status: "available",
      accountConnected: true,
    },
    {
      name: "Helen Charging Hub",
      network: "Helen",
      distance: "1.2 km",
      available: 0,
      total: 6,
      power: "22 kW",
      price: "0.38 €/kWh",
      status: "busy",
      accountConnected: false,
    },
  ]

  const networkAccounts = [
    { name: "Virta", logo: "⚡", status: "connected", stations: "2,400+", accountEmail: "user@example.com" },
    { name: "Helen", logo: "🔋", status: "not_connected", stations: "800+", accountEmail: null },
    { name: "K-Lataus", logo: "🏪", status: "connected", stations: "1,200+", accountEmail: "user@example.com" },
    { name: "ABC Lataus", logo: "⛽", status: "connected", stations: "600+", accountEmail: "user@example.com" },
    { name: "Fortum", logo: "🌿", status: "not_connected", stations: "38,000+", accountEmail: null },
    { name: "Recharge", logo: "🔌", status: "not_connected", stations: "15,000+", accountEmail: null },
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-violet-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-800">ChargeHub</h1>
                <p className="text-sm text-slate-600">Yhdistä kaikki tilisi</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-600">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="space-y-6 mt-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Lähin lataus</p>
                      <p className="font-semibold text-slate-800">0.2 km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-violet-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Link className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Yhdistetyt tilit</p>
                      <p className="font-semibold text-slate-800">
                        {connectedCount}/{networkAccounts.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nearby Chargers */}
            <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-600" />
                  Lähimmät latauspisteet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyChargers.map((charger, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-cyan-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-800">{charger.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-cyan-100 text-cyan-700">
                          {charger.network}
                        </Badge>
                        {charger.accountConnected ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                            Yhdistä tili
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {charger.distance}
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
                        className={`text-sm font-medium ${charger.status === "available" ? "text-green-600" : "text-orange-600"}`}
                      >
                        {charger.available}/{charger.total} vapaana
                      </div>
                      <Button
                        size="sm"
                        className="mt-1 bg-cyan-600 hover:bg-cyan-700"
                        disabled={!charger.accountConnected}
                      >
                        {charger.accountConnected ? "Lataa" : "Yhdistä ensin"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-violet-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Link className="w-5 h-5 text-violet-600" />
                  Tiliyhteydet
                </CardTitle>
                <CardDescription>Yhdistä olemassa olevat tilisi helpompaan lataukseen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {networkAccounts.map((network, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-violet-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{network.logo}</span>
                        <div>
                          <p className="font-medium text-slate-800">{network.name}</p>
                          <p className="text-xs text-slate-600">{network.stations}</p>
                          {network.status === "connected" && network.accountEmail && (
                            <p className="text-xs text-green-600">Yhdistetty: {network.accountEmail}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        {network.status === "connected" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
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
          </TabsContent>

          <TabsContent value="billing" className="space-y-6 mt-6">
            <Card className="bg-white/70 backdrop-blur-sm border-cyan-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-600" />
                  Lataushistoria
                </CardTitle>
                <CardDescription>Lataukset laskutetaan suoraan alkuperäisille tileillesi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-cyan-600 to-violet-600 text-white p-4 rounded-lg">
                  <p className="text-sm opacity-90">Tämän kuun lataukset</p>
                  <p className="text-2xl font-bold">8 latausta</p>
                  <p className="text-sm opacity-90">125 kWh • 3 eri verkossa</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-800">Viimeisimmät lataukset</h3>
                  {recentCharges.map((charge, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-cyan-100"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{charge.location}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Badge variant="outline" className="text-xs">
                            {charge.network}
                          </Badge>
                          <span>{charge.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800">{charge.energy}</p>
                        <p className="text-xs text-slate-600">Laskutettu: {charge.billedTo}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Huomio:</strong> Kaikki maksut käsitellään suoraan latausverkon omien tiliesi kautta.
                    ChargeHub ei käsittele maksuja - toimimme vain yhdistävänä sovelluksena.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-cyan-100">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("home")}
              className={activeTab === "home" ? "bg-cyan-600 hover:bg-cyan-700" : "text-slate-600"}
            >
              <Zap className="w-4 h-4 mr-1" />
              Koti
            </Button>
            <Button
              variant={activeTab === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("map")}
              className={activeTab === "map" ? "bg-cyan-600 hover:bg-cyan-700" : "text-slate-600"}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Kartta
            </Button>
            <Button
              variant={activeTab === "billing" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("billing")}
              className={activeTab === "billing" ? "bg-cyan-600 hover:bg-cyan-700" : "text-slate-600"}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Historia
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("profile")}
              className={activeTab === "profile" ? "bg-cyan-600 hover:bg-cyan-700" : "text-slate-600"}
            >
              <User className="w-4 h-4 mr-1" />
              Profiili
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
