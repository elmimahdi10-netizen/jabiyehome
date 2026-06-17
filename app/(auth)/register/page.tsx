import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your free Jabiyehome account.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
