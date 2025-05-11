"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, HelpCircle, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { clearScans } from "@/lib/local-storage"

export default function SettingsPage() {
  const [clearingHistory, setClearingHistory] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const clearHistory = async () => {
    setClearingHistory(true)

    try {
      // Effacer l'historique
      clearScans()

      toast({
        title: "Historique effacé",
        description: "Votre historique de scans a été effacé",
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de l'historique:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'effacer l'historique",
        variant: "destructive",
      })
    } finally {
      setClearingHistory(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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
        <h1 className="text-lg font-semibold">Paramètres</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Apparence</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="theme-toggle">Mode sombre</Label>
              </div>
              <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-medium">Scanner</h2>
            <div className="flex items-center justify-between">
              <Label htmlFor="beep-toggle">Son lors du scan</Label>
              <Switch id="beep-toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="vibration-toggle">Vibration lors du scan</Label>
              <Switch id="vibration-toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-open-toggle">Ouvrir automatiquement les liens</Label>
              <Switch id="auto-open-toggle" />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-medium">Données</h2>
            <Button variant="destructive" className="w-full" onClick={clearHistory} disabled={clearingHistory}>
              {clearingHistory ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Suppression...
                </span>
              ) : (
                "Effacer l'historique"
              )}
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-medium">Support</h2>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white"
              onClick={() => router.push("/aide")}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Aide et support
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white"
              onClick={() => router.push("/tutoriel")}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Tutoriel
            </Button>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-medium">À propos</h2>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium mb-1">Etincelle</h3>
              <p className="text-sm text-gray-400">Version 1.0.0</p>
              <p className="text-sm text-gray-400 mt-2">Une application de scan de QR code simple et efficace.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
