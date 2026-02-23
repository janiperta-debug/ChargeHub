"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

function VoltteriLogo({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="/images/voltteri-logo.png"
      alt="Voltteri logo"
      width={size}
      height={size}
      className="rounded-full"
    />
  )
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none">
      <path d="M10.5 2L4 10h6l-2.5 6L16 8h-6l0.5-6z" fill="currentColor" />
    </svg>
  )
}

function RevealOnScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          }
        })
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className || ""}`}>
      {children}
    </div>
  )
}

export default function VoltteriLanding({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-background/70 backdrop-blur-xl border-b border-border-volt lg:px-12">
        <div className="flex items-center gap-2 font-heading font-extrabold text-xl tracking-tight text-volt">
          <VoltteriLogo size={28} />
          Voltteri
        </div>
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <a
              href="#features"
              className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
            >
              Ominaisuudet
            </a>
          </li>
          <li>
            <a
              href="#app"
              className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
            >
              Sovellus
            </a>
          </li>
          <li>
            <button
              onClick={onOpenDemo}
              className="bg-volt text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              Lataa ilmaiseksi
            </button>
          </li>
        </ul>
        <button
          onClick={onOpenDemo}
          className="md:hidden bg-volt text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold"
        >
          Kokeile
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-16 overflow-hidden lg:px-12">
        {/* Glow effects */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(200,244,0,0.08)_0%,transparent_70%)] -top-24 -right-48 pointer-events-none animate-pulse" />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,194,255,0.06)_0%,transparent_70%)] bottom-0 -left-24 pointer-events-none animate-pulse"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative z-10">
          <p className="flex items-center gap-2.5 text-xs font-medium tracking-[0.18em] uppercase text-volt mb-6 animate-[fadeUp_0.8s_0.1s_forwards] opacity-0">
            <span className="inline-block w-8 h-px bg-volt" />
            {"S\u00e4hk\u00f6autoilijalle tehty"}
          </p>
          <h1 className="font-heading font-extrabold text-[clamp(3rem,8vw,7rem)] leading-[1.0] tracking-tighter max-w-3xl animate-[fadeUp_0.8s_0.25s_forwards] opacity-0">
            Loppu
            <br />
            <span className="text-volt">sovellusviidakolle.</span>
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-md leading-relaxed font-light animate-[fadeUp_0.8s_0.4s_forwards] opacity-0">
            {"Voltteri yhdist\u00e4\u00e4 kaikki latausverkostot, sessiohistorian ja tilastot yhteen sovellukseen. Etsi, lataa, seuraa. Vihdoin."}
          </p>
          <div className="mt-10 flex items-center gap-4 flex-wrap animate-[fadeUp_0.8s_0.55s_forwards] opacity-0">
            <button
              onClick={onOpenDemo}
              className="bg-volt text-primary-foreground px-8 py-3.5 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform shadow-[0_0_30px_rgba(200,244,0,0.25)] hover:shadow-[0_0_50px_rgba(200,244,0,0.4)]"
            >
              {"Kokeile ilmaiseksi \u2192"}
            </button>
            <a
              href="#features"
              className="text-muted-foreground text-sm flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              {"Katso ominaisuudet \u2193"}
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="border-t border-b border-border-volt px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:px-12 animate-[fadeUp_0.8s_0.7s_forwards] opacity-0">
        {[
          { num: "12+", label: "Latausverkostoa" },
          { num: "4 800+", label: "Latauspistett\u00e4" },
          { num: "1", label: "Sovellus" },
          { num: "0 \u20ac", label: "Aloituskulut" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-heading text-3xl font-extrabold text-volt tracking-tight">{stat.num}</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Problem Section */}
      <section id="features" className="px-6 py-24 bg-surface lg:px-12">
        <RevealOnScroll>
          <p className="text-xs tracking-[0.18em] uppercase text-volt font-medium mb-4">Ongelma</p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tighter max-w-xl mb-16">
            Kuinka monta sovellusta sinulla on?
          </h2>
        </RevealOnScroll>

        <RevealOnScroll className="flex flex-wrap gap-3 mb-12">
          {["Virta", "Recharge", "ABC Lataus", "K-Lataus", "Fortum Charge", "Tesla", "Lidl Charge"].map((name) => (
            <span
              key={name}
              className="bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full text-sm text-muted-foreground line-through opacity-40"
            >
              {name}
            </span>
          ))}
          <span className="bg-volt-faint border border-volt/30 px-4 py-2 rounded-full text-sm text-volt font-medium">
            {"Voltteri \u2713"}
          </span>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-volt border border-border-volt rounded-2xl overflow-hidden max-w-3xl">
            {[
              {
                title: "Ennen Voltteri",
                desc: "7 sovellusta, 7 tili\u00e4, 7 salasanaa. Latausasemaa etsiess\u00e4 pit\u00e4\u00e4 avata useita sovelluksia ja toivoa parasta.",
                type: "pain",
              },
              {
                title: "Voltterilla",
                desc: "Yksi sovellus n\u00e4ytt\u00e4\u00e4 kaikki asemat, hinnat ja saatavuuden reaaliajassa. Oikea asema l\u00f6ytyy sekunneissa.",
                type: "gain",
              },
              {
                title: "Hajanainen historia",
                desc: "Lataushistoriasi on sirpaleina eri palveluissa. Kokonaiskuva puuttuu t\u00e4ysin.",
                type: "pain",
              },
              {
                title: "Selke\u00e4 kokonaiskuva",
                desc: "Kaikki lataukset, kulut ja tilastot yhdess\u00e4 paikassa. Tied\u00e4t aina mit\u00e4 olet k\u00e4ytt\u00e4nyt.",
                type: "gain",
              },
            ].map((cell) => (
              <div
                key={cell.title}
                className={`bg-surface2 p-8 border-l-2 ${cell.type === "pain" ? "border-l-ev-red" : "border-l-volt"}`}
              >
                <h3 className="font-heading font-bold text-base mb-2">{cell.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cell.desc}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24 lg:px-12">
        <RevealOnScroll>
          <p className="text-xs tracking-[0.18em] uppercase text-volt font-medium mb-4">Ominaisuudet</p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight tracking-tighter max-w-xl mb-16">
            {"Kaikki mit\u00e4 tarvitset"}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-volt border border-border-volt rounded-2xl overflow-hidden">
            {[
              {
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                title: "Yhten\u00e4inen kartta",
                desc: "Kaikki latausasemat yhdell\u00e4 kartalla verkostosta riippumatta. Suodata tehon, hinnan tai saatavuuden mukaan.",
              },
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Reaaliaikainen saatavuus",
                desc: "N\u00e4e heti onko asema vapaa, varattuna tai poissa k\u00e4yt\u00f6st\u00e4. Ei turhia ajoja.",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Hintavertailu",
                desc: "Vertaile hintoja eri verkostojen v\u00e4lill\u00e4 ja valitse edullisin vaihtoehto reitill\u00e4si.",
              },
              {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Lataushistoria & tilastot",
                desc: "Kaikki lataukset tallentuvat automaattisesti. Seuraa kulutusta, kustannuksia ja CO\u2082-s\u00e4\u00e4st\u00f6j\u00e4.",
              },
              {
                icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
                title: "\u00c4lykk\u00e4\u00e4t ilmoitukset",
                desc: "Saat ilmoituksen kun lataus on valmis, asema vapautuu tai hinta laskee.",
              },
              {
                icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                title: "Reittien suunnittelu",
                desc: "Suunnittele pitk\u00e4t matkat etuk\u00e4teen. Voltteri ehdottaa parhaat lataustyspysahdykset reitill\u00e4si.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-surface p-8 hover:bg-surface2 transition-colors">
                <div className="w-11 h-11 bg-volt-faint rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-volt" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* App Showcase */}
      <section id="app" className="px-6 py-24 bg-surface lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Phone mockup */}
          <RevealOnScroll className="flex justify-center">
            <div className="w-[260px] h-[520px] bg-surface rounded-[40px] border-[1.5px] border-volt/20 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_60px_rgba(200,244,0,0.08)]">
              <div className="p-6 pb-4 h-full flex flex-col gap-3">
                <div>
                  <p className="text-[0.7rem] text-muted-foreground">{"Hei, Jani \uD83D\uDC4B"}</p>
                  <p className="font-heading font-extrabold text-lg text-volt">Voltteri</p>
                </div>

                {/* Last session card (replaces battery card) */}
                <div className="bg-surface2 rounded-2xl p-4 border border-border-volt">
                  <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest mb-1">Viimeisin lataus</p>
                  <p className="font-heading font-extrabold text-base text-volt">K-Lataus Kerava</p>
                  <p className="text-[0.65rem] text-muted-foreground">{"eilen 18:42 \u00b7 42 kWh \u00b7 7,90 \u20ac"}</p>
                </div>

                {/* Map placeholder */}
                <div className="bg-gradient-to-br from-surface2 to-[#0a1520] rounded-xl h-[120px] flex items-center justify-center text-[0.7rem] text-muted-foreground border border-border-volt relative overflow-hidden">
                  <div className="absolute w-2 h-2 rounded-full bg-volt shadow-[0_0_10px_var(--volt)] top-[30%] left-[40%]" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-ev-blue shadow-[0_0_8px_var(--blue)] top-[55%] left-[65%]" />
                  <div className="absolute w-1.5 h-1.5 rounded-full bg-volt opacity-60 top-[70%] left-[30%]" />
                  <span className="relative z-10">{"L\u00e4hell\u00e4 olevat asemat"}</span>
                </div>

                {/* Station list */}
                <div className="flex flex-col gap-2">
                  {[
                    { name: "K-Lataus Kerava", dist: "1.2 km \u00b7 150 kW", avail: "4/6 vapaa" },
                    { name: "Virta Hyvink\u00e4\u00e4", dist: "3.4 km \u00b7 50 kW", avail: "2/2 vapaa" },
                    { name: "Fortum J\u00e4rvenp\u00e4\u00e4", dist: "8.1 km \u00b7 22 kW", avail: "Varattuna" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between bg-surface2 rounded-lg px-3 py-2.5 border border-border-volt"
                    >
                      <div>
                        <p className="text-[0.65rem] font-semibold">{s.name}</p>
                        <p className="text-[0.6rem] text-muted-foreground">{s.dist}</p>
                      </div>
                      <p
                        className={`text-[0.6rem] font-semibold ${s.avail === "Varattuna" ? "text-muted-foreground" : "text-volt"}`}
                      >
                        {s.avail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Content side */}
          <RevealOnScroll>
            <p className="text-xs tracking-[0.18em] uppercase text-volt font-medium mb-4">Sovellus</p>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,3rem)] font-extrabold tracking-tighter leading-tight mb-6">
              {"Suunniteltu s\u00e4hk\u00f6autoilijalle, ei insin\u00f6\u00f6rille."}
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light mb-8">
              {"Voltteri on yksinkertainen k\u00e4ytt\u00e4\u00e4 mutta ei tyhm\u00e4. Yksi kirjautuminen, kaikki verkostot. Saat kaiken tarpeellisen heti n\u00e4kyviin ilman, ett\u00e4 sinun pit\u00e4\u00e4 opiskella sovellusta."}
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Viimeisin lataus ja kuukauden kulut heti etusivulta",
                "L\u00e4himm\u00e4t vapaat asemat ilman klikkailua",
                "Latauksen aloitus suoraan sovelluksesta",
                "Kaikki verkostot samalla kirjautumisella",
                "Toimii my\u00f6s offline-tilassa kartalla",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <svg
                    className="w-4 h-4 text-volt mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center bg-surface border-t border-border-volt lg:px-12" id="download">
        <RevealOnScroll>
          <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold tracking-tighter leading-none mb-6">
            {"Valmis lopettamaan"}
            <br />
            <span className="text-volt">sovellusviidakon?</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light mb-10">
            {"Lataa Voltteri ilmaiseksi ja yhdist\u00e4 kaikki latausverkostosi."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={onOpenDemo}
              className="bg-volt text-primary-foreground px-8 py-3.5 rounded-full font-bold text-base hover:-translate-y-0.5 transition-transform shadow-[0_0_30px_rgba(200,244,0,0.25)] hover:shadow-[0_0_50px_rgba(200,244,0,0.4)]"
            >
              {"Avaa Voltteri \u2192"}
            </button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {"Toimii suoraan selaimessa \u2014 ei sovelluskauppoja, ei asennuksia."}
            <br />
            {"Lis\u00e4\u00e4 aloitusn\u00e4yt\u00f6lle yhdell\u00e4 napautuksella ja k\u00e4yt\u00e4 kuin natiivisovellusta."}
          </p>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-volt px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 lg:px-12">
        <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-volt">
          <VoltteriLogo size={24} />
          Voltteri
        </div>
        <p className="text-sm text-muted-foreground">{"© 2025 Janope. Kaikki oikeudet pid\u00e4tetaan."}</p>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-volt transition-colors">
            Tietosuoja
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-volt transition-colors">
            {"K\u00e4ytt\u00f6ehdot"}
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-volt transition-colors">
            {"Ota yhteytt\u00e4"}
          </a>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
