"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import type { RegisterUser } from "@/modules/customers/services/types/register-user-types"
import { DataTableRowActions } from "./data-table-row-actions"

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

interface ColumnsConfig {
  onView?: (user: RegisterUser) => void
  onEdit?: (user: RegisterUser) => void
  onDelete?: (user: RegisterUser) => void
}

export function getColumns(config?: ColumnsConfig): ColumnDef<RegisterUser>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "stt",
      header: "STT",
      cell: ({ row }) => (
        <span className="font-medium text-center block w-8">
          {row.index + 1}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Họ tên",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("email")}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "SĐT",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("phone")}</span>
      ),
    },
    {
      accessorKey: "registeredAt",
      header: "Ngày đăng ký",
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.getValue("registeredAt"))}</span>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={config?.onView}
          onEdit={config?.onEdit}
          onDelete={config?.onDelete}
        />
      ),
    },
  ]
}
