import { seedMockDataCollections } from "@/lib/firebase/mock-data-seeder"

import { customerMockData } from "./customer-mock-data"

export function seedCustomersMockData() {
  return seedMockDataCollections("customers", [
    {
      collectionName: "customers",
      documents: customerMockData,
    },
  ])
}
