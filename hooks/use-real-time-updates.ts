"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChargerWithDistance } from "@/lib/charger-service"
import type { ChargingSession } from "@/lib/charging-session-service"

interface RealtimeUpdate {
  type: "charger_status" | "session_update" | "network_status" | "notification"
  data: any
  timestamp: string
}

interface NotificationData {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

export function useRealtimeUpdates() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  // Simulate real-time connection
  useEffect(() => {
    setIsConnected(true)

    // Simulate connection status changes
    const connectionInterval = setInterval(() => {
      // Randomly simulate connection issues (5% chance)
      if (Math.random() < 0.05) {
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(connectionInterval)
  }, [])

  const addNotification = useCallback((notification: Omit<NotificationData, "id" | "timestamp" | "read">) => {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]) // Keep only last 20
    setLastUpdate(new Date().toISOString())
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Simulate charger status updates
  const simulateChargerUpdates = useCallback(
    (chargers: ChargerWithDistance[]): ChargerWithDistance[] => {
      return chargers.map((charger) => {
        // 10% chance of status change per update
        if (Math.random() < 0.1) {
          const oldAvailable = charger.available
          const newAvailable = Math.max(0, Math.min(charger.total, charger.available + (Math.random() > 0.5 ? 1 : -1)))

          if (newAvailable !== oldAvailable) {
            const newStatus = newAvailable > 0 ? "available" : "busy"

            // Add notification for significant changes
            if (oldAvailable === 0 && newAvailable > 0) {
              addNotification({
                title: "Latauspiste vapautui",
                message: `${charger.name} - ${newAvailable} latauspistettä vapaana`,
                type: "success",
              })
            }

            return {
              ...charger,
              available: newAvailable,
              status: newStatus as "available" | "busy" | "offline",
            }
          }
        }

        return charger
      })
    },
    [addNotification],
  )

  // Simulate session completion notifications
  const simulateSessionNotifications = useCallback(
    (session: ChargingSession) => {
      if (session.status === "completed") {
        addNotification({
          title: "Lataus valmis",
          message: `${session.chargerName} - ${session.energyDelivered.toFixed(1)} kWh ladattu`,
          type: "success",
        })
      } else if (session.status === "error") {
        addNotification({
          title: "Latausvirhe",
          message: `${session.chargerName} - ${session.errorMessage || "Tuntematon virhe"}`,
          type: "error",
        })
      }
    },
    [addNotification],
  )

  return {
    notifications,
    isConnected,
    lastUpdate,
    addNotification,
    markNotificationRead,
    clearAllNotifications,
    simulateChargerUpdates,
    simulateSessionNotifications,
  }
}
