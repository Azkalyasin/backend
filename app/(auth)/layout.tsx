import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Pokemon World",
  description: "Sign in or register for Pokemon World",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="">
      <div className="">
        {children}
      </div>
    </div>
  );
}