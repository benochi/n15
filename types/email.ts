export interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
}

export interface EmailResponse {
  message: string;
  status: number;
}