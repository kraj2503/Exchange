"use client"
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <>
      Sign- in
      <Button variant="secondary" onClick={() => signOut({ callbackUrl: "http://localhost:3000/api/auth/signin", redirect:true})}>
        Sign Out
      </Button>
    </>
  );
}
