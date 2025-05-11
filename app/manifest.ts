import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Etincelle",
    short_name: "Etincelle",
    description: "Application de scan de QR code",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FF3D00",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
