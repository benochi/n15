import { z } from "zod";

export const userSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["user","admin"]).default("user"),
})

export const userIdSchema = z.object({
  userId: z.string(),
});