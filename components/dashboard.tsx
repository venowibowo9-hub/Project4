"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { WelcomeOverlay } from "@/components/welcome-overlay"
import { UsageForm } from "@/components/usage-form"
import { UsageTable } from "@/components/usage-table"
import { UsageChart } from "@/components/usage-chart"
import { Toaster } from "sonner"

export type RollUsage = {
  id: string
  lot: string
  supplier: string
  mesin: string
  counter: number
  startTime: string
}

export function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [data, setData] = useState<RollUsage[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // Load data from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("rollUsageData")
    if (savedData) {
      try {
        setData(JSON.parse(savedData))
      } catch (e) {
        console.error("Failed to parse data", e)
      }
    }

    // Check if welcome screen has been shown this session
    const welcomeShown = sessionStorage.getItem("welcomeShown")
    if (welcomeShown) {
      setShowWelcome(false)
    }
  }, [])

  // Save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("rollUsageData", JSON.stringify(data))
  }, [data])

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    sessionStorage.setItem("welcomeShown", "true")
  }

  const handleSave = (record: Omit<RollUsage, "id">) => {
    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? { ...record, id: editingId } : item)))
      setEditingId(null)
    } else {
      setData([...data, { ...record, id: crypto.randomUUID() }])
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setData(data.filter((item) => item.id !== id))
      if (editingId === id) setEditingId(null)
    }
  }

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.")) {
      setData([])
      setEditingId(null)
      localStorage.removeItem("rollUsageData")
    }
  }

  const handleExport = () => {
    const headers = ["Lot", "Supplier", "Mesin", "Counter", "Waktu Mulai"]
    const csvContent = [
      headers.join(","),
      ...data.map((item) =>
        [item.lot, item.supplier, item.mesin, item.counter, new Date(item.startTime).toLocaleString("id-ID")].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `roll_usage_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      sessionStorage.removeItem("welcomeShown")
      setShowWelcome(true)
      setEditingId(null)
    }
  }

  const editingRecord = data.find((item) => item.id === editingId)

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Toaster position="top-center" />
      {showWelcome && <WelcomeOverlay onClose={handleCloseWelcome} />}

      <Header onLogout={handleLogout} onReset={handleReset} onExport={handleExport} hasData={data.length > 0} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <UsageForm onSave={handleSave} editingRecord={editingRecord} onCancelEdit={() => setEditingId(null)} />
          </div>

          <div className="lg:col-span-9 space-y-6">
            <UsageChart data={data} />
            <UsageTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      </main>
    </div>
  )
}
