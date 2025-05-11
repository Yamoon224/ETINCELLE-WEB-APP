import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Pages qui nécessitent une authentification
  const protectedPaths = ["/profil", "/scan"]

  // Vérifier si l'URL actuelle est une page protégée
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (isProtectedPath && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profil/:path*", "/scan/:path*"],
}
