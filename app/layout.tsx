import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "Template App",
  description: "Next.js 15 template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background text-foreground">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton showName/>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
