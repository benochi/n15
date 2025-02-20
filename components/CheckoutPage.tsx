'use client'
import {useEffect, useState} from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { PaymentData } from "@/schemas/PaymentSchema";
import { createPaymentIntent } from "@/utils/services/payment";
import { useUser } from "@clerk/nextjs";
import convertToSubcurrency from "@/utils/convertToSubcurrency";

export default function CheckoutPage({amount} :{ amount: number}) {
  const { user } = useUser();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false);

  const paymentData: PaymentData = {
    amount: convertToSubcurrency(amount),
    currency: 'usd',
    paymentMethodId: "pm_card_visa",
    userId: user?.id || "anonymous",  //fetch from auth we're using Clerk in this example
    captureMethod: "automatic",
  }

  const { mutate: fetchPaymentIntent } = useMutation({ //This returns a clientSecret from stripe
    mutationFn: async () =>{
      return await createPaymentIntent(paymentData);
    },
    onSuccess: (data) => {
      if (!data?.client_secret) {
        setErrorMessage("Failed to initialize payment");
        return;
      }
      setClientSecret(data.client_secret);
    },
    onError: (error) => {
      console.error("Payment setup failed:", error);
      setErrorMessage("Failed to initialize payment. Please try again.");
    },
  })

  

  useEffect(()=> {
    if (!amount || amount <= 0) return;
    setLoading(true)

    fetchPaymentIntent();
  }, [amount]);
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {clientSecret && <PaymentElement />}
    </div>
  )  

}