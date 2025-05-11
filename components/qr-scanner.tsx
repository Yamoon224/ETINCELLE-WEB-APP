"use client"

import { useEffect, useRef, useState } from "react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (result: string) => void
  onError?: (error: string) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let animationFrameId: number

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.addEventListener("loadedmetadata", () => {
            setScanning(true)
            scanQRCode()
          })
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        if (onError) onError("Impossible d'accéder à la caméra")
      }
    }

    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current || !scanning) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      // Définir la taille du canvas pour correspondre à la vidéo
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Dessiner l'image vidéo sur le canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Obtenir les données d'image du canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Analyser l'image pour trouver un code QR
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code) {
        // Code QR trouvé
        onScan(code.data)
        setScanning(false)
      } else {
        // Continuer à scanner
        animationFrameId = requestAnimationFrame(scanQRCode)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [onScan, onError, scanning])

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
