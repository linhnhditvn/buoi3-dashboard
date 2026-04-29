import { z } from "zod"

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  status: z.string(),
  source: z.string(),
  address: z.string(),
  notes: z.string().optional(),
  totalSpent: z.number(),
  lastContact: z.string(),
  createdAt: z.string(),
})

export type Customer = z.infer<typeof customerSchema>
