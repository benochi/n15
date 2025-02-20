import { z } from "zod";

export const CheckoutPageSchema = z.object({
  id: z.string(), // Unique Payment Intent ID
  object: z.literal("payment_intent"), // Stripe always returns this value
  amount: z.number().positive("Amount must be a positive number."),
  client_secret: z.string(),
  status: z.enum([
    "requires_payment_method",
    "requires_confirmation",
    "requires_action",
    "processing",
    "requires_capture",
    "canceled",
    "succeeded",
  ]), 
  payment_method: z.string().nullable(), // Can be null
  capture_method: z.enum(["automatic", "manual"]),
});

export type CheckoutPageProps = z.infer<typeof CheckoutPageSchema>;
