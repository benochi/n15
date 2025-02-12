'use client';
import { useState } from 'react';
import { EmailData } from '@/types/email';
import { useMutation } from '@tanstack/react-query';
import { sendEmail } from '@/utils/mailgun/api';

export default function EmailForm() {
  const [emailData, setEmailData] = useState<EmailData>({
    to: '',
    from: '',
    subject: '',
    text: ''
  });

  const { mutate: sendEmailMutation, status, isError, isSuccess, error } = useMutation({
    mutationFn: () => sendEmail(emailData),
    onError: (err) => console.error(err),
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailMutation();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 border border-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Send an Email</h2>

        <div className="mb-4">
          <input
            type="email"
            name="to"
            placeholder="To"
            value={emailData.to}
            onChange={handleChange}
            required
            className="w-full p-2 border border-black rounded-md mb-2"
          />
          <input
            type="email"
            name="from"
            placeholder="From"
            value={emailData.from}
            onChange={handleChange}
            required
            className="w-full p-2 border border-black rounded-md mb-2"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={emailData.subject}
            onChange={handleChange}
            required
            className="w-full p-2 border border-black rounded-md mb-2"
          />
          <textarea
            name="text"
            placeholder="Email content"
            value={emailData.text}
            onChange={handleChange}
            required
            className="w-full p-2 border border-black rounded-md mb-4"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'pending'}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {status === 'pending' ? 'Sending...' : 'Send Email'}
        </button>

        {isError && <p className="mt-4 text-red-500">{error?.message}</p>}
        {isSuccess && <p className="mt-4 text-green-500">Email sent successfully!</p>}
      </form>
    </div>
  );
}