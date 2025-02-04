import { NextResponse } from "next/server"
import dbConnect from "@/app/lib/dbConnect"
import User from "@/app/models/User"
import { auth } from "@clerk/nextjs";
import { z } from "zod";


export async function GET(){
  await dbConnect();
  try {
    const users
  } catch (error){

  }
}