import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const getMongoUri = (): string => {
  switch (process.env.NODE_ENV) {
    case "test":
      return process.env.MONGODB_URI_TEST || "";
    case "production":
      return process.env.MONGODB_URI_PROD || "";
    default:
      return process.env.MONGODB_URI_DEV || "";
  }
};

const MONGODB_URI = getMongoUri();

if (!MONGODB_URI) {
  throw new Error(`Please define the appropriate MongoDB URI for the current environment: ${process.env.NODE_ENV}`);
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const globalForMongoose = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };

globalForMongoose.mongooseCache = globalForMongoose.mongooseCache || { conn: null, promise: null };

const cached = globalForMongoose.mongooseCache;

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new database connection for", process.env.NODE_ENV);
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "boilerplate" }).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  cached.conn = await cached.promise;

  if (!cached.conn.db) {
    throw new Error("Database connection does not contain a valid database object");
  }

  console.log("Connected to database:", cached.conn.db.databaseName);
  return cached.conn;
}

export default dbConnect;
