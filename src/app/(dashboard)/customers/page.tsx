"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CustomerStatCards } from "@/modules/customers/components/customer-stat-cards"
import { DataTable } from "@/modules/customers/components/data-table"
import { EditCustomerModal } from "@/modules/customers/components/edit-customer-modal"
import { getColumns } from "@/modules/customers/components/columns"
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/modules/customers/services/customer-services"
import type { Customer } from "@/modules/customers/services/types/customer-types"

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const list = await getCustomers()
        setCustomers(list)
      } catch (error) {
        console.error("Failed to load customers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const handleAddCustomer = async (newCustomer: Customer) => {
    try {
      await createCustomer({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        status: newCustomer.status,
        source: newCustomer.source,
        address: newCustomer.address,
        notes: newCustomer.notes,
        totalSpent: newCustomer.totalSpent,
        lastContact: newCustomer.lastContact,
        createdAt: newCustomer.createdAt,
      })
      setCustomers((prev) => [newCustomer, ...prev])
      toast.success(`Đã thêm khách hàng "${newCustomer.name}" vào Firestore.`)
    } catch (error) {
      console.error("Failed to create customer:", error)
      toast.error("Không thể thêm khách hàng. Vui lòng thử lại.")
    }
  }

  const handleEditCustomer = async (updatedCustomer: Customer) => {
    try {
      await updateCustomer(updatedCustomer)
      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      )
      setEditingCustomer(null)
      toast.success(`Đã cập nhật khách hàng "${updatedCustomer.name}".`)
    } catch (error) {
      console.error("Failed to update customer:", error)
      toast.error("Không thể cập nhật khách hàng. Vui lòng thử lại.")
    }
  }

  const handleDeleteCustomer = async (customerToDelete: Customer) => {
    try {
      await deleteCustomer(customerToDelete.id)
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id))
      toast.success(`Đã xóa khách hàng "${customerToDelete.name}" khỏi Firestore.`)
    } catch (error) {
      console.error("Failed to delete customer:", error)
      toast.error("Không thể xóa khách hàng. Vui lòng thử lại.")
    }
  }

  const columns = getColumns({ onEdit: setEditingCustomer, onDelete: handleDeleteCustomer })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Đang tải khách hàng...</div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Khách hàng</h1>
        <p className="text-muted-foreground">
          Quản lý và chăm sóc khách hàng. Theo dõi thông tin, trạng thái và doanh thu.
        </p>
      </div>

      {/* Mobile view */}
      <div className="md:hidden px-4 md:px-6">
        <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/20">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Quản lý khách hàng</h3>
            <p className="text-muted-foreground">
              Vui lòng sử dụng màn hình lớn hơn để xem đầy đủ.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden h-full flex-1 flex-col space-y-6 px-4 md:px-6 md:flex">
        {/* Stat Cards */}
        <CustomerStatCards customers={customers} />

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>
              Xem, lọc và quản lý tất cả khách hàng tại đây.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={customers}
              columns={columns}
              onAddCustomer={handleAddCustomer}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onEditCustomer={handleEditCustomer}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingCustomer(null)
          }}
        />
      )}
    </>
  )
}
