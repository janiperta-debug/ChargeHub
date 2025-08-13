"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Zap, Clock, Battery } from "lucide-react"
import type { ChargerWithDistance } from "@/lib/charger-service"

interface ChargingSessionModalProps {
  isOpen: boolean
  onClose: () => void
  charger: ChargerWithDistance | null
  onSessionStart: (
    chargerId: string,
    chargerName: string,
    network: string,
    maxEnergy?: number,
    targetTime?: string,
  ) => void
}

export function ChargingSessionModal({ isOpen, onClose, charger, onSessionStart }: ChargingSessionModalProps) {
  const [maxEnergy, setMaxEnergy] = useState("")
  const [targetTime, setTargetTime] = useState("")
  const [isStarting, setIsStarting] = useState(false)

  if (!charger) return null

  const handleStartSession = async () => {
    setIsStarting(true)

    try {
      await onSessionStart(
        charger.id,
        charger.name,
        charger.network,
        maxEnergy ? Number.parseFloat(maxEnergy) : undefined,
        targetTime || undefined,
      )
      onClose()
      setMaxEnergy("")
      setTargetTime("")
    } catch (error) {
      console.error("Failed to start session:", error)
    } finally {
      setIsStarting(false)
    }
  }

  const estimatedCost = maxEnergy
    ? Number.parseFloat(maxEnergy) * Number.parseFloat(charger.price.replace(/[^\d.]/g, ""))
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-600" />
            Aloita lataus
          </DialogTitle>
          <DialogDescription>
            {charger.name} • {charger.network}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Latauspisteen tiedot</CardTitle>
            <CardDescription className="text-sm">
              Teho: {charger.power} • Hinta: {charger.price}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-green-600" />
                <span>
                  {charger.available}/{charger.total} vapaana
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Käytettävissä nyt</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="maxEnergy">Tavoite-energia (kWh) - valinnainen</Label>
                <Input
                  id="maxEnergy"
                  type="number"
                  value={maxEnergy}
                  onChange={(e) => setMaxEnergy(e.target.value)}
                  placeholder="esim. 50"
                  min="1"
                  max="100"
                  step="0.1"
                  disabled={isStarting}
                />
                <p className="text-xs text-slate-600">Lataus pysähtyy automaattisesti kun tavoite saavutetaan</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetTime">Lopetusaika - valinnainen</Label>
                <Input
                  id="targetTime"
                  type="time"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  disabled={isStarting}
                />
                <p className="text-xs text-slate-600">Lataus pysähtyy automaattisesti määritettyyn aikaan</p>
              </div>

              {maxEnergy && estimatedCost > 0 && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                  <p className="text-sm text-cyan-800">
                    <strong>Arvioitu kustannus:</strong> {estimatedCost.toFixed(2)} €
                  </p>
                  <p className="text-xs text-cyan-600 mt-1">Lopullinen hinta laskutetaan {charger.network}-tilillesi</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isStarting}
                className="flex-1 bg-transparent"
              >
                Peruuta
              </Button>
              <Button
                onClick={handleStartSession}
                disabled={isStarting}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aloitetaan...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Aloita lataus
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Huomio:</strong> Lataus aloitetaan {charger.network}-tilisi kautta. Voit seurata ja hallita latausta
            ChargeHub-sovelluksessa.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
