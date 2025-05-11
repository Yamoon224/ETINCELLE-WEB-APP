"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft, Download, Share } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import QRCode from "qrcode"

export default function GenerateQRPage() {
  const [qrType, setQrType] = useState("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" })
  const [contact, setContact] = useState({ name: "", email: "", phone: "", address: "" })
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const generateQRCode = async () => {
    setGenerating(true)
    let content = ""

    try {
      switch (qrType) {
        case "url":
          content = url
          break
        case "text":
          content = text
          break
        case "wifi":
          content = `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;`
          break
        case "contact":
          content = `BEGIN:VCARD\nVERSION:3.0\nN:${contact.name}\nEMAIL:${contact.email}\nTEL:${contact.phone}\nADR:${contact.address}\nEND:VCARD`
          break
      }

      if (!content) {
        throw new Error("Veuillez remplir tous les champs requis")
      }

      const dataUrl = await QRCode.toDataURL(content, {
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
    link.download = `etincelle-qr-${qrType}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareQRCode = async () => {
    if (!qrCodeDataUrl) return

    if (navigator.share) {
      try {
        const blob = await fetch(qrCodeDataUrl).then((r) => r.blob())
        const file = new File([blob], "qrcode.png", { type: "image/png" })

        await navigator.share({
          title: "QR Code généré avec Etincelle",
          files: [file],
        })
      } catch (error) {
        console.error("Erreur lors du partage:", error)
      }
    } else {
      downloadQRCode()
    }
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
        <h1 className="text-lg font-semibold">Générer un QR code</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <Tabs
            defaultValue="url"
            onValueChange={(value) => {
              setQrType(value)
              setQrCodeDataUrl(null)
            }}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Texte</TabsTrigger>
              <TabsTrigger value="wifi">WiFi</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="text">Texte</Label>
                <Textarea
                  id="text"
                  placeholder="Entrez votre texte ici"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ssid">Nom du réseau (SSID)</Label>
                <Input
                  id="ssid"
                  placeholder="Nom du réseau WiFi"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe WiFi"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="encryption">Type de sécurité</Label>
                <select
                  id="encryption"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={wifi.encryption}
                  onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Sans mot de passe</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Nom complet"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  placeholder="+33 6 12 34 56 78"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  placeholder="Adresse complète"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  rows={2}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button className="w-full gradient-button" onClick={generateQRCode} disabled={generating}>
            {generating ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Génération...
              </span>
            ) : (
              "Générer le QR code"
            )}
          </Button>

          {qrCodeDataUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center mt-6"
            >
              <div className="bg-white p-4 rounded-lg mb-4">
                <img src={qrCodeDataUrl || "/placeholder.svg"} alt="QR Code généré" className="w-64 h-64" />
              </div>
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={downloadQRCode}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={shareQRCode}>
                  <Share className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.main>
  )
}
