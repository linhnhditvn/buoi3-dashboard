"use client"

import type { Table } from "@tanstack/react-table"
import { RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTableViewOptions } from "./data-table-view-options"
import { AddCustomerModal } from "./add-customer-modal"

import { statuses, sources } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAddCustomer?: (customer: Customer) => void
}

export function DataTableToolbar<TData>({
  table,
  onAddCustomer,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const statusFilter = table.getColumn("status")?.getFilterValue() as string | undefined
  const sourceFilter = table.getColumn("source")?.getFilterValue() as string | undefined

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Status Filter */}
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => {
            const column = table.getColumn("status")
            if (value === "all") {
              column?.setFilterValue(undefined)
            } else {
              column?.setFilterValue(value)
            }
          }}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
            {statuses.map((status) => (
              <SelectItem
                key={status.value}
                value={status.value}
                className="cursor-pointer"
              >
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select
          value={sourceFilter || "all"}
          onValueChange={(value) => {
            const column = table.getColumn("source")
            if (value === "all") {
              column?.setFilterValue(undefined)
            } else {
              column?.setFilterValue(value)
            }
          }}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Lọc theo nguồn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">Tất cả nguồn</SelectItem>
            {sources.map((source) => (
              <SelectItem
                key={source.value}
                value={source.value}
                className="cursor-pointer"
              >
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search and Actions Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Tìm kiếm khách hàng..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-[200px] lg:w-[300px] cursor-text"
          />
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="px-3 cursor-pointer"
            disabled={!isFiltered}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:block">Đặt lại</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <DataTableViewOptions table={table} />
          <AddCustomerModal onAddCustomer={onAddCustomer} />
        </div>
      </div>
    </div>
  )
}
