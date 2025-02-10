import { NextResponse } from "next/server"
import dbConnect from "@/app/lib/dbConnect"
import User from "@/app/models/User"
import { currentUser } from "@clerk/nextjs/server";
import { userSchema, userIdSchema } from "../../schemas/UserSchema";
import { querySchema } from "../../schemas/QuerySchema"
import { z } from "zod";
import { errorResponse } from "@/app/utils/errorResponse";
import { error } from "console";

//GET all users
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  // Parse query parameters (handle different structure of URLSearchParams)
  const parsedQuery = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsedQuery.success) return errorResponse(parsedQuery.error.format(), 400);

  // Dynamically extract only provided fields from query
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
    let totalCount = undefined;

    if (queryData.includeCount === "true") {
      totalCount = await User.countDocuments(query);
    }

    return NextResponse.json({ users, totalCount });
  } catch (error) {
    return errorResponse("Failed to fetch users", 500);
  }
}

// POST: Register a new user (Clerk Integrated)
export async function POST(req: Request) {
  await dbConnect();

  // Get the authenticated user from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) return errorResponse("Unauthorized", 401);

  try {
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ clerkId: clerkUser.id });
    if (existingUser) return errorResponse("User already exists", 400);

    // Prepare user data (email is already verified by Clerk)
    const newUserData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress, // Clerk ensures unique emails
      name: clerkUser.firstName || "Unnamed",
      role: "user", // Default role
    };

    // Validate with Zod
    const parsedBody = userSchema.safeParse(newUserData);
    if (!parsedBody.success) return errorResponse(parsedBody.error.format(), 400);

    // Create user in MongoDB
    const newUser = await User.create(parsedBody.data);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return errorResponse("Failed to register user", 500);
  }
}

// PATCH: Update a user - Users can update themselves, Admins can update any user
export async function PATCH(req: Request) {
  await dbConnect();

  // Authenticate user with Clerk
  const authenticatedUser = await currentUser();
  if (!authenticatedUser) return errorResponse("Unauthorized", 401);
  const authenticatedUserId = authenticatedUser.id;

  try {
    const body = await req.json();
    const parsedBody = userSchema.partial().safeParse(body); // Allow partial updates

    if (!parsedBody.success) return errorResponse(parsedBody.error.format(), 400);

    const { clerkId, ...updateFields } = parsedBody.data; // Use clerkId instead of userId

    // Find the authenticated user in MongoDB
    const authenticatedUserRecord = await User.findOne({ clerkId: authenticatedUserId });
    if (!authenticatedUserRecord) return errorResponse("Authenticated user not found", 404);

    // Ensure only the user themselves or an admin can update
    if (authenticatedUserRecord.role !== "admin" && authenticatedUserRecord.clerkId !== clerkId) {
      return errorResponse("Forbidden: You can only update your own profile", 403);
    }

    // Perform update
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return errorResponse("User not found", 404);

    return NextResponse.json(updatedUser);
  } catch (error) {
    return errorResponse("Failed to update user", 500);
  }
}

// Delete a user - admins can delete any, users can only delete themselves. 
export async function DELETE(req: Request){
  await dbConnect()

  //authenticate user with Clerk
  const authenticatedUser = await currentUser();
  if (!authenticatedUser) return errorResponse("Unauthorized", 401);
  const authenticatedUserId = authenticatedUser.id;

  try {
    const body = await req.json()
    const parsedBody = userIdSchema.safeParse(body);
    if(!parsedBody.success) return errorResponse(parsedBody.error.format(), 400)

    const {userId} = parsedBody.data;
    const authenticatedUser = await User.findOne({ clerkId: authenticatedUserId })

    if (!authenticatedUser) return errorResponse("User not found", 404);

    const userToDelete = await User.findOne({ clerkId: userId });
    if (!userToDelete) return errorResponse("User to delete not found", 404);

    if (authenticatedUser.role !== "admin" && authenticatedUser.clerkId !== userId) {
      return errorResponse("Forbidden: You can only delete your own account", 403);
    }

    await User.deleteOne({ clerkId: userId });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch(error) {
    return errorResponse("Failed to delete user", 500)
  }
}