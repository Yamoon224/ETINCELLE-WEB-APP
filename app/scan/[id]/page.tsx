"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Copy, Share, Star, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { type Scan, deleteScan, getScans, updateScan } from "@/lib/local-storage"

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const [scan, setScan] = useState<Scan | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Charger le scan depuis localStorage
    const scans = getScans()
    const foundScan = scans.find((s) => s.id === params.id)
    setScan(foundScan || null)
    setLoading(false)

    if (!foundScan) {
      toast({
        title: "Erreur",
        description: "Scan introuvable",
        variant: "destructive",
      })
      router.push("/historique")
    }
  }, [params.id, router, toast])

  const toggleFavorite = () => {
    if (!scan) return

    const updatedScan = updateScan(scan.id, { favorite: !scan.favorite })
    if (updatedScan) {
      setScan(updatedScan)
    }
  }

  const handleDeleteScan = () => {
    if (!scan) return

    const success = deleteScan(scan.id)
    if (success) {
      toast({
        title: "Supprimé",
        description: "Le scan a été supprimé de votre historique",
      })
      router.push("/historique")
    }
  }

  const copyToClipboard = () => {
    if (!scan) return

    navigator.clipboard.writeText(scan.content)
    toast({
      title: "Copié",
      description: "Le contenu a été copié dans le presse-papiers",
    })
  }

  const shareScan = async () => {
    if (!scan) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: scan.title,
          text: scan.content,
        })
      } catch (error) {
        console.error("Erreur lors du partage:", error)
      }
    } else {
      copyToClipboard()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderContent = () => {
    if (!scan) return null

    if (scan.type === "url" && scan.content.startsWith("http")) {
      return (
        <>
          <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-60 overflow-auto">
            <p className="text-white break-words">{scan.content}</p>
          </div>
          <Button className="w-full gradient-button mb-4" onClick={() => window.open(scan.content, "_blank")}>
            Ouvrir le lien
          </Button>
        </>
      )
    }

    return (
      <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-60 overflow-auto">
        <p className="text-white break-words">{scan.content}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <header className="flex items-center p-4 border-b border-gray-800">
          <Link href="/historique" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Détails du scan</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </main>
    )
  }

  if (!scan) {
    return (
      <main className="flex min-h-screen flex-col">
        <header className="flex items-center p-4 border-b border-gray-800">
          <Link href="/historique" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Détails du scan</h1>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-400">Scan introuvable</p>
        </div>
      </main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col"
    >
      <header className="flex items-center p-4 border-b border-gray-800">
        <Link href="/historique" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Détails du scan</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              {scan.title}
              {scan.favorite && <Star className="h-4 w-4 ml-2 text-yellow-400 fill-yellow-400" />}
            </h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Star className={`h-5 w-5 ${scan.favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
                <span className="sr-only">Favori</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDeleteScan}>
                <Trash2 className="h-5 w-5 text-gray-400" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">Scanné le {formatDate(scan.created_at)}</p>

          {renderContent()}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copier
            </Button>
            <Button variant="outline" className="flex-1 border-white/20 text-white" onClick={shareScan}>
              <Share className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 pb-4">
        <div className="gradient-button rounded-full p-1 flex">
          <Link href="/historique" className="flex-1 py-2 text-center text-white bg-white/20 rounded-full">
            Mon historique
          </Link>
          <Link href="/scanner" className="flex-1 py-2 text-center text-white rounded-full hover:bg-white/10">
            Scanner un code
          </Link>
        </div>
      </div>
    </motion.main>
  )
}
