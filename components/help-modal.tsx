"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "Miten yhdistän latausverkon tilin?",
      answer:
        "Siirry Koti-välilehdelle ja klikkaa 'Yhdistä' haluamasi verkon kohdalla. Syötä olemassa olevan tilisi kirjautumistiedot. ChargeHub ei tallenna salasanojasi - käytämme turvallista API-yhteyttä.",
    },
    {
      question: "Miksi en näe latauspisteitä kartalla?",
      answer:
        "Varmista että olet antanut sovellukselle luvan käyttää sijaintiasi. Jos käytät selainta, sijainti toimii parhaiten HTTPS-yhteydellä. Voit myös hakea latauspisteitä manuaalisesti kaupungin nimellä.",
    },
    {
      question: "Miten lataus laskutetaan?",
      answer:
        "ChargeHub ei käsittele maksuja. Kaikki lataukset laskutetaan suoraan alkuperäisen latausverkon tilillesi (esim. Virta, K-Lataus). Toimimme vain yhdistävänä sovelluksena.",
    },
    {
      question: "Voinko käyttää sovellusta ilman tiliyhteyksiä?",
      answer:
        "Voit selata latauspisteitä ja nähdä hinnat ilman tiliyhteyksiä, mutta latauksen aloittaminen vaatii vähintään yhden yhdistetyn tilin kyseisessä verkossa.",
    },
    {
      question: "Miksi lataus ei käynnisty?",
      answer:
        "Tarkista että: 1) Sinulla on yhdistetty tili kyseisessä verkossa, 2) Latauspisteen tila on 'saatavilla', 3) Sinulla ei ole jo aktiivista latausta käynnissä toisessa pisteessä.",
    },
    {
      question: "Onko sovellus ilmainen?",
      answer:
        "Kyllä, ChargeHub on täysin ilmainen käyttää. Maksat vain varsinaiset latauskulut suoraan latausverkoille heidän normaalien hinnoittelujensa mukaan.",
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-800">Ohje ja usein kysytyt kysymykset</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-cyan-50 border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-cyan-800">Pika-aloitus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-cyan-700">
              <p>1. Yhdistä olemassa olevat latausverkkojen tilisi</p>
              <p>2. Anna sovellukselle lupa käyttää sijaintiasi</p>
              <p>3. Selaa lähimpiä latauspisteitä</p>
              <p>4. Aloita lataus yhdellä napinpainalluksella</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-medium text-slate-800">Usein kysytyt kysymykset</h3>
            {faqs.map((faq, index) => (
              <Card key={index} className="border-slate-200">
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-slate-800">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </Button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
