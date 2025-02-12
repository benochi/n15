import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { describe, it, expect, afterAll } from "vitest";
import dbConnect from "./dbConnect";
import mongoose from "mongoose";

describe("MongoDB Connection", () => {
  it("should establish a successful connection", async () => {
    const connection = await dbConnect();

    // Ensure connection is active
    expect(connection.readyState).toBe(1); // 1 = connected
  });

  it("should have a users collection", async () => {
    const connection = await dbConnect();

    if (!connection.db) {
      throw new Error("Database object is undefined");
    }

    // Check if the "users" collection exists
    const collectionExists = await connection.db.listCollections({ name: "users" }).hasNext();
    expect(collectionExists).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
