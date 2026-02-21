"use client"

import { useState } from "react"
import VoltteriLanding from "@/components/voltteri-landing"
import VoltteriDemo from "@/components/voltteri-demo"

export default function Page() {
  const [showDemo, setShowDemo] = useState(false)

  if (showDemo) {
    return <VoltteriDemo onBackToLanding={() => setShowDemo(false)} />
  }

  return <VoltteriLanding onOpenDemo={() => setShowDemo(true)} />
}
