"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Scan, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { getScans, type Scan as ScanType } from "@/lib/local-storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ComparaisonPage() {
  const [scan1, setScan1] = useState<ScanType | null>(null)
  const [scan2, setScan2] = useState<ScanType | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const scans = getScans()

  const handleSelectScan1 = (id: string) => {
    const selectedScan = scans.find((scan) => scan.id === id) || null
    setScan1(selectedScan)
  }

  const handleSelectScan2 = (id: string) => {
    const selectedScan = scans.find((scan) => scan.id === id) || null
    setScan2(selectedScan)
  }

  const clearScan1 = () => {
    setScan1(null)
  }

  const clearScan2 = () => {
    setScan2(null)
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

  const getDifferences = () => {
    if (!scan1 || !scan2) return null

    const differences = []

    if (scan1.type !== scan2.type) {
      differences.push("Type de QR code différent")
    }

    if (scan1.content !== scan2.content) {
      differences.push("Contenu différent")
    }

    return differences
  }

  const differences = getDifferences()

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
        <h1 className="text-lg font-semibold">Comparer des QR codes</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Sélectionnez deux QR codes à comparer</h2>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Premier QR code</label>
                {scan1 && (
                  <Button variant="ghost" size="sm" onClick={clearScan1}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select onValueChange={handleSelectScan1} value={scan1?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un QR code" />
                </SelectTrigger>
                <SelectContent>
                  {scans.map((scan) => (
                    <SelectItem key={scan.id} value={scan.id}>
                      {scan.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Second QR code</label>
                {scan2 && (
                  <Button variant="ghost" size="sm" onClick={clearScan2}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Select onValueChange={handleSelectScan2} value={scan2?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un QR code" />
                </SelectTrigger>
                <SelectContent>
                  {scans.map((scan) => (
                    <SelectItem key={scan.id} value={scan.id}>
                      {scan.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {scan1 && scan2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{scan1.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-gray-400">Type: {scan1.type}</p>
                    <p className="text-xs text-gray-400">Date: {formatDate(scan1.created_at)}</p>
                    <div className="bg-white/5 rounded-lg p-2 mt-2">
                      <p className="text-xs break-words">{scan1.content}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{scan2.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-gray-400">Type: {scan2.type}</p>
                    <p className="text-xs text-gray-400">Date: {formatDate(scan2.created_at)}</p>
                    <div className="bg-white/5 rounded-lg p-2 mt-2">
                      <p className="text-xs break-words">{scan2.content}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Résultat de la comparaison</CardTitle>
                </CardHeader>
                <CardContent>
                  {differences && differences.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-red-400">Différences détectées:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {differences.map((diff, index) => (
                          <li key={index} className="text-sm">
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-green-400">Les QR codes sont identiques</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(!scan1 || !scan2) && scans.length > 0 && (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">Sélectionnez deux QR codes pour les comparer</p>
              <Scan className="h-16 w-16 mx-auto text-gray-500 opacity-50" />
            </div>
          )}

          {scans.length < 2 && (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">
                Vous avez besoin d'au moins deux QR codes scannés pour utiliser cette fonctionnalité
              </p>
              <Button className="gradient-button">
                <Link href="/scanner">Scanner un code</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  )
}
