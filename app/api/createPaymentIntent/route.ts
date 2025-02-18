import { NextRequest } from "next/server";
import { PaymentData, PaymentSchema } from "@/schemas/PaymentSchema";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export async function POST(request: NextRequest){
  try {
    const body = await request.json()
    const parsedData: PaymentData = PaymentSchema.parse(body)
    console.log(parsedData) //Handle this as you see fit.
  }catch(error) {
    
  }
}