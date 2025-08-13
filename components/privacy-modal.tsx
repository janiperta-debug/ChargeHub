import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Database } from "lucide-react"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-800">Tietosuoja ja käyttöehdot</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Tietosuoja ensin
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-700 space-y-2">
              <p>
                ChargeHub on suunniteltu yksityisyytesi suojaamiseksi. Emme tallenna salasanojasi tai henkilökohtaisia
                tietojasi.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-600" />
                Mitä tietoja keräämme
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-3">
              <div>
                <p className="font-medium">Sijaintitiedot:</p>
                <p>Käytämme sijaintiasi vain lähimpien latauspisteen löytämiseen. Tietoja ei tallenneta pysyvästi.</p>
              </div>
              <div>
                <p className="font-medium">Tiliyhteydet:</p>
                <p>
                  Tallennamme vain sen tiedon, mitkä latausverkot olet yhdistänyt. Kirjautumistietoja ei tallenneta.
                </p>
              </div>
              <div>
                <p className="font-medium">Käyttötilastot:</p>
                <p>Keräämme anonyymejä käyttötilastoja sovelluksen parantamiseksi.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-600" />
                Tietojen suojaus
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              <p>• Kaikki tiedonsiirto on salattu (HTTPS/TLS)</p>
              <p>• Emme jaa tietojasi kolmansille osapuolille</p>
              <p>• Käytämme vain turvallisia API-yhteyksiä latausverkkoihin</p>
              <p>• Voit poistaa tilisi ja kaikki tiedot milloin tahansa</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-5 h-5 text-slate-600" />
                Käyttöehdot
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-3">
              <div>
                <p className="font-medium">Sovelluksen käyttö:</p>
                <p>ChargeHub on ilmainen palvelu EV-kuljettajille. Käyttö omalla vastuulla.</p>
              </div>
              <div>
                <p className="font-medium">Maksut:</p>
                <p>Kaikki latauskulut laskutetaan suoraan latausverkoille. ChargeHub ei käsittele maksuja.</p>
              </div>
              <div>
                <p className="font-medium">Vastuunrajoitus:</p>
                <p>Emme vastaa latausverkkojen palveluiden saatavuudesta tai hinnoittelusta.</p>
              </div>
              <div>
                <p className="font-medium">Muutokset:</p>
                <p>Pidätämme oikeuden päivittää näitä ehtoja. Ilmoitamme merkittävistä muutoksista sovelluksessa.</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200">
            <p>Viimeksi päivitetty: 15.1.2024</p>
            <p className="mt-1">ChargeHub v1.0.0 • Tehty Suomessa 🇫🇮</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
