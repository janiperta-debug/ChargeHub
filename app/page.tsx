"use client"

import { useState } from "react"
import VoltteriLanding from "@/components/voltteri-landing"
import VoltteriDemo from "@/components/voltteri-demo"

export default function Page() {
  // App opens directly into the demo/app. The landing page is kept in the
  // codebase (reachable via onBackToLanding) but is not shown on startup.
  const [showDemo, setShowDemo] = useState(true)

  if (showDemo) {
    return <VoltteriDemo onBackToLanding={() => setShowDemo(false)} />
  }

  return <VoltteriLanding onOpenDemo={() => setShowDemo(true)} />
}
