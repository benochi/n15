import { NextRequest, NextResponse } from "next/server";
import { PaymentData, PaymentSchema } from "@/schemas/PaymentSchema";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia", // Ensure this matches your Stripe account version
});

export async function POST(request: NextRequest){
  try {
    const body = await request.json()
    const parsedData: PaymentData = PaymentSchema.parse(body)
    console.log(parsedData) //Handle this as you see fit.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsedData.amount,
      currency: parsedData.currency || "usd", 
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  }catch(error) {
    console.error("Internal Error: ", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500}
    )

  }
}