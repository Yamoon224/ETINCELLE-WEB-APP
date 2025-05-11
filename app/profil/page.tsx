"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { getProfile, updateProfile } from "@/lib/local-storage"

export default function ProfilePage() {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { user, signOut, status } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Charger le profil depuis localStorage
    const profile = getProfile()
    if (profile) {
      setUsername(profile.username || "")
      setFullName(profile.full_name || "")
    }
  }, [])

  // Rediriger si non connecté
  if (status === "unauthenticated") {
    router.push("/login")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      updateProfile({
        username,
        full_name: fullName,
      })

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées",
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col">
        <header className="flex items-center p-4 border-b border-gray-800">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Mon profil</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Mon profil</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.image || ""} alt={user?.name || "Utilisateur"} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-500">
                <User className="h-12 w-12 text-white" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user?.name || user?.email}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                placeholder="Nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full gradient-button" disabled={saving}>
              {saving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Enregistrement...
                </span>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-800">
            <Button variant="outline" className="w-full border-white/20 text-white" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
