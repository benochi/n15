import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { querySchema } from "../../../../../schemas/QuerySchema";
import { errorResponse } from "@/utils/errorResponse";

export async function GET(req: Request): Promise<NextResponse> {
  await dbConnect();

  // Authenticate user
  const authenticatedUser = await currentUser();
  if (!authenticatedUser || !authenticatedUser.id) return errorResponse("Unauthorized", 401);

  // Fetch user from MongoDB
  const user: IUser | null = await User.findOne({ clerkId: authenticatedUser.id }).select("role");
  if (!user) return errorResponse("User not found", 404);

  // Restrict to admin only
  if (user.role !== "admin") return errorResponse("Forbidden: Admins only", 403);

  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const parsedQuery = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsedQuery.success) return errorResponse(parsedQuery.error.format(), 400);

  const queryData = parsedQuery.data;
  const query: Record<string, any> = {};

  if (queryData.search && queryData.searchField) {
    query[queryData.searchField] = new RegExp(queryData.search, "i");
  }

  if (queryData.filter) {
    const [key, value] = queryData.filter.split("=");
    if (key && value) query[key] = value;
  }

  try {
    let usersQuery = User.find(query)
      .sort({ createdAt: queryData.sort === "asc" ? 1 : -1 })
      .limit(parseInt(queryData.limit ?? "10"))
      .skip((parseInt(queryData.page ?? "1") - 1) * parseInt(queryData.limit ?? "10"));

    if (queryData.fields) {
      usersQuery = usersQuery.select(queryData.fields.split(",").join(" "));
    } else {
      usersQuery = usersQuery.select("-__v");
    }

    const users = await usersQuery;
    let totalCount: number | undefined;

    if (queryData.includeCount === "true") {
      totalCount = await User.countDocuments(query);
    }

    return NextResponse.json({ users, totalCount });
  } catch (error) {
    return errorResponse("Failed to fetch users", 500);
  }
}
