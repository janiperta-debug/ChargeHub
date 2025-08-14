"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import type { NetworkAccount } from "@/lib/account-service"

interface AccountLinkingModalProps {
  isOpen: boolean
  onClose: () => void
  network: NetworkAccount | null
  onAccountLinked: (networkName: string, email: string) => void
}

export function AccountLinkingModal({ isOpen, onClose, network, onAccountLinked }: AccountLinkingModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!network) return null

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setError(null)

    try {
      // Simulate API call to connect account
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random success/failure for demo
      if (Math.random() > 0.3) {
        onAccountLinked(network.name, email)
        onClose()
        setEmail("")
        setPassword("")
      } else {
        throw new Error("Virheelliset kirjautumistiedot")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yhteyden muodostaminen epäonnistui")
    } finally {
      setIsConnecting(false)
    }
  }

  const getNetworkInstructions = (networkName: string) => {
    switch (networkName) {
      case "Virta":
        return "Käytä Virta-sovelluksen kirjautumistietojasi. Löydät ne Virta-sovelluksesta tai verkkosivulta."
      case "Helen":
        return "Käytä Oma Helen -sovelluksen tai Helen.fi -sivuston kirjautumistietojasi."
      case "K-Lataus":
        return "Käytä K-Plussa-tilisi kirjautumistietoja. Sama tili toimii K-Lataus-palvelussa."
      case "ABC Lataus":
        return "Käytä ABC-mobiilisovelluksen kirjautumistietojasi."
      case "Fortum":
        return "Käytä Fortum Charge & Drive -sovelluksen kirjautumistietojasi."
      case "Recharge":
        return "Käytä Recharge-sovelluksen kirjautumistietojasi."
      case "Plugit":
        return "Käytä Plugit-sovelluksen kirjautumistietojasi."
      case "IONITY":
        return "Käytä IONITY-sovelluksen tai verkkosivuston kirjautumistietojasi."
      case "Tesla Supercharger":
        return "Käytä Tesla-tilisi kirjautumistietoja. Tarvitset Tesla-tilin myös muilla autoilla."
      case "Mer":
        return "Käytä Mer-sovelluksen kirjautumistietojasi."
      case "Vattenfall InCharge":
        return "Käytä Vattenfall InCharge -sovelluksen kirjautumistietojasi."
      case "Kople":
        return "Käytä Kople-sovelluksen kirjautumistietojasi."
      case "Uno-X":
        return "Käytä Uno-X-sovelluksen kirjautumistietojasi."
      case "Lidl":
        return "Käytä Lidl Plus -sovelluksen kirjautumistietojasi."
      case "Allego":
        return "Käytä Allego-sovelluksen kirjautumistietojasi."
      default:
        return "Käytä kyseisen palvelun kirjautumistietojasi."
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{network.logo}</span>
            Yhdistä {network.name}-tili
          </DialogTitle>
          <DialogDescription>{getNetworkInstructions(network.name)}</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tilin tiedot</CardTitle>
            <CardDescription className="text-sm">
              Tietosi tallennetaan turvallisesti ja käytetään vain latauspalveluun kirjautumiseen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Sähköposti</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anna@example.com"
                  required
                  disabled={isConnecting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Salasana</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isConnecting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isConnecting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isConnecting}
                  className="flex-1 bg-transparent"
                >
                  Peruuta
                </Button>
                <Button
                  type="submit"
                  disabled={isConnecting || !email || !password}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Yhdistetään...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Yhdistä tili
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Tietoturva:</strong> Kirjautumistietosi salataan ja tallennetaan turvallisesti. Voit katkaista
            yhteyden milloin tahansa asetuksista.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
