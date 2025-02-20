import axios from "axios";
import { EmailData, EmailResponse } from "@/types/email";

export const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
  try {
    const response = await axios.post('/api/mailgun', emailData);

    if (!response.data) {
      throw new Error("Failed to send email.");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error sending email: ' + error.message);
    }
    throw new Error('An unknown error occurred while sending email');
  }
};
