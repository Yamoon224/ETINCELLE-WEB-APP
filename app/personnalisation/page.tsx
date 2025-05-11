"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

const themeColors = [
  { name: "Rouge", value: "red", primary: "#FF3D00", secondary: "#FF267E" },
  { name: "Bleu", value: "blue", primary: "#0070F3", secondary: "#00C8FF" },
  { name: "Vert", value: "green", primary: "#10B981", secondary: "#34D399" },
  { name: "Violet", value: "purple", primary: "#8B5CF6", secondary: "#C084FC" },
  { name: "Orange", value: "orange", primary: "#F97316", secondary: "#FDBA74" },
]

export default function PersonnalisationPage() {
  const [selectedTheme, setSelectedTheme] = useState("red")
  const [scannerSize, setScannerSize] = useState(64)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setSaving(true)

    try {
      // Simuler la sauvegarde des préférences
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de personnalisation ont été enregistrées",
      })
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des préférences:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
        <h1 className="text-lg font-semibold">Personnalisation</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Thème de couleur</h2>
            <RadioGroup value={selectedTheme} onValueChange={setSelectedTheme} className="grid grid-cols-2 gap-2">
              {themeColors.map((color) => (
                <div key={color.value} className="relative">
                  <RadioGroupItem value={color.value} id={`color-${color.value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`color-${color.value}`}
                    className="flex flex-col items-center justify-center rounded-md border-2 border-gray-800 bg-black/20 p-4 hover:bg-black/30 hover:border-gray-700 peer-data-[state=checked]:border-white peer-data-[state=checked]:bg-black/40"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div
                        className="w-8 h-8 rounded-full mr-2"
                        style={{ background: `linear-gradient(90deg, ${color.primary} 0%, ${color.secondary} 100%)` }}
                      ></div>
                      <span>{color.name}</span>
                    </div>
                    <div
                      className="w-full h-6 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color.primary} 0%, ${color.secondary} 100%)` }}
                    ></div>
                    {selectedTheme === color.value && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                        <Check className="h-3 w-3 text-black" />
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-medium">Taille du scanner</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Petit</span>
                <span className="text-sm">Grand</span>
              </div>
              <Slider
                value={[scannerSize]}
                min={48}
                max={80}
                step={4}
                onValueChange={(value) => setScannerSize(value[0])}
              />
              <div className="flex justify-center mt-4">
                <div
                  className="border-4 border-white/70 rounded-lg relative"
                  style={{ width: `${scannerSize * 4}px`, height: `${scannerSize * 4}px` }}
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -translate-x-2 -translate-y-2"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white translate-x-2 -translate-y-2"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -translate-x-2 translate-y-2"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white translate-x-2 translate-y-2"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="text-lg font-medium">Retour sensoriel</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="haptic-toggle">Vibration lors du scan</Label>
                <Switch id="haptic-toggle" checked={hapticFeedback} onCheckedChange={setHapticFeedback} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-toggle">Sons lors du scan</Label>
                <Switch id="sound-toggle" checked={soundEffects} onCheckedChange={setSoundEffects} />
              </div>
            </div>
          </div>

          <Button className="w-full gradient-button mt-6" onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Enregistrement...
              </span>
            ) : (
              "Enregistrer les préférences"
            )}
          </Button>
        </div>
      </div>
    </motion.main>
  )
}
