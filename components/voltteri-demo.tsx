"use client"

import { useState } from "react"
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

const NAV_ITEMS = [
  { id: "dashboard", label: "Kojelauta", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  {
    id: "map",
    label: "Kartta",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    badge: "12",
  },
  {
    id: "history",
    label: "Historia",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    id: "route",
    label: "Reitti",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  },
]

const STATIONS = [
  { name: "K-Lataus Kerava", network: "K-Lataus", avail: "4/6 vapaa", dist: "1.2 km", power: "150 kW", price: "0.19 \u20ac/kWh", status: "good" },
  { name: "Virta Hyvink\u00e4\u00e4", network: "Virta", avail: "2/2 vapaa", dist: "3.4 km", power: "50 kW", price: "0.22 \u20ac/kWh", status: "good" },
  { name: "Fortum J\u00e4rvenp\u00e4\u00e4", network: "Fortum", avail: "1/4 vapaa", dist: "8.1 km", power: "22 kW", price: "0.18 \u20ac/kWh", status: "busy" },
  { name: "ABC Hyvink\u00e4\u00e4", network: "ABC Lataus", avail: "0/2 vapaa", dist: "9.4 km", power: "100 kW", price: "0.21 \u20ac/kWh", status: "full" },
]

const SESSIONS = [
  { name: "K-Lataus Kerava", network: "K-Lataus \u00b7 150 kW", kwh: "42,1", cost: "7,90 \u20ac", date: "Eilen 18:42" },
  { name: "Virta Hyvink\u00e4\u00e4", network: "Virta \u00b7 50 kW", kwh: "28,4", cost: "5,40 \u20ac", date: "Ma 17.2." },
  { name: "Fortum J\u00e4rvenp\u00e4\u00e4", network: "Fortum \u00b7 22 kW", kwh: "18,7", cost: "3,20 \u20ac", date: "La 15.2." },
  { name: "Recharge J\u00e4rvenp\u00e4\u00e4", network: "Recharge \u00b7 150 kW", kwh: "55,2", cost: "11,80 \u20ac", date: "Pe 14.2." },
]

const WEEKLY_DATA = [30, 60, 45, 80, 20, 55, 70]
const WEEKLY_LABELS = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"]

function StatusPill({ status, text }: { status: string; text: string }) {
  const colors = {
    good: "bg-volt/10 text-volt",
    busy: "bg-yellow-500/10 text-yellow-400",
    full: "bg-ev-red/10 text-ev-red",
  }
  return (
    <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${colors[status as keyof typeof colors] || ""}`}>
      {text}
    </span>
  )
}

/* ====== DASHBOARD VIEW ====== */
function DashboardView() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] h-full overflow-hidden">
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-5 pb-20 lg:pb-6">
        <h2 className="font-heading text-xl font-extrabold tracking-tight">
          Kojelauta <span className="text-muted-foreground font-normal text-sm ml-2">Helmikuu 2025</span>
        </h2>

        {/* Last session widget (replaces battery) */}
        <div className="bg-surface border border-border2 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Viimeisin lataus</p>
            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="text-lg font-extrabold tracking-tight">K-Lataus Kerava</span>
              <span className="text-[0.72rem] text-muted-foreground">eilen 18:42</span>
            </div>
            <div className="flex gap-5 mt-3 flex-wrap">
              <div>
                <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">kWh ladattu</p>
                <p className="font-heading text-xl font-extrabold text-volt tracking-tight">42,1</p>
              </div>
              <div>
                <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">Kustannus</p>
                <p className="font-heading text-xl font-extrabold tracking-tight">{"7,90 \u20ac"}</p>
              </div>
              <div>
                <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">Teho</p>
                <p className="font-heading text-xl font-extrabold tracking-tight">150 kW</p>
              </div>
              <div>
                <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">Kesto</p>
                <p className="font-heading text-xl font-extrabold tracking-tight">24 min</p>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground leading-relaxed hidden md:block">
            Verkosto<br />
            <strong className="text-volt">K-Lataus</strong><br />
            <span className="text-[0.68rem]">{"0,19 \u20ac/kWh"}</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "T\u00e4n\u00e4 kuuna", value: "247 kWh", sub: "\u2191 12% viime kuusta", highlight: true, valueColor: "text-volt" },
            { label: "Kustannukset", value: "38,40 \u20ac", sub: "\u2191 8% viime kuusta", highlight: false, valueColor: "text-foreground" },
            { label: "Latauksia", value: "14", sub: "9 eri asemalla", highlight: false, valueColor: "text-foreground" },
            { label: "CO\u2082 s\u00e4\u00e4stetty", value: "41 kg", sub: "vs. bensiiniauto", highlight: false, valueColor: "text-ev-blue" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`bg-surface border rounded-2xl p-5 flex flex-col gap-1.5 transition-colors ${kpi.highlight ? "border-volt/25 bg-volt/[0.04]" : "border-border2 hover:border-border-volt"}`}
            >
              <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">{kpi.label}</p>
              <p className={`font-heading text-2xl font-extrabold tracking-tight leading-none ${kpi.valueColor}`}>{kpi.value}</p>
              <p className="text-[0.72rem] text-muted-foreground">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold">{"Viimeisimm\u00e4t lataukset"}</h3>
            <button className="text-xs text-volt font-semibold">{"\u2192 N\u00e4yt\u00e4 kaikki"}</button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-2 px-4 pb-1 text-[0.68rem] text-muted-foreground uppercase tracking-widest font-semibold">
              <span>Asema</span>
              <span>kWh</span>
              <span>Hinta</span>
              <span>{"P\u00e4iv\u00e4m\u00e4\u00e4r\u00e4"}</span>
              <span>Tila</span>
            </div>
            {SESSIONS.map((s) => (
              <div
                key={s.date}
                className="bg-surface border border-border2 rounded-xl p-3.5 grid grid-cols-[1fr_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_80px] lg:items-center gap-2 hover:border-border-volt transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{s.network}</p>
                </div>
                <p className="text-sm font-semibold text-volt">{s.kwh}</p>
                <p className="text-sm font-semibold">{s.cost}</p>
                <p className="text-xs text-muted-foreground hidden lg:block">{s.date}</p>
                <span className="hidden lg:inline-flex items-center gap-1 text-[0.7rem] font-semibold bg-volt/10 text-volt px-2 py-0.5 rounded-full w-fit">
                  {"\u2713 Valmis"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-col gap-5 border-l border-border2 bg-surface p-5 overflow-y-auto">
        <div>
          <h3 className="text-sm font-bold mb-3">{"L\u00e4hell\u00e4 olevat asemat"}</h3>
          {STATIONS.map((s) => (
            <div
              key={s.name}
              className={`bg-surface2 border rounded-xl p-3.5 mb-2 cursor-pointer hover:border-border-volt transition-colors ${s.status === "good" && s.dist === "1.2 km" ? "border-volt/20" : "border-border2"}`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-sm font-bold">{s.name}</p>
                  <p className="text-[0.68rem] text-muted-foreground">{s.network}</p>
                </div>
                <StatusPill status={s.status} text={s.avail} />
              </div>
              <div className="flex gap-3 text-[0.7rem] text-muted-foreground">
                <span>{s.dist}</span>
                <span>{s.power}</span>
                <span>{s.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-ev-blue/[0.08] border border-ev-blue/20 rounded-xl p-3.5 flex items-center gap-3 text-xs">
          <span className="text-lg shrink-0">{"\uD83C\uDF31"}</span>
          <p className="text-muted-foreground leading-relaxed">
            {"Olet s\u00e4\u00e4st\u00e4nyt "}
            <strong className="text-ev-blue">{"41 kg CO\u2082"}</strong>
            {" t\u00e4n\u00e4 kuuna ajamalla s\u00e4hk\u00f6ll\u00e4."}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-3">Viikon lataukset (kWh)</h3>
          <div className="flex items-end gap-1 h-12">
            {WEEKLY_DATA.map((val, i) => (
              <div
                key={WEEKLY_LABELS[i]}
                className={`flex-1 rounded-t border transition-colors ${i === 6 ? "bg-volt/30 border-volt" : "bg-volt-faint border-volt/15 hover:bg-volt/20"}`}
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
          <div className="flex gap-1 mt-1">
            {WEEKLY_LABELS.map((l) => (
              <span key={l} className="flex-1 text-center text-[0.6rem] text-muted-foreground">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ====== MAP VIEW ====== */
function MapView() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] h-full overflow-hidden">
      <div className="flex-1 bg-[#0a1520] relative overflow-hidden min-h-[400px]">
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 80px)",
          }}
        />
        {/* Roads */}
        <div className="absolute w-0.5 h-full left-[35%] top-0 bg-white/[0.06]" />
        <div className="absolute w-0.5 h-full left-[60%] top-0 bg-white/[0.04]" />
        <div className="absolute h-0.5 w-full top-[40%] left-0 bg-white/[0.06]" />
        <div className="absolute h-0.5 w-full top-[65%] left-0 bg-white/[0.04]" />

        {/* My location */}
        <div className="absolute w-3.5 h-3.5 rounded-full bg-ev-blue shadow-[0_0_0_4px_rgba(0,194,255,0.2),0_0_20px_rgba(0,194,255,0.3)] left-[35%] top-[40%] -translate-x-1/2 -translate-y-1/2" />

        {/* Pins */}
        {[
          { left: "28%", top: "32%", text: "4/6 \u00b7 150kW \u00b7 0.19\u20ac", color: "volt" },
          { left: "50%", top: "55%", text: "2/2 \u00b7 50kW \u00b7 0.22\u20ac", color: "blue" },
          { left: "65%", top: "38%", text: "3/4 \u00b7 100kW \u00b7 0.21\u20ac", color: "volt" },
          { left: "75%", top: "62%", text: "T\u00e4ynn\u00e4 \u00b7 22kW", color: "red" },
          { left: "20%", top: "68%", text: "1/2 \u00b7 50kW \u00b7 0.20\u20ac", color: "blue" },
          { left: "55%", top: "25%", text: "6/6 \u00b7 150kW \u00b7 0.18\u20ac", color: "volt" },
        ].map((pin, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-full"
            style={{ left: pin.left, top: pin.top }}
          >
            <div
              className={`rounded-lg px-2 py-1 text-[0.65rem] font-bold whitespace-nowrap shadow-lg ${
                pin.color === "volt"
                  ? "border-volt/40 text-volt bg-volt/[0.08] border"
                  : pin.color === "blue"
                    ? "border-ev-blue/40 text-ev-blue bg-ev-blue/[0.08] border"
                    : "border-ev-red/30 text-ev-red bg-ev-red/[0.06] border"
              }`}
            >
              {pin.text}
            </div>
            <div
              className={`w-2 h-2 rounded-full mt-0.5 ${
                pin.color === "volt"
                  ? "bg-volt shadow-[0_0_8px_var(--volt)]"
                  : pin.color === "blue"
                    ? "bg-ev-blue shadow-[0_0_8px_var(--blue)]"
                    : "bg-ev-red"
              }`}
            />
          </div>
        ))}

        {/* Search bar */}
        <div className="absolute top-4 left-4 right-16 lg:right-auto bg-surface border border-border2 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-muted-foreground lg:w-64">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="truncate">{"Hae asemaa tai osoitetta..."}</span>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {["+", "\u2212", "O"].map((c) => (
            <button
              key={c}
              className="w-9 h-9 bg-surface border border-border2 rounded-lg flex items-center justify-center text-sm text-muted-foreground hover:border-border-volt hover:text-foreground transition-colors"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="absolute bottom-4 left-4 flex gap-2 overflow-x-auto pb-2">
          {["Kaikki", "Vapaat", "50+ kW", "100+ kW", "Halvimmat"].map((f, i) => (
            <button
              key={f}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors whitespace-nowrap ${
                i === 0
                  ? "bg-volt-faint border-volt/30 text-volt"
                  : "bg-surface border-border2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-col gap-5 border-l border-border2 bg-surface p-5 overflow-y-auto">
        <div>
          <h3 className="text-sm font-bold mb-3">{"12 asemaa l\u00e4hell\u00e4"}</h3>
          {STATIONS.map((s) => (
            <div
              key={s.name}
              className={`bg-surface2 border rounded-xl p-3.5 mb-2 cursor-pointer hover:border-border-volt transition-colors ${s.status === "good" && s.dist === "1.2 km" ? "border-volt/20" : "border-border2"}`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-sm font-bold">{s.name}</p>
                  <p className="text-[0.68rem] text-muted-foreground">{s.network}</p>
                </div>
                <StatusPill status={s.status} text={s.avail} />
              </div>
              <div className="flex gap-3 text-[0.7rem] text-muted-foreground">
                <span>{s.dist}</span>
                <span>{s.power}</span>
                <span>{s.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ====== HISTORY VIEW ====== */
function HistoryView() {
  const monthlyData = [
    { val: 32, label: "1.2" },
    { val: 0, label: "2.2" },
    { val: 28, label: "3.2" },
    { val: 0, label: "4.2" },
    { val: 55, label: "5.2" },
    { val: 18, label: "6.2" },
    { val: 0, label: "7.2" },
    { val: 42, label: "8.2" },
    { val: 0, label: "9.2" },
    { val: 35, label: "10.2" },
    { val: 0, label: "11.2" },
    { val: 22, label: "12.2" },
  ]
  const maxVal = Math.max(...monthlyData.map((d) => d.val))

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] h-full overflow-hidden">
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-5 pb-20 lg:pb-6">
        <h2 className="font-heading text-xl font-extrabold tracking-tight">
          Lataushistoria <span className="text-muted-foreground font-normal text-sm ml-2">Helmikuu 2025</span>
        </h2>

        {/* Chart */}
        <div className="bg-surface border border-border2 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">Kuukauden lataukset (kWh)</h3>
            <div className="flex gap-2">
              {["kWh", "\u20ac", "Latauksia"].map((f, i) => (
                <button
                  key={f}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border ${i === 0 ? "bg-volt-faint border-volt/30 text-volt" : "bg-transparent border-border2 text-muted-foreground"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {monthlyData.map((d, i) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {d.val > 0 && <span className="text-[0.65rem] text-volt font-bold">{d.val}</span>}
                <div
                  className={`w-full rounded-t border cursor-pointer transition-colors ${i === 4 ? "bg-volt/25 border-volt/40" : "bg-volt-faint border-volt/12 hover:bg-volt/20"}`}
                  style={{ height: d.val > 0 ? `${(d.val / maxVal) * 100}%` : "0%" }}
                />
                <span className="text-[0.65rem] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface border border-border2 rounded-2xl p-5">
            <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">{"Yhteens\u00e4 kWh"}</p>
            <p className="font-heading text-2xl font-extrabold text-volt mt-1">247 kWh</p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-volt">{"\u2191 12%"}</span> vs. tammikuu
            </p>
          </div>
          <div className="bg-surface border border-border2 rounded-2xl p-5">
            <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">Kokonaiskustannus</p>
            <p className="font-heading text-2xl font-extrabold mt-1">{"38,40 \u20ac"}</p>
            <p className="text-xs text-muted-foreground mt-1">{"0.155 \u20ac/kWh keskiarvo"}</p>
          </div>
          <div className="bg-surface border border-border2 rounded-2xl p-5">
            <p className="text-[0.7rem] text-muted-foreground uppercase tracking-widest font-semibold">Suosituin verkosto</p>
            <p className="font-heading text-xl font-extrabold text-ev-blue mt-1">K-Lataus</p>
            <p className="text-xs text-muted-foreground mt-1">{"6 latausta \u00b7 142 kWh"}</p>
          </div>
        </div>

        {/* All sessions */}
        <div>
          <h3 className="text-sm font-bold mb-3">Kaikki lataukset</h3>
          <div className="flex flex-col gap-2">
            {SESSIONS.map((s) => (
              <div
                key={s.date}
                className="bg-surface border border-border2 rounded-xl p-3.5 grid grid-cols-[1fr_auto_auto] lg:grid-cols-[2fr_1fr_1fr_1fr_80px] lg:items-center gap-2 hover:border-border-volt transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{s.network}</p>
                </div>
                <p className="text-sm font-semibold text-volt">{s.kwh}</p>
                <p className="text-sm font-semibold">{s.cost}</p>
                <p className="text-xs text-muted-foreground hidden lg:block">{s.date}</p>
                <span className="hidden lg:inline-flex items-center gap-1 text-[0.7rem] font-semibold bg-volt/10 text-volt px-2 py-0.5 rounded-full w-fit">
                  {"\u2713 Valmis"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-col gap-5 border-l border-border2 bg-surface p-5 overflow-y-auto">
        <div>
          <h3 className="text-sm font-bold mb-3">Verkostojakauma</h3>
          <div className="flex flex-col gap-2.5 mt-2">
            {[
              { name: "K-Lataus", pct: 57, color: "bg-gradient-to-r from-volt-dim to-volt" },
              { name: "Recharge", pct: 22, color: "bg-ev-blue" },
              { name: "Virta", pct: 11, color: "bg-yellow-400" },
              { name: "Fortum", pct: 10, color: "bg-muted2" },
            ].map((n) => (
              <div key={n.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{n.name}</span>
                  <span className="text-volt">{n.pct}%</span>
                </div>
                <div className="h-2 bg-surface2 rounded-full overflow-hidden border border-border2">
                  <div className={`h-full rounded-full ${n.color}`} style={{ width: `${n.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ev-blue/[0.08] border border-ev-blue/20 rounded-xl p-3.5 flex items-center gap-3 text-xs">
          <span className="text-lg shrink-0">{"\uD83C\uDF31"}</span>
          <p className="text-muted-foreground leading-relaxed">
            {"Helmikuussa s\u00e4\u00e4stit "}
            <strong className="text-ev-blue">{"41 kg CO\u2082"}</strong>
            {". Vuodessa se on jo "}
            <strong className="text-ev-blue">~500 kg</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ====== ROUTE VIEW ====== */
function RouteView() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[360px_1fr] h-full overflow-hidden">
      <div className="lg:border-r border-border2 p-4 lg:p-5 overflow-y-auto flex flex-col gap-4 pb-20 lg:pb-5">
        <h2 className="font-heading text-base font-extrabold">Reittien suunnittelu</h2>

        {/* Route inputs */}
        <div className="flex flex-col gap-2">
          <div className="bg-surface2 border border-border2 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-ev-blue shrink-0" />
            <div>
              <span className="text-[0.7rem] text-muted-foreground block">{"L\u00e4ht\u00f6piste"}</span>
              <span className="text-sm font-semibold">{"Hyvink\u00e4\u00e4, kotiosoite"}</span>
            </div>
          </div>
          <div className="w-px h-4 bg-border2 ml-4" />
          <div className="bg-surface2 border border-border2 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-volt shrink-0" />
            <div>
              <span className="text-[0.7rem] text-muted-foreground block">{"M\u00e4\u00e4r\u00e4np\u00e4\u00e4"}</span>
              <span className="text-sm font-semibold">Tampere, Keskustori</span>
            </div>
          </div>
        </div>

        {/* Car model + estimated range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-surface2 border border-border2 rounded-xl px-4 py-3">
            <span className="text-[0.7rem] text-muted-foreground block">Automalli</span>
            <span className="text-base font-semibold">Tesla Model Y LR</span>
          </div>
          <div className="bg-surface2 border border-border2 rounded-xl px-4 py-3">
            <span className="text-[0.7rem] text-muted-foreground block">Arvioitu kantama</span>
            <span className="text-base font-semibold text-volt">~400 km</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-volt-faint border border-volt/20 rounded-xl p-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-heading text-lg font-extrabold text-volt">176 km</p>
            <p className="text-[0.65rem] text-muted-foreground">Matkan pituus</p>
          </div>
          <div>
            <p className="font-heading text-lg font-extrabold text-volt">1 stop</p>
            <p className="text-[0.65rem] text-muted-foreground">Latausstoppi</p>
          </div>
          <div>
            <p className="font-heading text-lg font-extrabold text-volt">2h 45min</p>
            <p className="text-[0.65rem] text-muted-foreground">Kokonaisaika</p>
          </div>
        </div>

        {/* Stop */}
        <div>
          <h3 className="text-sm font-bold mb-3">Suositellut latausstoppit</h3>
          <div className="bg-surface2 border border-volt/15 rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-volt text-primary-foreground text-[0.65rem] font-extrabold flex items-center justify-center">
                  1
                </div>
                <span className="text-sm font-bold ml-2">{"Recharge H\u00e4meenlinna"}</span>
              </div>
              <span className="text-[0.7rem] text-muted-foreground">+25 min</span>
            </div>
            <div className="flex gap-3 text-[0.7rem] text-muted-foreground pl-1 flex-wrap">
              <span>{"88 km l\u00e4hd\u00f6st\u00e4"}</span>
              <span>150 kW</span>
              <span>
                +<strong className="text-volt">45 kWh</strong>
              </span>
              <span>{"8,50 \u20ac"}</span>
            </div>
          </div>
        </div>

        <button className="bg-volt text-primary-foreground rounded-xl py-3.5 text-sm font-bold hover:opacity-90 transition-opacity w-full">
          {"Aloita navigointi \u2192"}
        </button>

        <div className="bg-ev-blue/[0.08] border border-ev-blue/20 rounded-xl p-3.5 flex items-center gap-3 text-xs">
          <span className="text-lg shrink-0">{"\uD83D\uDCA1"}</span>
          <p className="text-muted-foreground leading-relaxed">
            {"Vihje: L\u00e4hde klo 14\u201316 ja s\u00e4\u00e4st\u00e4t ~2\u20ac \u2014 hinnat ovat matalammat ruuhkan ulkopuolella."}
          </p>
        </div>
      </div>

      {/* Route map */}
      <div className="hidden lg:block bg-[#0a1520] relative overflow-hidden min-h-[400px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px, transparent 80px)",
          }}
        />
        <div className="absolute w-[3px] h-full left-1/2 top-0 bg-volt/15 rotate-[5deg] origin-center" />

        {/* Route line SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 48% 85% Q 52% 50% 48% 15%"
            stroke="#c8f400"
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.6"
          />
        </svg>

        {/* Start pin */}
        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full" style={{ left: "48%", top: "85%" }}>
          <div className="border border-ev-blue/40 text-ev-blue bg-ev-blue/[0.08] rounded-lg px-2 py-1 text-[0.65rem] font-bold whitespace-nowrap shadow-lg">
            {"Hyvink\u00e4\u00e4"}
          </div>
          <div className="w-2 h-2 rounded-full bg-ev-blue shadow-[0_0_8px_var(--blue)] mt-0.5" />
        </div>

        {/* Charging stop */}
        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full" style={{ left: "50%", top: "52%" }}>
          <div className="border border-volt/40 text-volt bg-volt/[0.08] rounded-lg px-2 py-1 text-[0.65rem] font-bold whitespace-nowrap shadow-lg">
            {"Recharge \u00b7 +45kWh"}
          </div>
          <div className="w-2 h-2 rounded-full bg-volt shadow-[0_0_8px_var(--volt)] mt-0.5" />
        </div>

        {/* Destination */}
        <div className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full" style={{ left: "48%", top: "15%" }}>
          <div className="border border-white/20 bg-white/[0.04] text-foreground rounded-lg px-2 py-1 text-[0.65rem] font-bold whitespace-nowrap shadow-lg">
            Tampere
          </div>
          <div className="w-2 h-2 rounded-full bg-foreground mt-0.5" />
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {["+", "\u2212"].map((c) => (
            <button
              key={c}
              className="w-9 h-9 bg-surface border border-border2 rounded-lg flex items-center justify-center text-sm text-muted-foreground hover:border-border-volt transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ====== MAIN DEMO COMPONENT ====== */
export default function VoltteriDemo({ onBackToLanding }: { onBackToLanding: () => void }) {
  const [activeView, setActiveView] = useState("dashboard")

  const SETTINGS_NAV = [
    {
      id: "car",
      label: "Autoprofiili",
      icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
    },
    {
      id: "payment",
      label: "Maksutavat",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      id: "settings",
      label: "Asetukset",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3.5 bg-surface border-b border-border-volt shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLanding} className="text-muted-foreground hover:text-foreground transition-colors mr-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-volt">
            <VoltteriLogo size={24} />
            Voltteri
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface2 border border-border2 flex items-center justify-center text-sm cursor-pointer relative">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-volt" />
          </div>
          <div className="flex items-center gap-2 bg-surface2 border border-border2 rounded-full py-1 px-3 pl-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-volt-dim to-ev-blue flex items-center justify-center text-[0.65rem] font-extrabold text-primary-foreground">
              JP
            </div>
            <span className="text-xs font-semibold">Jani</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop */}
        <div className="hidden lg:flex flex-col w-[220px] bg-surface border-r border-border-volt py-6 shrink-0">
          <p className="text-[0.65rem] tracking-[0.12em] uppercase text-muted2 px-5 mb-2">{"P\u00e4\u00e4valikko"}</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium border-l-2 transition-all ${
                activeView === item.id
                  ? "text-volt bg-volt-faint border-l-volt"
                  : "text-muted-foreground hover:text-foreground hover:bg-volt-faint border-l-transparent"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-volt text-primary-foreground text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <p className="text-[0.65rem] tracking-[0.12em] uppercase text-muted2 px-5 mb-2 mt-4">Asetukset</p>
          {SETTINGS_NAV.map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-volt-faint border-l-2 border-l-transparent transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View tabs */}
          <div className="hidden lg:flex border-b border-border2 bg-surface px-4 lg:px-6 shrink-0 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-4 py-3.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${
                  activeView === item.id
                    ? "text-volt border-b-volt"
                    : "text-muted-foreground hover:text-foreground border-b-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Views */}
          <div className="flex-1 overflow-hidden">
            {activeView === "dashboard" && <DashboardView />}
            {activeView === "map" && <MapView />}
            {activeView === "history" && <HistoryView />}
            {activeView === "route" && <RouteView />}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-volt flex z-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[0.6rem] font-semibold transition-colors relative ${
              activeView === item.id ? "text-volt" : "text-muted-foreground"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.badge && (
              <span className="absolute top-0.5 right-[calc(50%-18px)] bg-volt text-primary-foreground text-[0.5rem] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
            <span>{item.id === "dashboard" ? "Koti" : item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
