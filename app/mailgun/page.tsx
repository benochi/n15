import EmailForm from '@/components/EmailForm';

export default function MailgunPage() {
  return (
    <div className="p-4">
      <h1 className="text-center text-3xl font-semibold mb-6">Sample page with Email form using Mailgun</h1>
      <EmailForm />
    </div>
  );
}
