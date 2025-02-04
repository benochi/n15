import { z } from "zod";

const userSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["user","admin"]).default("user"),
})