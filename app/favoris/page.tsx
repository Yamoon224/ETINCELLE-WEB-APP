"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Search, Star, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { type Scan, deleteScan, getScans, updateScan } from "@/lib/local-storage"

export default function FavorisPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Charger les scans favoris depuis localStorage
    const allScans = getScans()
    const favoriteScans = allScans.filter((scan) => scan.favorite)
    setScans(favoriteScans)
    setLoading(false)
  }, [])

  const toggleFavorite = (scan: Scan) => {
    const updatedScan = updateScan(scan.id, { favorite: !scan.favorite })
    if (updatedScan) {
      // Mettre à jour la liste des favoris
      const allScans = getScans()
      const favoriteScans = allScans.filter((scan) => scan.favorite)
      setScans(favoriteScans)

      toast({
        title: updatedScan.favorite ? "Ajouté aux favoris" : "Retiré des favoris",
        description: updatedScan.favorite
          ? "Le scan a été ajouté à vos favoris"
          : "Le scan a été retiré de vos favoris",
      })
    }
  }

  const handleDeleteScan = (id: string) => {
    const success = deleteScan(id)
    if (success) {
      // Mettre à jour la liste des favoris
      const allScans = getScans()
      const favoriteScans = allScans.filter((scan) => scan.favorite)
      setScans(favoriteScans)

      toast({
        title: "Supprimé",
        description: "Le scan a été supprimé de votre historique",
      })
    }
  }

  const filteredScans = scans.filter(
    (scan) =>
      scan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return `Aujourd'hui, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
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
        <h1 className="text-lg font-semibold">Mes favoris</h1>
      </header>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans les favoris..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredScans.length > 0 ? (
              filteredScans.map((scan) => (
                <motion.div
                  key={scan.id}
                  className="border border-gray-800 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {scan.title}
                        <Star className="h-4 w-4 ml-2 text-yellow-400 fill-yellow-400" />
                      </h3>
                      <p className="text-sm text-gray-400">{formatDate(scan.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleFavorite(scan)}>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="sr-only">Retirer des favoris</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteScan(scan.id)}>
                        <Trash2 className="h-4 w-4 text-gray-400" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/scan/${scan.id}`)}>
                        Voir
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">{searchTerm ? "Aucun résultat trouvé" : "Aucun scan dans vos favoris"}</p>
                <Button className="mt-4 gradient-button">
                  <Link href="/scanner">Scanner un code</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full px-4 pb-4">
        <div className="gradient-button rounded-full p-1 flex">
          <Link href="/historique" className="flex-1 py-2 text-center text-white rounded-full hover:bg-white/10">
            Mon historique
          </Link>
          <Link href="/favoris" className="flex-1 py-2 text-center text-white bg-white/20 rounded-full">
            Mes favoris
          </Link>
        </div>
      </div>
    </motion.main>
  )
}
