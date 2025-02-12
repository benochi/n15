import { NextResponse } from "next/server";
import formData from 'form-data';
import Mailgun from "mailgun.js";
import { EmailData } from "@/types/email";
import { errorResponse } from "@/utils/errorResponse";

const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!
})

const DOMAIN = process.env.MAILGUN_DOMAIN!;


export async function POST(req: Request) {
  const emailData: EmailData = await req.json(); 
  try {
    const response = await mailgunClient.messages.create(DOMAIN, {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      text: emailData.text
    });

    return NextResponse.json({
      message: 'Email sent successfully',
      response: response,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return errorResponse("Failed to send email", 500);
  }
}