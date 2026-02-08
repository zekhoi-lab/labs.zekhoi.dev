import { LoginForm } from "@/components/login-form";

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Login",
  description: "Secure access to developer utilities and configuration settings.",
  robots: {
    index: false, // Don't index login page
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginForm />;
}
