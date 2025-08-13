"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface ConnectionStatusProps {
  isConnected: boolean
  lastUpdate?: string | null
}

export function ConnectionStatus({ isConnected, lastUpdate }: ConnectionStatusProps) {
  const formatLastUpdate = (timestamp: string | null) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSeconds < 10) return "Juuri päivitetty"
    if (diffSeconds < 60) return `${diffSeconds}s sitten`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}min sitten`
    return date.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={`text-xs ${
          isConnected ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            Yhdistetty
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 mr-1" />
            Ei yhteyttä
          </>
        )}
      </Badge>
      {lastUpdate && <span className="text-xs text-slate-500">{formatLastUpdate(lastUpdate)}</span>}
    </div>
  )
}
