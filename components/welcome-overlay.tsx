"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface WelcomeOverlayProps {
  onClose: () => void
}

export function WelcomeOverlay({ onClose }: WelcomeOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay for animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-500 ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}
      >
        <div className="relative h-32 bg-gradient-to-r from-amber-800 to-amber-700 flex items-center justify-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
          <div className="h-24 w-24 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
            <div className="relative h-full w-full">
              <Image src="/images/pt-santos-logo.png" alt="Logo PT Santos Jaya Abadi" fill className="object-contain" />
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
          <p className="text-gray-600 mb-6">
            Aplikasi Monitoring Penggunaan Roll PT Santos Jaya Abadi. Silakan catat dan pantau penggunaan roll produksi
            Anda.
          </p>

          <Button
            onClick={onClose}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Mulai Aplikasi
          </Button>
        </div>
      </div>
    </div>
  )
}
