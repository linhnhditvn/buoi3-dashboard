"use client"

import { ArrowUp, Users, Star, UserPlus, TrendingUp, UserX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

import type { Customer } from "@/modules/customers/services/types/customer-types"

interface CustomerStatCardsProps {
  customers: Customer[]
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} tỷ`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} tr`
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)
}

export function CustomerStatCards({ customers }: CustomerStatCardsProps) {
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.status === "vip").length,
    leads: customers.filter((c) => c.status === "lead" || c.status === "prospect").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent ?? 0), 0),
  }

  const activeRate = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {/* Total Customers */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Tổng KH</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.total}</span>
                <span className="flex items-center gap-0.5 text-sm text-green-500">
                  <ArrowUp className="size-3.5" />
                  {activeRate}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <Users className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Đang hoạt động</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.active}</span>
                <span className="flex items-center gap-0.5 text-sm text-green-500">
                  <ArrowUp className="size-3.5" />
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <TrendingUp className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">VIP</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.vip}</span>
                <span className="flex items-center gap-0.5 text-sm text-purple-500">
                  <ArrowUp className="size-3.5" />
                  {stats.total > 0 ? Math.round((stats.vip / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <Star className="size-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads & Prospects */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Tiềm năng</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.leads}</span>
                <span className="flex items-center gap-0.5 text-sm text-blue-500">
                  <ArrowUp className="size-3.5" />
                  {stats.total > 0 ? Math.round((stats.leads / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <UserPlus className="size-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Không hoạt động</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.inactive}</span>
                <span className="flex items-center gap-0.5 text-sm text-orange-500">
                  <ArrowUp className="size-3.5" />
                  {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <UserX className="size-6 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Tổng doanh thu</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <TrendingUp className="size-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
