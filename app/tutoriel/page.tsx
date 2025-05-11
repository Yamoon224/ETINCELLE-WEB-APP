"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const tutorialSteps = [
  {
    title: "Bienvenue sur Etincelle",
    description: "L'application qui vous permet de scanner et générer des QR codes facilement.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "Scanner un QR code",
    description: "Appuyez sur 'Scanner un code' pour utiliser votre caméra et scanner n'importe quel QR code.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "Historique des scans",
    description: "Retrouvez tous vos scans précédents dans l'historique et marquez vos favoris.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "Générer des QR codes",
    description: "Créez vos propres QR codes pour des liens, du texte, des contacts ou des réseaux WiFi.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    title: "C'est parti !",
    description: "Vous êtes prêt à utiliser Etincelle. Commencez dès maintenant !",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function TutorielPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isLastStep = currentStep === tutorialSteps.length - 1

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col"
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Précédent</span>
        </Button>
        <div className="flex gap-1">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full ${
                index === currentStep ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-gray-700"
              }`}
            ></div>
          ))}
        </div>
        {!isLastStep ? (
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(tutorialSteps.length - 1)}>
            Passer
          </Button>
        ) : (
          <div className="w-16"></div> // Pour maintenir l'alignement
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md flex flex-col items-center text-center"
          >
            <img
              src={tutorialSteps[currentStep].image || "/placeholder.svg"}
              alt={tutorialSteps[currentStep].title}
              className="w-48 h-48 mb-8 rounded-lg"
            />
            <h2 className="text-2xl font-bold mb-4">{tutorialSteps[currentStep].title}</h2>
            <p className="text-gray-400 mb-8">{tutorialSteps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6">
        {isLastStep ? (
          <Link href="/">
            <Button className="w-full gradient-button py-6">Commencer à utiliser Etincelle</Button>
          </Link>
        ) : (
          <Button className="w-full gradient-button py-6" onClick={nextStep}>
            Suivant
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </motion.main>
  )
}
