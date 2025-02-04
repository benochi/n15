import { z } from "zod";

export const querySchema = z.object({
  page: z.string().optional(), // The page number for pagination (default: 1)
  limit: z.string().optional(), // The number of items per page (default: 10)
  search: z.string().optional(), // Search term for filtering results
  sort: z.enum(["asc", "desc"]).optional(), // Sorting order: "asc" for ascending, "desc" for descending
  fields: z.string().optional(), // Comma-separated list of fields to include in response (e.g., "name,email")
  filter: z.string().optional(), // Key-value pair for filtering results (e.g., "role=admin")
  startDate: z.string().optional(), // Filter results from a specific start date (ISO 8601 format)
  endDate: z.string().optional(), // Filter results up to a specific end date (ISO 8601 format)
  status: z.string().optional(), // Filter by status (e.g., "active", "pending", "banned")
  includeCount: z.enum(["true", "false"]).optional(), // Whether to return total count for pagination (as a string input)
});
