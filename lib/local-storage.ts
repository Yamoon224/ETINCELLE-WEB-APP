// Types pour les données stockées localement
export interface Scan {
  id: string
  created_at: string
  content: string
  type: string
  title: string
  favorite: boolean
}

export interface UserProfile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

// Fonctions pour manipuler les scans
export const getScans = (): Scan[] => {
  if (typeof window === "undefined") return []

  const scans = localStorage.getItem("etincelle_scans")
  return scans ? JSON.parse(scans) : []
}

export const addScan = (scan: Omit<Scan, "id" | "created_at">): Scan => {
  const scans = getScans()
  const newScan: Scan = {
    ...scan,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }

  localStorage.setItem("etincelle_scans", JSON.stringify([newScan, ...scans]))
  return newScan
}

export const updateScan = (id: string, updates: Partial<Scan>): Scan | null => {
  const scans = getScans()
  const index = scans.findIndex((scan) => scan.id === id)

  if (index === -1) return null

  const updatedScan = { ...scans[index], ...updates }
  scans[index] = updatedScan
  localStorage.setItem("etincelle_scans", JSON.stringify(scans))

  return updatedScan
}

export const deleteScan = (id: string): boolean => {
  const scans = getScans()
  const filteredScans = scans.filter((scan) => scan.id !== id)

  if (filteredScans.length === scans.length) return false

  localStorage.setItem("etincelle_scans", JSON.stringify(filteredScans))
  return true
}

export const clearScans = (): void => {
  localStorage.setItem("etincelle_scans", JSON.stringify([]))
}

// Fonctions pour manipuler le profil utilisateur
export const getProfile = (): UserProfile | null => {
  if (typeof window === "undefined") return null

  const profile = localStorage.getItem("etincelle_profile")
  return profile ? JSON.parse(profile) : null
}

export const updateProfile = (updates: Partial<UserProfile>): UserProfile => {
  const profile = getProfile() || {
    id: "user-1",
    username: null,
    full_name: null,
    avatar_url: null,
  }

  const updatedProfile = { ...profile, ...updates }
  localStorage.setItem("etincelle_profile", JSON.stringify(updatedProfile))

  return updatedProfile
}

// Fonctions pour l'authentification simulée
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("etincelle_authenticated") === "true"
}

export const setAuthenticated = (value: boolean): void => {
  localStorage.setItem("etincelle_authenticated", value ? "true" : "false")
}

export const getCurrentUser = () => {
  if (!isAuthenticated()) return null

  return {
    id: "user-1",
    name: getProfile()?.full_name || "Utilisateur",
    email: "user@example.com",
    image: getProfile()?.avatar_url || null,
  }
}
