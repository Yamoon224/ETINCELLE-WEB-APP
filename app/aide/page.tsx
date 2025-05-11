"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, HelpCircle, Mail, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AidePage() {
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
        <h1 className="text-lg font-semibold">Aide et support</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Besoin d'aide ?</h2>
            <p className="text-gray-400 mb-6">
              Consultez notre FAQ ci-dessous ou contactez-nous si vous avez besoin d'assistance supplémentaire.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-white/20 text-white">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Questions fréquentes</h3>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comment scanner un QR code ?</AccordionTrigger>
                <AccordionContent>
                  Pour scanner un QR code, appuyez sur le bouton "Scanner un code" sur l'écran d'accueil. Pointez votre
                  caméra vers le QR code et maintenez-le dans le cadre jusqu'à ce qu'il soit détecté. Le résultat
                  s'affichera automatiquement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Comment générer mon propre QR code ?</AccordionTrigger>
                <AccordionContent>
                  Appuyez sur l'icône "+" en haut à droite de l'écran d'accueil ou accédez à la section "Générer" depuis
                  la barre de navigation. Choisissez le type de QR code que vous souhaitez créer (URL, texte, WiFi,
                  contact), remplissez les informations nécessaires et appuyez sur "Générer le QR code".
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Comment enregistrer ou partager un QR code généré ?</AccordionTrigger>
                <AccordionContent>
                  Après avoir généré un QR code, vous verrez des boutons "Télécharger" et "Partager" sous l'image du QR
                  code. Appuyez sur "Télécharger" pour sauvegarder l'image sur votre appareil ou sur "Partager" pour
                  l'envoyer via d'autres applications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Comment activer la torche pendant le scan ?</AccordionTrigger>
                <AccordionContent>
                  Lorsque vous êtes sur l'écran de scan, appuyez sur l'icône de torche en haut à droite pour activer ou
                  désactiver la lampe de votre appareil. Cette fonctionnalité est utile pour scanner des QR codes dans
                  des environnements peu éclairés.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Comment supprimer mon historique de scans ?</AccordionTrigger>
                <AccordionContent>
                  Vous pouvez supprimer des scans individuels en allant dans l'historique et en appuyant sur l'icône de
                  corbeille à côté du scan que vous souhaitez supprimer. Pour effacer tout l'historique, allez dans
                  "Paramètres" puis appuyez sur "Effacer l'historique".
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>L'application fonctionne-t-elle hors ligne ?</AccordionTrigger>
                <AccordionContent>
                  Oui, Etincelle peut scanner et générer des QR codes sans connexion internet. Cependant, si le QR code
                  contient un lien web, vous aurez besoin d'une connexion internet pour ouvrir ce lien.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <Link href="/tutoriel">
              <Button className="w-full gradient-button">
                <HelpCircle className="mr-2 h-4 w-4" />
                Voir le tutoriel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
