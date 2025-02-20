import { NextRequest, NextResponse } from "next/server";
import { PaymentData, PaymentSchema } from "@/schemas/PaymentSchema";
import { CheckoutPageSchema } from "@/schemas/CheckoutPage";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = PaymentSchema.parse(body);

    console.log("Create Payment Intent Data:", parsedData);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsedData.amount,
      currency: parsedData.currency || "usd",
      payment_method: parsedData.paymentMethodId,
      capture_method: parsedData.captureMethod,
      confirm: false,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Prevents requiring a return_url
      },
    });

    const responseData = {
      id: paymentIntent.id,
      object: paymentIntent.object,
      amount: paymentIntent.amount,
      client_secret: paymentIntent.client_secret,
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method ?? null,
      capture_method: paymentIntent.capture_method,
    };

    console.log("Payment Intent Response:", responseData);

    // Validate response against CheckoutPageSchema before returning
    const parsedResponse = CheckoutPageSchema.safeParse(responseData);
    if (!parsedResponse.success) {
      console.error("Invalid API response:", parsedResponse.error.format());
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
    }

    return NextResponse.json(parsedResponse.data);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      let errorMessage = "An error occurred while processing your payment.";

      switch (error.type) {
        case "StripeCardError":
          errorMessage = "Your card was declined.";
          break;
        case "StripeRateLimitError":
          errorMessage = "Too many requests made to Stripe too quickly.";
          break;
        case "StripeInvalidRequestError":
          errorMessage = "Invalid parameters were supplied.";
          break;
        case "StripeAPIError":
          errorMessage = "An internal error occurred with Stripe.";
          break;
        case "StripeConnectionError":
          errorMessage = "A network error occurred while communicating with Stripe.";
          break;
        case "StripeAuthenticationError":
          errorMessage = "Invalid API key provided.";
          break;
        default:
          errorMessage = "An unexpected Stripe error occurred.";
          break;
      }

      console.error("Stripe Error:", error);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    console.error("Internal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
