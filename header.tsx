"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onLogout: () => void
  onReset: () => void
  onExport: () => void
  hasData: boolean
}

export function Header({ onLogout, onReset, onExport, hasData }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-32">
            <Image src="/images/pt-santos-logo.png" alt="Logo PT Santos Jaya Abadi" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">PT Santos Jaya Abadi</h1>
            <p className="text-xs text-gray-500 font-medium">Roll Usage Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <span className="hidden sm:inline">Menu</span>
                <span className="sm:hidden">☰</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onExport} disabled={!hasData} className="gap-2">
                <Download className="h-4 w-4" />
                Export ke CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReset} disabled={!hasData} className="gap-2 text-orange-600">
                <RotateCcw className="h-4 w-4" />
                Reset Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="gap-2 text-red-600">
                <LogOut className="h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
