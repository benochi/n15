import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User, { IUser } from "@/models/User"
import { currentUser } from "@clerk/nextjs/server";
import { userSchema, userIdSchema } from "../../../schemas/UserSchema";
import { errorResponse } from "@/utils/errorResponse";

type RequestWithJSON = Request & {json: () => Promise<any>}

//GET the users data
export async function GET(req: Request): Promise<NextResponse> {
  try {
    await dbConnect();

    // Authenticate user with Clerk
    const authenticatedUser = await currentUser();
    if (!authenticatedUser || !authenticatedUser.id) {
      return errorResponse("Unauthorized", 401);
    }

    const email = authenticatedUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return errorResponse("Email address not found", 400);
    }

    // Find or create the user in MongoDB
    let user: IUser | null = await User.findOne({ clerkId: authenticatedUser.id }).select("-__v");
    if (!user) {
      const newUser = new User({
        clerkId: authenticatedUser.id,
        email: authenticatedUser.emailAddresses[0].emailAddress,
        name: authenticatedUser.firstName || "Unnamed",
        role: "user",
      });

      user = await newUser.save();
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in GET /user:", error);
    return errorResponse("Internal Server Error", 500);
  }
}




// POST: Register a new user we don't need this because of clerk,
// we just need to update info with a patch, but for info sake i left it in.
// export async function POST(req: RequestWithJSON): Promise<NextResponse> {
//   await dbConnect();

//   // Get the authenticated user from Clerk
//   const clerkUser = await currentUser();
//   if (!clerkUser) return errorResponse("Unauthorized", 401);

//   try {
//     // Check if user already exists in MongoDB
//     const existingUser: IUser | null = await User.findOne({ clerkId: clerkUser.id });
//     if (existingUser) return errorResponse("User already exists", 400);

//     // Prepare user data (email is already verified by Clerk)
//     const newUserData: z.infer<typeof userSchema> = {
//       clerkId: clerkUser.id,
//       email: clerkUser.emailAddresses[0].emailAddress, // Clerk ensures unique emails
//       name: clerkUser.firstName || "Unnamed",
//       role: "user", // Default role
//     };

//     // Validate with Zod
//     const parsedBody = userSchema.safeParse(newUserData);
//     if (!parsedBody.success) return errorResponse(parsedBody.error.format(), 400);

//     // Create user in MongoDB
//     const newUser = await User.create(parsedBody.data);

//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error) {
//     return errorResponse("Failed to register user", 500);
//   }
// }

// PATCH: Update a user - Users can update themselves, Admins can update any user
export async function PATCH(req: RequestWithJSON): Promise<NextResponse> {
  try {
    await dbConnect();

    // Authenticate user with Clerk
    const authenticatedUser = await currentUser();
    if (!authenticatedUser || !authenticatedUser.id) return errorResponse("Unauthorized", 401);
    const authenticatedUserId = authenticatedUser.id;

    try {
      const body: unknown = await req.json();
      const parsedBody = userSchema.partial().safeParse(body); // Allow partial updates

      if (!parsedBody.success) return errorResponse(parsedBody.error.format(), 400);

      const updateFields = parsedBody.data;

      if ("clerkId" in updateFields) {
        delete updateFields.clerkId; // Prevent users from modifying their Clerk ID
      }

      // Find the authenticated user in MongoDB
      const authenticatedUserRecord: IUser | null = await User.findOne({ clerkId: authenticatedUserId });
      if (!authenticatedUserRecord) return errorResponse("Authenticated user not found", 404);

      // Ensure only the user themselves or an admin can update
      if (authenticatedUserRecord.role !== "admin" && authenticatedUserRecord.clerkId !== authenticatedUserId) {
        return errorResponse("Forbidden: You can only update your own profile", 403);
      }

      // Perform update
      const updatedUser: IUser | null = await User.findOneAndUpdate(
        { clerkId: authenticatedUserId },
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedUser) return errorResponse("User not found", 404);

      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Parsing/Validation error:", error);
      return errorResponse("Invalid request body", 400);
    }
  } catch (error) {
    console.error("Unexpected error in PATCH /user:", error);
    return errorResponse("Failed to update user", 500);
  }
}


// DELETE a user - admins can delete any, users can only delete themselves.
export async function DELETE(req: RequestWithJSON): Promise<NextResponse> {
  try {
    await dbConnect();

    // Authenticate user with Clerk
    const authenticatedUser = await currentUser();
    if (!authenticatedUser) return errorResponse("Unauthorized", 401);

    const authenticatedUserId = authenticatedUser.id;

    try {
      const body = await req.json() as unknown;
      const parsedBody = userIdSchema.safeParse(body);

      if (!parsedBody.success) {
        console.error("Validation error:", parsedBody.error.format());
        return errorResponse(parsedBody.error.format(), 400);
      }

      const { userId } = parsedBody.data;

      const [authenticatedUserRecord, userToDelete]: (IUser | null)[] = await Promise.all([
        User.findOne({ clerkId: authenticatedUserId }),
        User.findOne({ clerkId: userId }),
      ]);

      if (!authenticatedUserRecord) return errorResponse("User not found", 404);
      if (!userToDelete) return errorResponse("User to delete not found", 404);

      // Ensure only the user themselves or an admin can delete
      if (authenticatedUserRecord.role !== "admin" && authenticatedUserRecord.clerkId !== userId) {
        return errorResponse("Forbidden: You can only delete your own account", 403);
      }

      await User.deleteOne({ clerkId: userId });

      return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Validation/Parsing error:", error);
      return errorResponse("Invalid request body", 400);
    }
  } catch (error) {
    console.error("Unexpected error in DELETE /user:", error);
    return errorResponse("Failed to delete user", 500);
  }
}