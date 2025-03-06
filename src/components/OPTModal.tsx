"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

function OTPModal({ accountId, email }: { accountId: string; email: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setisLoading(true);

    try {
      const sessionId = await verifySecret(accountId, password);
      if (sessionId) router.push("/");
    } catch (error) {
      console.error("Failed to verify OTP", error);
    } finally {
      setisLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setisLoading(true);
    try {
      await sendEmailOTP(email);
    } catch (error) {
      console.error("Failed to resend OTP", error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your email OTP code
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-200">
            We&apos;ve sent a code to{" "}
            <span className="text-brand">{email}</span>
          </AlertDialogDescription>
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
              disabled={isLoading}
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader icon"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center text-light-200">
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOtp}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OTPModal;
