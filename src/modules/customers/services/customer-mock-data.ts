import { customerSchema } from "./types/customer-types"

import customersData from "./data/customers.json"

export const customerMockData = customerSchema.array().parse(customersData)

export const statuses = [
  { value: "active", label: "Active", color: "text-green-600" },
  { value: "inactive", label: "Inactive", color: "text-gray-500" },
  { value: "lead", label: "Lead", color: "text-blue-600" },
  { value: "prospect", label: "Prospect", color: "text-orange-600" },
  { value: "vip", label: "VIP", color: "text-purple-600" },
]

export const sources = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "advertisement", label: "Advertisement" },
  { value: "partner", label: "Partner" },
  { value: "other", label: "Other" },
]
