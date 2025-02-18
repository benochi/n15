import { z } from "zod";

export const PaymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required."),
  paymentMethodId: z.string().min(1, "Payment method ID is required"),
  userId: z.string().min(1, "User ID is required"),
})

export type PaymentData = z.infer<typeof PaymentSchema>;