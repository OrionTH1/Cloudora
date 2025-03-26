"use client";

import { verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function OAuthSign({ secret, userId }: { userId: string; secret: string }) {
  const router = useRouter();
  useEffect(() => {
    const handleOAuth = async () => {
      await verifySecret(userId as string, secret as string);
      router.push("/");
    };

    handleOAuth();
  }, [secret, userId, router]);
  return <div></div>;
}

export default OAuthSign;
