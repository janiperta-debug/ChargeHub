"use client"

export interface ChargingSession {
  id: string
  chargerId: string
  chargerName: string
  network: string
  startTime: string
  endTime?: string
  status: "starting" | "active" | "stopping" | "completed" | "error"
  energyDelivered: number // kWh
  currentPower: number // kW
  estimatedCost: number // euros
  maxEnergy?: number // kWh target
  targetTime?: string // when to stop
  errorMessage?: string
}

const SESSIONS_STORAGE_KEY = "chargehub_sessions"
const ACTIVE_SESSION_KEY = "chargehub_active_session"

export function getStoredSessions(): ChargingSession[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load stored sessions:", error)
    return []
  }
}

export function getActiveSession(): ChargingSession | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(ACTIVE_SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load active session:", error)
    return null
  }
}

export function saveSession(session: ChargingSession): void {
  if (typeof window === "undefined") return

  try {
    // Save to sessions history
    const sessions = getStoredSessions()
    const existingIndex = sessions.findIndex((s) => s.id === session.id)

    if (existingIndex >= 0) {
      sessions[existingIndex] = session
    } else {
      sessions.unshift(session) // Add to beginning
    }

    // Keep only last 50 sessions
    const trimmedSessions = sessions.slice(0, 50)
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(trimmedSessions))

    // Save active session
    if (session.status === "active" || session.status === "starting") {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
  } catch (error) {
    console.error("Failed to save session:", error)
  }
}

export async function startChargingSession(
  chargerId: string,
  chargerName: string,
  network: string,
  maxEnergy?: number,
  targetTime?: string,
): Promise<ChargingSession> {
  const session: ChargingSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chargerId,
    chargerName,
    network,
    startTime: new Date().toISOString(),
    status: "starting",
    energyDelivered: 0,
    currentPower: 0,
    estimatedCost: 0,
    maxEnergy,
    targetTime,
  }

  // Simulate API call to start charging
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate random success/failure
  if (Math.random() > 0.1) {
    session.status = "active"
    session.currentPower = Math.floor(Math.random() * 50) + 20 // 20-70 kW
  } else {
    session.status = "error"
    session.errorMessage = "Latauksen aloitus epäonnistui. Tarkista yhteys latauspisteeseesn."
  }

  saveSession(session)
  return session
}

export async function stopChargingSession(sessionId: string): Promise<ChargingSession> {
  const session = getActiveSession()
  if (!session || session.id !== sessionId) {
    throw new Error("Session not found")
  }

  const updatedSession = {
    ...session,
    status: "stopping" as const,
  }

  saveSession(updatedSession)

  // Simulate API call to stop charging
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const finalSession = {
    ...updatedSession,
    status: "completed" as const,
    endTime: new Date().toISOString(),
  }

  saveSession(finalSession)
  return finalSession
}

export function updateSessionProgress(session: ChargingSession): ChargingSession {
  if (session.status !== "active") return session

  const now = new Date()
  const startTime = new Date(session.startTime)
  const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60)

  // Simulate energy delivery based on current power and time
  const energyDelivered = Math.min((session.currentPower * elapsedMinutes) / 60, session.maxEnergy || 100)

  // Simulate cost calculation (average 0.45 €/kWh)
  const estimatedCost = energyDelivered * 0.45

  const updatedSession = {
    ...session,
    energyDelivered: Math.round(energyDelivered * 100) / 100,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
  }

  // Check if target reached
  if (session.maxEnergy && energyDelivered >= session.maxEnergy) {
    updatedSession.status = "completed"
    updatedSession.endTime = new Date().toISOString()
  }

  return updatedSession
}

export function formatSessionDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime)
  const end = endTime ? new Date(endTime) : new Date()
  const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))

  if (diffMinutes < 60) {
    return `${diffMinutes} min`
  }

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  return `${hours}h ${minutes}min`
}
