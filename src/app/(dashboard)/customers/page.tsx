"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

import { DataTable } from "@/modules/customers/components/data-table"
import { getColumns } from "@/modules/customers/components/columns"
import { CustomerDetailSheet } from "@/modules/customers/components/customer-detail-sheet"
import { CustomerFormSheet } from "@/modules/customers/components/customer-form-sheet"

import {
  getRegisterUsers,
  createRegisterUser,
  updateRegisterUser,
  deleteRegisterUser,
} from "@/modules/customers/services/register-user-services"
import type { RegisterUser } from "@/modules/customers/services/types/register-user-types"

export default function CustomerPage() {
  const [users, setUsers] = useState<RegisterUser[]>([])
  const [loading, setLoading] = useState(true)

  // Sheet states
  const [detailUser, setDetailUser] = useState<RegisterUser | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [formUser, setFormUser] = useState<RegisterUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const list = await getRegisterUsers()
        setUsers(list)
      } catch (error) {
        console.error("Failed to load users:", error)
        toast.error("Không thể tải dữ liệu khách hàng.")
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleAdd = async (newUser: RegisterUser) => {
    try {
      await createRegisterUser({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        message: newUser.message,
        registeredAt: new Date().toISOString(),
      })
      setUsers((prev) => [newUser, ...prev])
      setFormOpen(false)
      toast.success(`Đã thêm khách hàng "${newUser.name}".`)
    } catch (error) {
      console.error("Failed to create user:", error)
      toast.error("Không thể thêm khách hàng. Vui lòng thử lại.")
    }
  }

  const handleEdit = async (updatedUser: RegisterUser) => {
    try {
      await updateRegisterUser(updatedUser)
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      setFormOpen(false)
      setFormUser(null)
      toast.success(`Đã cập nhật khách hàng "${updatedUser.name}".`)
    } catch (error) {
      console.error("Failed to update user:", error)
      toast.error("Không thể cập nhật khách hàng. Vui lòng thử lại.")
    }
  }

  const handleDelete = async (userToDelete: RegisterUser) => {
    try {
      await deleteRegisterUser(userToDelete.id)
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
      toast.success(`Đã xóa khách hàng "${userToDelete.name}".`)
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast.error("Không thể xóa khách hàng. Vui lòng thử lại.")
    }
  }

  const columns = getColumns({
    onView: (user) => {
      setDetailUser(user)
      setDetailOpen(true)
    },
    onEdit: (user) => {
      setFormUser(user)
      setFormOpen(true)
    },
    onDelete: handleDelete,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Đang tải khách hàng...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Khách hàng tư vấn</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin khách hàng đăng ký tư vấn. Xem, thêm, sửa và xóa hồ sơ.
        </p>
      </div>

      <div className="px-4 md:px-6 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng</CardTitle>
            <CardDescription>
              Hiển thị {users.length} khách hàng từ collection <code>register_users</code> trong Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={columns}
              onAdd={() => {
                setFormUser(null)
                setFormOpen(true)
              }}
              onView={(user) => {
                setDetailUser(user)
                setDetailOpen(true)
              }}
              onEdit={(user) => {
                setFormUser(user)
                setFormOpen(true)
              }}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detail Sheet */}
      <CustomerDetailSheet
        user={detailUser}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Add/Edit Form Sheet */}
      <CustomerFormSheet
        user={formUser}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setFormUser(null)
        }}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />
    </>
  )
}