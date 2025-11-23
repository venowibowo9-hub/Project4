"use client"

import { useMemo, useState } from "react"
import type { RollUsage } from "./dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { startOfDay, startOfWeek, startOfMonth, format, parseISO } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface UsageChartProps {
  data: RollUsage[]
}

const generateSupplierColors = (suppliers: string[]) => {
  const colors = [
    "#dc2626", // red-600
    "#2563eb", // blue-600
    "#d97706", // amber-600
    "#059669", // emerald-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
    "#0891b2", // cyan-600
    "#65a30d", // lime-600
    "#c026d3", // fuchsia-600
    "#ea580c", // orange-600
  ]

  const colorMap: Record<string, string> = {}
  suppliers.forEach((supplier, index) => {
    colorMap[supplier] = colors[index % colors.length]
  })
  return colorMap
}

export function UsageChart({ data }: UsageChartProps) {
  const [activeTab, setActiveTab] = useState("supplier")

  const supplierData = useMemo(() => {
    const supplierCounts: Record<string, number> = {}

    data.forEach((item) => {
      supplierCounts[item.supplier] = (supplierCounts[item.supplier] || 0) + item.counter
    })

    const suppliers = Object.keys(supplierCounts).sort()
    const colorMap = generateSupplierColors(suppliers)

    return Object.entries(supplierCounts)
      .map(([name, value]) => ({
        name,
        value,
        color: colorMap[name],
      }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const dailyData = useMemo(() => {
    const dailyMap: Record<string, Record<string, number>> = {}
    const suppliers = new Set<string>()

    data.forEach((item) => {
      const date = format(startOfDay(parseISO(item.startTime)), "dd MMM", { locale: localeId })
      suppliers.add(item.supplier)

      if (!dailyMap[date]) {
        dailyMap[date] = {}
      }
      dailyMap[date][item.supplier] = (dailyMap[date][item.supplier] || 0) + item.counter
    })

    const sortedDates = Object.keys(dailyMap).sort((a, b) => {
      const dateA = data.find(
        (item) => format(startOfDay(parseISO(item.startTime)), "dd MMM", { locale: localeId }) === a,
      )?.startTime
      const dateB = data.find(
        (item) => format(startOfDay(parseISO(item.startTime)), "dd MMM", { locale: localeId }) === b,
      )?.startTime
      return new Date(dateA!).getTime() - new Date(dateB!).getTime()
    })

    const supplierArray = Array.from(suppliers).sort()
    const colorMap = generateSupplierColors(supplierArray)

    return {
      data: sortedDates.map((date) => ({
        date,
        ...dailyMap[date],
      })),
      suppliers: supplierArray,
      colorMap,
    }
  }, [data])

  const weeklyData = useMemo(() => {
    const weeklyMap: Record<string, Record<string, number>> = {}
    const suppliers = new Set<string>()

    data.forEach((item) => {
      const week = format(startOfWeek(parseISO(item.startTime), { weekStartsOn: 1 }), "dd MMM", { locale: localeId })
      suppliers.add(item.supplier)

      if (!weeklyMap[week]) {
        weeklyMap[week] = {}
      }
      weeklyMap[week][item.supplier] = (weeklyMap[week][item.supplier] || 0) + item.counter
    })

    const sortedWeeks = Object.keys(weeklyMap).sort((a, b) => {
      const weekA = data.find(
        (item) =>
          format(startOfWeek(parseISO(item.startTime), { weekStartsOn: 1 }), "dd MMM", { locale: localeId }) === a,
      )?.startTime
      const weekB = data.find(
        (item) =>
          format(startOfWeek(parseISO(item.startTime), { weekStartsOn: 1 }), "dd MMM", { locale: localeId }) === b,
      )?.startTime
      return new Date(weekA!).getTime() - new Date(weekB!).getTime()
    })

    const supplierArray = Array.from(suppliers).sort()
    const colorMap = generateSupplierColors(supplierArray)

    return {
      data: sortedWeeks.map((week) => ({
        week,
        ...weeklyMap[week],
      })),
      suppliers: supplierArray,
      colorMap,
    }
  }, [data])

  const monthlyData = useMemo(() => {
    const monthlyMap: Record<string, Record<string, number>> = {}
    const suppliers = new Set<string>()

    data.forEach((item) => {
      const month = format(startOfMonth(parseISO(item.startTime)), "MMM yyyy", { locale: localeId })
      suppliers.add(item.supplier)

      if (!monthlyMap[month]) {
        monthlyMap[month] = {}
      }
      monthlyMap[month][item.supplier] = (monthlyMap[month][item.supplier] || 0) + item.counter
    })

    const sortedMonths = Object.keys(monthlyMap).sort((a, b) => {
      const monthA = data.find(
        (item) => format(startOfMonth(parseISO(item.startTime)), "MMM yyyy", { locale: localeId }) === a,
      )?.startTime
      const monthB = data.find(
        (item) => format(startOfMonth(parseISO(item.startTime)), "MMM yyyy", { locale: localeId }) === b,
      )?.startTime
      return new Date(monthA!).getTime() - new Date(monthB!).getTime()
    })

    const supplierArray = Array.from(suppliers).sort()
    const colorMap = generateSupplierColors(supplierArray)

    return {
      data: sortedMonths.map((month) => ({
        month,
        ...monthlyMap[month],
      })),
      suppliers: supplierArray,
      colorMap,
    }
  }, [data])

  if (data.length === 0) return null

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Analisa Penggunaan</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
            <TabsTrigger value="daily">Harian</TabsTrigger>
            <TabsTrigger value="weekly">Mingguan</TabsTrigger>
            <TabsTrigger value="monthly">Bulanan</TabsTrigger>
          </TabsList>

          <TabsContent value="supplier" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Total Counter" radius={[4, 4, 0, 0]}>
                    {supplierData.map((entry, index) => (
                      <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend />
                  {dailyData.suppliers.map((supplier) => (
                    <Bar
                      key={supplier}
                      dataKey={supplier}
                      fill={dailyData.colorMap[supplier]}
                      radius={[4, 4, 0, 0]}
                      name={supplier}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="week" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend />
                  {weeklyData.suppliers.map((supplier) => (
                    <Bar
                      key={supplier}
                      dataKey={supplier}
                      fill={weeklyData.colorMap[supplier]}
                      radius={[4, 4, 0, 0]}
                      name={supplier}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend />
                  {monthlyData.suppliers.map((supplier) => (
                    <Bar
                      key={supplier}
                      dataKey={supplier}
                      fill={monthlyData.colorMap[supplier]}
                      radius={[4, 4, 0, 0]}
                      name={supplier}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
