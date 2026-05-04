"use client"

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { RegisterUser } from "./types/register-user-types"

export async function getRegisterUsers(): Promise<RegisterUser[]> {
  const snapshot = await getDocs(collection(db, "register_users"))
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    const registeredAt = data.registeredAt
      ? typeof data.registeredAt === "object" && "toDate" in data.registeredAt
        ? (data.registeredAt as { toDate: () => Date }).toDate().toISOString()
        : String(data.registeredAt)
      : new Date().toISOString()
    return {
      id: data.id ?? docSnap.id,
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      message: data.message ?? "",
      registeredAt,
    } as RegisterUser
  })
}

export async function createRegisterUser(data: Omit<RegisterUser, "id">): Promise<RegisterUser> {
  const docRef = await addDoc(collection(db, "register_users"), {
    ...data,
    registeredAt: new Date().toISOString(),
  })
  return { ...data, id: docRef.id }
}

export async function updateRegisterUser(user: RegisterUser): Promise<void> {
  const docRef = doc(db, "register_users", user.id)
  await updateDoc(docRef, {
    name: user.name,
    email: user.email,
    phone: user.phone,
    message: user.message,
  })
}

export async function deleteRegisterUser(userId: string): Promise<void> {
  const docRef = doc(db, "register_users", userId)
  await deleteDoc(docRef)
}