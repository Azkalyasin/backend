"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/sign-out");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button 
      onClick={handleSignOut}
      variant="destructive"
      className="bg-red-500 hover:bg-red-600 text-white"
    >
      Sign Out
    </Button>
  );
}