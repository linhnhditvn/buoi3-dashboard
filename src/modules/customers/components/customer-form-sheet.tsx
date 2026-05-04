"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { RegisterUser } from "@/modules/customers/services/types/register-user-types"

interface CustomerFormSheetProps {
  user?: RegisterUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (user: RegisterUser) => void
  onEdit?: (user: RegisterUser) => void
}

export function CustomerFormSheet({
  user,
  open,
  onOpenChange,
  onAdd,
  onEdit,
}: CustomerFormSheetProps) {
  const isEditing = !!user
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (user) {
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone)
        setMessage(user.message ?? "")
      } else {
        setName("")
        setEmail("")
        setPhone("")
        setMessage("")
      }
      setErrors({})
    }
  }, [open, user])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Họ tên là bắt buộc"
    if (!email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ"
    }
    if (!phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    setSubmitting(true)
    try {
      if (isEditing && user) {
        const updated: RegisterUser = {
          ...user,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }
        onEdit?.(updated)
      } else {
        const newUser: RegisterUser = {
          id: `reg_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          registeredAt: new Date().toISOString(),
        }
        onAdd?.(newUser)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="form-name">
              Họ tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="form-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="form-phone">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-phone"
              placeholder="0912-345-678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="form-message">Lời nhắn</Label>
            <Textarea
              id="form-message"
              placeholder="Nội dung tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="flex-1 cursor-pointer"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {isEditing ? "Lưu thay đổi" : "Thêm khách hàng"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}