"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Bell, ChevronDown, History, PlusCircle, QrCode, Settings, Share, Star, User } from "lucide-react"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col"
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#FF3D00" />
            <path d="M12 6L16 10H8L12 6Z" fill="white" />
            <path d="M12 18L8 14H16L12 18Z" fill="white" />
          </svg>
          <h1 className="text-lg font-semibold">Etincelle</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/notifications")}>
            <Bell className="h-5 w-5" />
          </Button>
          {!user ? (
            <Link href="/login" className="text-sm text-gray-300 hover:text-white">
              Log in or create account
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profil")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/parametres")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/personnalisation")}>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Personnalisation</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/partage")}>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Partager l'app</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-neutral-400">
        <div className="relative w-full max-w-md h-[70vh] bg-neutral-400 flex flex-col items-center justify-between">
          <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
              <ChevronDown className="h-5 w-5 text-white" />
              <span className="sr-only">Retour</span>
            </Button>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/20 backdrop-blur-sm"
              onClick={() => router.push("/generate-qr")}
            >
              <PlusCircle className="h-5 w-5 text-white" />
              <span className="sr-only">Générer QR</span>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 w-full">
            <h2 className="text-xl font-medium text-white mb-6">Scan QR Code ici</h2>
            <div className="w-64 h-64 bg-white/90 rounded-lg flex items-center justify-center border-4 border-white relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -translate-x-2 -translate-y-2"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white translate-x-2 -translate-y-2"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -translate-x-2 translate-y-2"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white translate-x-2 translate-y-2"></div>

              <QrCode className="h-24 w-24 text-gray-300" />
            </div>
          </div>

          <div className="w-full px-4 pb-4">
            <div className="gradient-button rounded-full p-1 flex">
              <Link href="/historique" className="flex-1 py-2 text-center text-white rounded-full hover:bg-white/10">
                Mon historique
              </Link>
              <Link href="/scanner" className="flex-1 py-2 text-center text-white bg-white/20 rounded-full">
                Scanner un code
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-800 p-2 z-10">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center p-2 text-white">
            <QrCode className="h-6 w-6" />
            <span className="text-xs mt-1">Scanner</span>
          </Link>
          <Link href="/historique" className="flex flex-col items-center p-2 text-gray-400">
            <History className="h-6 w-6" />
            <span className="text-xs mt-1">Historique</span>
          </Link>
          <Link href="/favoris" className="flex flex-col items-center p-2 text-gray-400">
            <Star className="h-6 w-6" />
            <span className="text-xs mt-1">Favoris</span>
          </Link>
          <Link href="/generate-qr" className="flex flex-col items-center p-2 text-gray-400">
            <PlusCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Générer</span>
          </Link>
        </div>
      </nav>
    </motion.main>
  )
}
