"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { AuthService, type User, type AuthState } from "@/lib/auth-service"

const AuthContext = createContext<{
  auth: AuthState
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Pick<User, "name" | "email">>) => Promise<{ success: boolean; error?: string }>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const authService = AuthService.getInstance()

  useEffect(() => {
    // Check for existing session
    const user = authService.getCurrentUser()
    setAuth({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  }, [])

  const signIn = async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, isLoading: true }))

    const { user, error } = await authService.signIn(email, password)

    if (user) {
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: error || "Kirjautuminen epäonnistui" }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setAuth((prev) => ({ ...prev, isLoading: true }))

    const { user, error } = await authService.signUp(email, password, name)

    if (user) {
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: error || "Rekisteröityminen epäonnistui" }
    }
  }

  const signOut = async () => {
    await authService.signOut()
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateProfile = async (updates: Partial<Pick<User, "name" | "email">>) => {
    const { user, error } = await authService.updateProfile(updates)

    if (user) {
      setAuth((prev) => ({ ...prev, user }))
      return { success: true }
    } else {
      return { success: false, error: error || "Profiilin päivitys epäonnistui" }
    }
  }

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut, updateProfile }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
