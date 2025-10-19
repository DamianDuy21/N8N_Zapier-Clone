"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  return <Button onClick={handleLogout}>Log out</Button>;
};

export default LogoutButton;
