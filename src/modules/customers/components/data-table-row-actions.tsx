"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { RegisterUser } from "@/modules/customers/services/types/register-user-types"

interface DataTableRowActionsProps {
  row: Row<RegisterUser>
  onView?: (user: RegisterUser) => void
  onEdit?: (user: RegisterUser) => void
  onDelete?: (user: RegisterUser) => void
}

export function DataTableRowActions({
  row,
  onView,
  onEdit,
  onDelete,
}: DataTableRowActionsProps) {
  const user = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
        >
          <MoreHorizontal />
          <span className="sr-only">Mở menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onView?.(user)}
        >
          <Eye className="mr-2 size-4" />Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onEdit?.(user)}
        >
          <Pencil className="mr-2 size-4" />Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 size-4" />Xóa
              </DropdownMenuItem>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn xóa khách hàng{" "}
                <span className="font-semibold text-foreground">{user.name}</span> không?
                Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => onDelete?.(user)}
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}