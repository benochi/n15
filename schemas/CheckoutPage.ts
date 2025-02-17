import { z } from "zod";

export const CheckoutPageSchema = z.object({
  amount: z.number().positive("Amount must be a positive number."),
  clientSecret: z.string(),
});

export type CheckoutPageProps = z.infer<typeof CheckoutPageSchema>;