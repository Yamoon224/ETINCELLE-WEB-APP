"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Flashlight, FlashlightOff, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { QRScanner } from "@/components/qr-scanner"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { addScan } from "@/lib/local-storage"
import { useAuth } from "@/components/auth-provider"

export default function ScannerPage() {
  const [scanning, setScanning] = useState(true)
  const [flashlight, setFlashlight] = useState(false)
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleScan = async (result: string) => {
    setScannedResult(result)
    setScanning(false)

    // Vibrer pour indiquer un scan réussi
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }

    // Déterminer le type de QR code
    let type = "url"
    let title = "URL"

    if (result.startsWith("BEGIN:VCARD")) {
      type = "contact"
      title = "Contact"
    } else if (result.startsWith("WIFI:")) {
      type = "wifi"
      title = "WiFi"
    } else if (result.startsWith("mailto:")) {
      type = "email"
      title = "Email"
    } else if (result.startsWith("tel:")) {
      type = "phone"
      title = "Téléphone"
    } else if (result.startsWith("geo:")) {
      type = "location"
      title = "Localisation"
    } else if (!result.startsWith("http")) {
      type = "text"
      title = "Texte"
    }

    // Sauvegarder dans localStorage
    addScan({
      content: result,
      type,
      title: `Code QR - ${title}`,
      favorite: false,
    })

    toast({
      title: "Scan réussi",
      description: "Le code QR a été enregistré dans votre historique",
    })
  }

  const handleError = (error: string) => {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive",
    })
  }

  const toggleFlashlight = async () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream
      if (!stream) return

      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()

      // Vérifier si la torche est supportée
      if (!capabilities.torch) {
        toast({
          title: "Non supporté",
          description: "Votre appareil ne supporte pas la torche",
          variant: "destructive",
        })
        return
      }

      await track.applyConstraints({
        advanced: [{ torch: !flashlight }],
      })

      setFlashlight(!flashlight)
    } catch (error) {
      console.error("Erreur lors de l'activation de la torche:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'activer la torche",
        variant: "destructive",
      })
    }
  }

  const resetScan = () => {
    setScannedResult(null)
    setScanning(true)
  }

  const goBack = () => {
    router.push("/")
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col bg-neutral-400"
    >
      <div className="relative w-full h-screen flex flex-col">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm" onClick={goBack}>
            <ChevronLeft className="h-5 w-5 text-white" />
            <span className="sr-only">Retour</span>
          </Button>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-sm"
            onClick={toggleFlashlight}
          >
            {flashlight ? (
              <FlashlightOff className="h-5 w-5 text-white" />
            ) : (
              <Flashlight className="h-5 w-5 text-white" />
            )}
            <span className="sr-only">Torche</span>
          </Button>
        </div>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div
                key="scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <QRScanner onScan={handleScan} onError={handleError} />
                <video ref={videoRef} className="hidden" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-white/70 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -translate-x-2 -translate-y-2"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white translate-x-2 -translate-y-2"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -translate-x-2 translate-y-2"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white translate-x-2 translate-y-2"></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4 text-white">Résultat du scan</h2>
                  <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-60 overflow-auto">
                    <p className="text-white break-words">{scannedResult}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {scannedResult?.startsWith("http") && (
                      <Button className="w-full gradient-button" onClick={() => window.open(scannedResult, "_blank")}>
                        Ouvrir le lien
                      </Button>
                    )}
                    <Button variant="outline" className="w-full border-white/20 text-white" onClick={resetScan}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Scanner à nouveau
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full px-4 pb-4">
          <div className="gradient-button rounded-full p-1 flex">
            <Link href="/historique" className="flex-1 py-2 text-center text-white rounded-full hover:bg-white/10">
              Mon historique
            </Link>
            <Link href="/scanner" className="flex-1 py-2 text-center text-white bg-white/20 rounded-full">
              Scanner un code
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
