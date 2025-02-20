'use client'
import CheckoutPage from '@/components/CheckoutPage';
import convertToSubcurrency from "@/utils/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined.")
}  
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Stripe(){
  //hardcoded for testing
  const amount = 4.99
  return(
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Stripe Payment Page</h1>
        <p className="text-lg text-center text-gray-600 mb-6">User has requested a payment of <span className="font-semibold text-blue-600">${amount}</span></p>
        <div className="text-center">
          <Elements  //Must wrap the checkOut page to handle stripe
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount), //will convert dollars to cents stripe uses cents
              currency: "usd",
            }}
          >
            <CheckoutPage amount={amount} /> 
          </Elements>
        </div>
      </div>
    </div>
  )
}