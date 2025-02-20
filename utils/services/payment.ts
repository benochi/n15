import axios from "axios";
import { CheckoutPageProps, CheckoutPageSchema } from "@/schemas/CheckoutPage";
import { PaymentSchema, PaymentData } from "@/schemas/PaymentSchema";

export const createPaymentIntent = async (paymentData:PaymentData):Promise<CheckoutPageProps | null> => {
  try {
    const parsedData = PaymentSchema.safeParse(paymentData);
    if (!parsedData.success) {
      console.error("Invalid Payment Data:", parsedData.error.format());
      return null;
    }
    const response = await axios.post("/api/createPaymentIntent", parsedData.data);
    console.log("API Response:", response.data);

    const parsedResponse = CheckoutPageSchema.safeParse(response.data)
    if(!parsedResponse.success){
      console.error("invalid Api response: ", parsedResponse.error.format())
      return null;
    }

    return parsedResponse.data
  } catch(error) {
    console.error("API request failed", error)
    return null;
  }
}