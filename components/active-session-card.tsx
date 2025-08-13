"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, Battery, DollarSign, Square, Loader2 } from "lucide-react"
import { updateSessionProgress, formatSessionDuration, type ChargingSession } from "@/lib/charging-session-service"

interface ActiveSessionCardProps {
  session: ChargingSession
  onStopSession: (sessionId: string) => void
  onSessionUpdate: (session: ChargingSession) => void
}

export function ActiveSessionCard({ session, onStopSession, onSessionUpdate }: ActiveSessionCardProps) {
  const [currentSession, setCurrentSession] = useState(session)
  const [isStopping, setIsStopping] = useState(false)

  useEffect(() => {
    if (currentSession.status !== "active") return

    const interval = setInterval(() => {
      const updatedSession = updateSessionProgress(currentSession)
      setCurrentSession(updatedSession)
      onSessionUpdate(updatedSession)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [currentSession, onSessionUpdate])

  const handleStopSession = async () => {
    setIsStopping(true)
    try {
      await onStopSession(currentSession.id)
    } catch (error) {
      console.error("Failed to stop session:", error)
    } finally {
      setIsStopping(false)
    }
  }

  const progressPercentage = currentSession.maxEnergy
    ? Math.min((currentSession.energyDelivered / currentSession.maxEnergy) * 100, 100)
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "starting":
        return "bg-yellow-100 text-yellow-700"
      case "active":
        return "bg-green-100 text-green-700"
      case "stopping":
        return "bg-orange-100 text-orange-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "starting":
        return "Aloitetaan..."
      case "active":
        return "Lataa"
      case "stopping":
        return "Pysäytetään..."
      case "error":
        return "Virhe"
      default:
        return status
    }
  }

  return (
    <Card className="bg-gradient-to-r from-cyan-50 to-violet-50 border-cyan-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-600" />
            Aktiivinen lataus
          </CardTitle>
          <Badge className={getStatusColor(currentSession.status)}>{getStatusText(currentSession.status)}</Badge>
        </div>
        <CardDescription>
          {currentSession.chargerName} • {currentSession.network}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSession.status === "error" && currentSession.errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{currentSession.errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Battery className="w-4 h-4" />
              <span>Energia</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{currentSession.energyDelivered.toFixed(1)} kWh</p>
            {currentSession.maxEnergy && <p className="text-xs text-slate-600">/ {currentSession.maxEnergy} kWh</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Zap className="w-4 h-4" />
              <span>Teho</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{currentSession.currentPower} kW</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Kesto</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {formatSessionDuration(currentSession.startTime, currentSession.endTime)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <DollarSign className="w-4 h-4" />
              <span>Kustannus</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{currentSession.estimatedCost.toFixed(2)} €</p>
          </div>
        </div>

        {currentSession.maxEnergy && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Edistyminen</span>
              <span className="text-slate-800">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {currentSession.status === "active" && (
          <Button
            onClick={handleStopSession}
            disabled={isStopping}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
          >
            {isStopping ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Pysäytetään...
              </>
            ) : (
              <>
                <Square className="w-4 h-4 mr-2" />
                Pysäytä lataus
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
