"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, isAuthenticated, setAuthenticated } from "@/lib/local-storage"

type User = {
  id: string
  name: string
  email: string
  image: string | null
} | null

interface AuthContextType {
  user: User
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  googleSignIn: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  googleSignIn: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Vérifier l'authentification au chargement
    if (isAuthenticated()) {
      setUser(getCurrentUser())
      setStatus("authenticated")
    } else {
      setStatus("unauthenticated")
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simuler une connexion (accepte n'importe quelles identifiants)
    setAuthenticated(true)
    setUser(getCurrentUser())
    setStatus("authenticated")
    return true
  }

  const signUp = async (email: string, password: string) => {
    // Simuler une inscription
    setAuthenticated(true)
    setUser(getCurrentUser())
    setStatus("authenticated")
    return true
  }

  const signOut = async () => {
    setAuthenticated(false)
    setUser(null)
    setStatus("unauthenticated")
  }

  const googleSignIn = async () => {
    // Simuler une connexion Google
    setAuthenticated(true)
    setUser({
      id: "user-1",
      name: "Utilisateur Google",
      email: "user@gmail.com",
      image: "https://lh3.googleusercontent.com/a/default-user",
    })
    setStatus("authenticated")
    return true
  }

  return (
    <AuthContext.Provider value={{ user, status, signIn, signUp, signOut, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  )
}
