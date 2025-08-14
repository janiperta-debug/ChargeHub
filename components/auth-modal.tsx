"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/lib/auth"

interface AuthModalProps {
  onSuccess: () => void
}

export function AuthModal({ onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (mode === "signup") {
        await authService.signUp(email, password, name)
      } else {
        await authService.signIn(email, password)
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Virhe kirjautumisessa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 z-50 dynamic-background">
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-circle" style={{ top: "10%", left: "15%", animationDelay: "0s" }} />
        <div className="floating-circle" style={{ top: "20%", right: "20%", animationDelay: "2s" }} />
        <div className="floating-circle" style={{ bottom: "30%", left: "10%", animationDelay: "4s" }} />
        <div className="floating-circle" style={{ bottom: "15%", right: "15%", animationDelay: "1s" }} />
        <div className="floating-circle" style={{ top: "60%", left: "70%", animationDelay: "3s" }} />
      </div>

      {/* Main Content - Mobile First Design */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-screen lg:min-h-0 py-8 lg:py-0">
          {/* Branding Section - Compact on mobile, full on desktop */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-6 w-full">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 lg:mb-8">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-electric-green to-electric-blue rounded-2xl flex items-center justify-center shadow-lg shadow-electric-green/25">
                <span className="text-white font-bold text-lg lg:text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white">ChargeHub</h1>
                <p className="text-electric-green font-medium text-sm lg:text-base">Yhdistä kaikki tilisi</p>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                Yksi sovellus
                <br />
                <span className="bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent">
                  kaikille latausverkoille
                </span>
              </h2>
              <p className="text-slate-300 text-base lg:text-lg leading-relaxed px-4 lg:px-0">
                Yhdistä Virta, K-Lataus, ABC ja muut latausverkot yhteen sovellukseen. Hallitse kaikkia latauksiasi
                yhdestä paikasta.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:gap-4 pt-4 lg:pt-6 px-4 lg:px-0">
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-electric-green/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-electric-green text-lg lg:text-xl">🔗</span>
                </div>
                <p className="text-xs lg:text-sm text-slate-300">Yhdistä tilit</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-electric-blue text-lg lg:text-xl">📍</span>
                </div>
                <p className="text-xs lg:text-sm text-slate-300">Löydä latauspisteet</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-electric-green/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <span className="text-electric-green text-lg lg:text-xl">⚡</span>
                </div>
                <p className="text-xs lg:text-sm text-slate-300">Aloita lataus</p>
              </div>
            </div>
          </div>

          {/* Auth Form - Optimized for mobile */}
          <div className="w-full max-w-sm lg:max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20 mx-4 lg:mx-0">
              <div className="text-center mb-6 lg:mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                  {mode === "login" ? "Tervetuloa takaisin" : "Aloita tänään"}
                </h3>
                <p className="text-slate-300 text-sm lg:text-base">
                  {mode === "login"
                    ? "Kirjaudu sisään hallitaksesi latausverkkojasi"
                    : "Luo tili yhdistääksesi latausverkot"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                {mode === "signup" && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Nimi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-11 lg:h-12 rounded-xl text-base"
                    />
                  </div>
                )}
                <div>
                  <Input
                    type="email"
                    placeholder="Sähköposti"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-11 lg:h-12 rounded-xl text-base"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Salasana"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-11 lg:h-12 rounded-xl text-base"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 lg:h-12 bg-gradient-to-r from-electric-green to-electric-blue hover:from-electric-green/90 hover:to-electric-blue/90 text-white font-semibold rounded-xl shadow-lg shadow-electric-green/25 transition-all duration-200 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Ladataan..." : mode === "login" ? "Kirjaudu sisään" : "Luo tili"}
                </Button>

                <div className="text-center pt-3 lg:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login")
                      setError("")
                    }}
                    className="text-electric-blue hover:text-electric-green transition-colors duration-200 font-medium text-sm lg:text-base"
                  >
                    {mode === "login" ? "Ei tiliä? Luo tili" : "On jo tili? Kirjaudu sisään"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
