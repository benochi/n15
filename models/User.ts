import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string; //if using clerk
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type:String, enum: ["user","admin"], default: "user"},
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>("User",UserSchema)
