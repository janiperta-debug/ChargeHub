"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("signin")

  // Sign in form
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  // Sign up form
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { signIn, signUp } = useAuth()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signIn(signInEmail, signInPassword)

    if (!result.success) {
      setError(result.error || "Kirjautuminen epäonnistui")
    }

    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (signUpPassword !== confirmPassword) {
      setError("Salasanat eivät täsmää")
      setIsLoading(false)
      return
    }

    if (signUpPassword.length < 6) {
      setError("Salasanan tulee olla vähintään 6 merkkiä")
      setIsLoading(false)
      return
    }

    const result = await signUp(signUpEmail, signUpPassword, signUpName)

    if (!result.success) {
      setError(result.error || "Rekisteröityminen epäonnistui")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen dynamic-background flex items-center justify-center p-4">
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      <div className="content-overlay w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
            <Zap className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="font-bold text-4xl text-white drop-shadow-lg mb-2">ChargeHub</h1>
          <p className="text-white/90 drop-shadow-sm">Yhdistä kaikki EV-latausverkot</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 glow-electric overflow-hidden">
          <div className="absolute inset-0 electric-gradient opacity-5"></div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="relative">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Kirjaudu</TabsTrigger>
              <TabsTrigger value="signup">Rekisteröidy</TabsTrigger>
            </TabsList>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <TabsContent value="signin">
              <CardHeader>
                <CardTitle>Tervetuloa takaisin</CardTitle>
                <CardDescription>Kirjaudu sisään päästäksesi käsiksi latausverkkoihisi</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Sähköposti</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Salasana</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full electric-gradient hover:electric-gradient-light text-white border-0 glow-electric"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Kirjaudutaan...
                      </>
                    ) : (
                      "Kirjaudu sisään"
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Luo tili</CardTitle>
                <CardDescription>
                  Rekisteröidy hallitaksesi kaikkia EV-latausverkkojasi yhdessä paikassa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nimi</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Sähköposti</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Salasana</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Vahvista salasana</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full electric-gradient hover:electric-gradient-light text-white border-0 glow-electric"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rekisteröidään...
                      </>
                    ) : (
                      "Luo tili"
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Rekisteröitymällä hyväksyt <button className="underline hover:text-white">käyttöehdot</button> ja{" "}
            <button className="underline hover:text-white">tietosuojakäytännön</button>
          </p>
        </div>
      </div>
    </div>
  )
}
