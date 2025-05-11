"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { getScans } from "@/lib/local-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, History, PlusCircle, BarChart } from "lucide-react"

export default function StatistiquesPage() {
  const [stats, setStats] = useState({
    total: 0,
    favoris: 0,
    types: {} as Record<string, number>,
    recentDays: 0,
  })

  useEffect(() => {
    const scans = getScans()

    // Calculer les statistiques
    const favoris = scans.filter((scan) => scan.favorite).length

    // Compter les types
    const types: Record<string, number> = {}
    scans.forEach((scan) => {
      types[scan.type] = (types[scan.type] || 0) + 1
    })

    // Calculer le nombre de jours avec des scans récents (30 derniers jours)
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const daysWithScans = new Set()
    scans.forEach((scan) => {
      const scanDate = new Date(scan.created_at)
      if (scanDate >= thirtyDaysAgo) {
        daysWithScans.add(scanDate.toDateString())
      }
    })

    setStats({
      total: scans.length,
      favoris,
      types,
      recentDays: daysWithScans.size,
    })
  }, [])

  // Fonction pour obtenir les données du graphique
  const getChartData = () => {
    const scans = getScans()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const counts = last7Days.map((day) => {
      return scans.filter((scan) => scan.created_at.startsWith(day)).length
    })

    return { days: last7Days, counts }
  }

  const { days, counts } = getChartData()
  const maxCount = Math.max(...counts, 1)

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
        <h1 className="text-lg font-semibold">Statistiques</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total des scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Favoris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.favoris}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Jours actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentDays}</div>
                <p className="text-xs text-gray-400">Sur les 30 derniers jours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Type le plus scanné</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {Object.entries(stats.types).sort((a, b) => b[1] - a[1])[0]?.[0] || "Aucun"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité des 7 derniers jours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {counts.map((count, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-red-500 to-pink-500 rounded-t-sm"
                      style={{ height: `${(count / maxCount) * 150}px` }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-400">
                      {new Date(days[index]).toLocaleDateString("fr-FR", { weekday: "short" })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.types).map(([type, count]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{type}</span>
                      <span className="text-sm text-gray-400">{count}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-800 p-2 z-10">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center p-2 text-gray-400">
            <QrCode className="h-6 w-6" />
            <span className="text-xs mt-1">Scanner</span>
          </Link>
          <Link href="/historique" className="flex flex-col items-center p-2 text-gray-400">
            <History className="h-6 w-6" />
            <span className="text-xs mt-1">Historique</span>
          </Link>
          <Link href="/generate-qr" className="flex flex-col items-center p-2 text-gray-400">
            <PlusCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Générer</span>
          </Link>
          <Link href="/statistiques" className="flex flex-col items-center p-2 text-white">
            <BarChart className="h-6 w-6" />
            <span className="text-xs mt-1">Stats</span>
          </Link>
        </div>
      </nav>
    </motion.main>
  )
}
