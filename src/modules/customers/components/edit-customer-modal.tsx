"use client"

import { useState, useEffect } from "react"
import { Pencil } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { statuses, sources } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"

const customerFormSchema = z.object({
  name: z.string().min(1, "Tên khách hàng là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  status: z.string().min(1, "Trạng thái là bắt buộc"),
  source: z.string().min(1, "Nguồn khách hàng là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  notes: z.string().optional(),
  totalSpent: z.coerce.number().min(0),
  lastContact: z.string(),
  createdAt: z.string(),
})

type CustomerFormData = z.infer<typeof customerFormSchema>

interface EditCustomerModalProps {
  customer: Customer
  onEditCustomer?: (customer: Customer) => void
  /** Controlled open state — for use from page-level state */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EditCustomerModal({
  customer,
  onEditCustomer,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditCustomerModalProps) {
  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen

  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    source: customer.source,
    address: customer.address,
    notes: customer.notes ?? "",
    totalSpent: customer.totalSpent,
    lastContact: customer.lastContact,
    createdAt: customer.createdAt,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when customer changes
  useEffect(() => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      source: customer.source,
      address: customer.address,
      notes: customer.notes ?? "",
      totalSpent: customer.totalSpent,
      lastContact: customer.lastContact,
      createdAt: customer.createdAt,
    })
    setErrors({})
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const validatedData = customerFormSchema.parse(formData)

      const updatedCustomer: Customer = {
        ...customer,
        ...validatedData,
      }

      onEditCustomer?.(updatedCustomer)

      setErrors({})
      onOpenChange?.(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      source: customer.source,
      address: customer.address,
      notes: customer.notes ?? "",
      totalSpent: customer.totalSpent,
      lastContact: customer.lastContact,
      createdAt: customer.createdAt,
    })
    setErrors({})
    onOpenChange?.(false)
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>
        <DialogDescription>
          Cập nhật thông tin khách hàng {customer.name}.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="edit-name">Tên khách hàng *</Label>
          <Input
            id="edit-name"
            placeholder="Nhập tên khách hàng..."
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Điện thoại *</Label>
            <Input
              id="edit-phone"
              placeholder="0912-345-678"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Status & Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-status">Trạng thái *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-source">Nguồn *</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, source: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn nguồn" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source && <p className="text-sm text-red-500">{errors.source}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="edit-address">Địa chỉ *</Label>
          <Input
            id="edit-address"
            placeholder="Số nhà, đường, quận, thành phố..."
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="edit-notes">Ghi chú</Label>
          <Textarea
            id="edit-notes"
            placeholder="Thông tin bổ sung..."
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </div>

        {/* Total Spent */}
        <div className="space-y-2">
          <Label htmlFor="edit-totalSpent">Tổng chi tiêu (VND)</Label>
          <Input
            id="edit-totalSpent"
            type="number"
            min="0"
            placeholder="0"
            value={formData.totalSpent}
            onChange={(e) => setFormData((prev) => ({ ...prev, totalSpent: Number(e.target.value) }))}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} className="cursor-pointer">
            Hủy
          </Button>
          <Button type="submit" className="cursor-pointer">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )

  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Pencil className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}
