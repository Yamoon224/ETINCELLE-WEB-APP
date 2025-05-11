"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell, ChevronLeft, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Notifications fictives pour la démo
const demoNotifications = [
  {
    id: "1",
    title: "Bienvenue sur Etincelle",
    message: "Merci d'avoir installé Etincelle. Commencez à scanner des QR codes dès maintenant !",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 jours avant
    read: true,
  },
  {
    id: "2",
    title: "Nouveau scan détecté",
    message: "Un nouveau type de QR code a été scanné. Consultez votre historique pour plus de détails.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 heures avant
    read: false,
  },
  {
    id: "3",
    title: "Mise à jour disponible",
    message: "Une nouvelle version d'Etincelle est disponible avec des fonctionnalités améliorées.",
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes avant
    read: false,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée",
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    toast({
      title: "Notifications effacées",
      description: "Toutes les notifications ont été supprimées",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col"
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
            Tout effacer
          </Button>
        )}
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Paramètres de notification</h2>
            <div className="space-y-4 bg-black/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-toggle">Notifications push</Label>
                <Switch id="push-toggle" checked={pushEnabled} onCheckedChange={setPushEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-toggle">Notifications par email</Label>
                <Switch id="email-toggle" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Récentes</h2>
              <span className="text-sm text-gray-400">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </span>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border ${notification.read ? "border-gray-800" : "border-red-500/50"} rounded-lg p-4 relative`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 rounded-full p-1 ${notification.read ? "bg-gray-700" : "bg-red-500"}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatDate(notification.date)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                    {!notification.read && (
                      <div className="absolute top-4 right-12 w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Aucune notification</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.main>
  )
}
