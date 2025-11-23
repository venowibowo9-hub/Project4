"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RollUsage } from "./dashboard"
import { toast } from "sonner"
import { Save, RefreshCw, X } from "lucide-react"

const formSchema = z.object({
  lot: z.string().min(1, "Lot number is required"),
  supplier: z.string().min(1, "Supplier is required"),
  mesin: z.string().min(1, "Machine is required"),
  counter: z.coerce.number().min(0, "Counter must be a positive number"),
  startTime: z.string().min(1, "Start time is required"),
})

type FormValues = z.infer<typeof formSchema>

interface UsageFormProps {
  onSave: (data: FormValues) => void
  editingRecord?: RollUsage
  onCancelEdit: () => void
}

export function UsageForm({ onSave, editingRecord, onCancelEdit }: UsageFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lot: "",
      supplier: "",
      mesin: "",
      counter: 0,
      startTime: new Date().toISOString().slice(0, 16), // Current datetime-local format
    },
  })

  useEffect(() => {
    if (editingRecord) {
      form.reset({
        lot: editingRecord.lot,
        supplier: editingRecord.supplier,
        mesin: editingRecord.mesin,
        counter: editingRecord.counter,
        startTime: editingRecord.startTime,
      })
    }
  }, [editingRecord, form])

  const onSubmit = (data: FormValues) => {
    onSave(data)
    if (!editingRecord) {
      form.reset({
        lot: "",
        supplier: "",
        mesin: "",
        counter: 0,
        startTime: new Date().toISOString().slice(0, 16),
      })
      toast.success("Data berhasil disimpan")
    } else {
      toast.success("Data berhasil diperbarui")
    }
  }

  return (
    <Card className="border-t-4 border-t-amber-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          {editingRecord ? (
            <>
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <span className="text-base sm:text-xl">Edit Catatan</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5 text-amber-800" />
              <span className="text-base sm:text-xl">Input Penggunaan</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="lot" className="text-sm sm:text-base">
              Nomor Lot
            </Label>
            <Input
              id="lot"
              placeholder="Contoh: L-12345"
              className="text-base h-11 sm:h-10"
              {...form.register("lot")}
            />
            {form.formState.errors.lot && <p className="text-sm text-red-500">{form.formState.errors.lot.message}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="supplier" className="text-sm sm:text-base">
              Supplier
            </Label>
            <Input
              id="supplier"
              placeholder="Masukkan nama supplier"
              className="text-base h-11 sm:h-10"
              {...form.register("supplier")}
            />
            {form.formState.errors.supplier && (
              <p className="text-sm text-red-500">{form.formState.errors.supplier.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="mesin" className="text-sm sm:text-base">
              Mesin
            </Label>
            <Input
              id="mesin"
              placeholder="Masukkan nama mesin"
              className="text-base h-11 sm:h-10"
              {...form.register("mesin")}
            />
            {form.formState.errors.mesin && (
              <p className="text-sm text-red-500">{form.formState.errors.mesin.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="counter" className="text-sm sm:text-base">
              Counter
            </Label>
            <Input id="counter" type="number" className="text-base h-11 sm:h-10" {...form.register("counter")} />
            {form.formState.errors.counter && (
              <p className="text-sm text-red-500">{form.formState.errors.counter.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="startTime" className="text-sm sm:text-base">
              Waktu Mulai
            </Label>
            <Input
              id="startTime"
              type="datetime-local"
              className="text-base h-11 sm:h-10"
              {...form.register("startTime")}
            />
            {form.formState.errors.startTime && (
              <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
            )}
          </div>

          <div className="pt-4 flex gap-2">
            <Button
              type="submit"
              className={`flex-1 h-12 text-base ${editingRecord ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-800 hover:bg-amber-900"}`}
            >
              {editingRecord ? "Update Catatan" : "Simpan Catatan"}
            </Button>

            {editingRecord && (
              <Button
                type="button"
                variant="outline"
                className="h-12 px-4 bg-transparent"
                onClick={() => {
                  onCancelEdit()
                  form.reset({
                    lot: "",
                    supplier: "",
                    mesin: "",
                    counter: 0,
                    startTime: new Date().toISOString().slice(0, 16),
                  })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
