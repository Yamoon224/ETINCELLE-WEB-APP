"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Copy, Download, QrCode, Share } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import QRCode from "qrcode"

export default function PartagePage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [appUrl, setAppUrl] = useState("https://etincelle-app.vercel.app")
  const [generating, setGenerating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const generateQRCode = async () => {
    setGenerating(true)

    try {
      const dataUrl = await QRCode.toDataURL(appUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })

      setQrCodeDataUrl(dataUrl)
    } catch (error: any) {
      console.error("Erreur lors de la génération du QR code:", error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le QR code",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return

    const link = document.createElement("a")
    link.href = qrCodeDataUrl
    link.download = `etincelle-app-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Etincelle - Application de scan QR",
          text: "Découvrez Etincelle, l'application de scan QR simple et efficace !",
          url: appUrl,
        })
      } catch (error) {
        console.error("Erreur lors du partage:", error)
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appUrl)
    toast({
      title: "Copié",
      description: "Le lien a été copié dans le presse-papiers",
    })
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col"
    >
      <header className="flex items-center p-4 border-b border-gray-800">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Partager Etincelle</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#FF3D00" />
                <path d="M24 12L32 20H16L24 12Z" fill="white" />
                <path d="M24 36L16 28H32L24 36Z" fill="white" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Partagez Etincelle</h2>
            <p className="text-gray-400 mb-6">
              Faites découvrir Etincelle à vos amis et collègues pour scanner et générer des QR codes facilement.
            </p>

            <Tabs defaultValue="qrcode" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                <TabsTrigger value="link">Lien</TabsTrigger>
              </TabsList>

              <TabsContent value="qrcode" className="space-y-4 mt-4">
                {qrCodeDataUrl ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <img src={qrCodeDataUrl || "/placeholder.svg"} alt="QR Code Etincelle" className="w-64 h-64" />
                    </div>
                    <div className="flex gap-3 w-full">
                      <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={downloadQRCode}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={shareApp}>
                        <Share className="mr-2 h-4 w-4" />
                        Partager
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <QrCode className="h-24 w-24 text-gray-500 opacity-50 mb-4" />
                    <Button className="gradient-button" onClick={generateQRCode} disabled={generating}>
                      {generating ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Génération...
                        </span>
                      ) : (
                        "Générer le QR code"
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="link" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Input value={appUrl} onChange={(e) => setAppUrl(e.target.value)} className="bg-white/10" readOnly />
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copier
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={shareApp}>
                      <Share className="mr-2 h-4 w-4" />
                      Partager
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pourquoi partager Etincelle ?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-2 mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Simple et efficace</h4>
                  <p className="text-sm text-gray-400">
                    Interface intuitive pour scanner et générer des QR codes rapidement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-2 mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Fonctionne hors ligne</h4>
                  <p className="text-sm text-gray-400">
                    Utilisable sans connexion internet pour scanner et générer des QR codes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-full p-2 mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Gratuit et sans publicité</h4>
                  <p className="text-sm text-gray-400">Aucun coût caché ni publicité intrusive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
