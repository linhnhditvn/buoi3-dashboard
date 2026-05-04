"use client"

import { User } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import type { RegisterUser } from "@/modules/customers/services/types/register-user-types"

interface CustomerDetailSheetProps {
  user: RegisterUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function CustomerDetailSheet({
  user,
  open,
  onOpenChange,
}: CustomerDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chi tiết khách hàng
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {user && (
          <div className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">Họ tên</span>
              <span className="text-base font-semibold">{user.name}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-base">{user.email}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">Số điện thoại</span>
              <span className="text-base">{user.phone}</span>
            </div>

            {user.message && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted-foreground">Lời nhắn</span>
                <span className="text-base">{user.message}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">Ngày đăng ký</span>
              <span className="text-base">{formatDate(user.registeredAt)}</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
