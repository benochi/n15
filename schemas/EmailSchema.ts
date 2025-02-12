import { z } from 'zod';

export const emailSchema = z.object({
  to: z.string().email("Invalid email address").min(1, "To address is required"),
  from: z.string().email("Invalid email address").min(1, "From address is required"),
  subject: z.string().min(1, "Subject is required"),
  text: z.string().min(1, "Text is required")
});

export type EmailData = z.infer<typeof emailSchema>;
