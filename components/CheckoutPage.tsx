'use client'
import {useEffect, useState} from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { CheckoutPageProps } from "@/schemas/CheckoutPage";
import { useForm, Controller } from "react-hook-form";

export default function CheckoutPage({amount} :{ amount: number}) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false);
  
  return (
    <div>
    
    </div>
  )  

}