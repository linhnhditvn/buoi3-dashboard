import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore"

import { db } from "@/lib/firebase/client"
import type { Customer } from "./types/customer-types"

export async function getCustomers(): Promise<Customer[]> {
  const snapshot = await getDocs(collection(db, "customers"))
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Customer
    return { ...data, id: data.id ?? docSnap.id }
  })
}

export function getCustomerStats(customers: Customer[]) {
  const total = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent ?? 0), 0)

  return {
    total,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.status === "vip").length,
    leads: customers.filter((c) => c.status === "lead").length,
    prospects: customers.filter((c) => c.status === "prospect").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    totalRevenue,
  }
}

export async function createCustomer(customer: Customer): Promise<Customer> {
  const docRef = doc(db, "customers", customer.id)
  await setDoc(docRef, customer)
  return customer
}

export async function updateCustomer(customer: Customer): Promise<void> {
  const docRef = doc(db, "customers", customer.id)
  await updateDoc(docRef, { ...customer })
}

export async function deleteCustomer(customerId: string): Promise<void> {
  const docRef = doc(db, "customers", customerId)
  await deleteDoc(docRef)
}
