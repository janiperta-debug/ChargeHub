import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voltteri - Kaikki lataukset",
    short_name: "Voltteri",
    description:
      "Voltteri yhdistää kaikki latausverkostot, sessiohistorian ja tilastot yhteen sovellukseen.",
    start_url: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080c10",
    theme_color: "#080c10",
    lang: "fi",
    categories: ["travel", "utilities", "navigation"],
    icons: [
      {
        src: "/icon-512.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
