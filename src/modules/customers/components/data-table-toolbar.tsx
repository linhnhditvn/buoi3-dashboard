"use client"

import type { Table } from "@tanstack/react-table"
import { RefreshCcw, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import type { RegisterUser } from "@/modules/customers/services/types/register-user-types"

interface DataTableToolbarProps {
  table: Table<RegisterUser>
  onAdd?: () => void
}

export function DataTableToolbar({ table, onAdd }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="pl-9 w-[250px] lg:w-[350px] cursor-text"
          />
        </div>
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="cursor-pointer"
          >
            <RefreshCcw className="h-4 w-4" />
            Đặt lại
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" className="cursor-pointer" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>
    </div>
  )
}