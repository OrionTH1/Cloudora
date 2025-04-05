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
import { sendEmailOTP, createSessionSecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function OTPModal({
  accountId,
  setAccountId,
  email,
  name,
}: {
  accountId: string;
  setAccountId: (accountId: string | null) => void;
  email: string;
  name: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setisLoading(true);
    setErrors(null);

    if (!accountId || !email) return;

    try {
      const sessionId = await createSessionSecret(accountId, password, name);

      if (
        sessionId &&
        sessionId.error &&
        sessionId.error.type === "user_invalid_token"
      ) {
        setisLoading(false);
        return setErrors(sessionId.error.message);
      }

      if (sessionId) return router.push("/cloud");

      setErrors("Something went wrong, try again.");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to verify OTP", error);
      setErrors("Something went wrong, try again.");
    }

    setisLoading(false);
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
              onClick={() => {
                setIsOpen(false);
                setAccountId(null);
              }}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-200">
            We&apos;ve sent a code to{" "}
            <span className="text-brand">{email}</span>
          </AlertDialogDescription>
          <InputOTP
            maxLength={6}
            value={password}
            onChange={(value) => setPassword(value.replace(/\D/g, "").trim())}
          >
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
            <div className={cn(errors ? "block" : "hidden")}>
              <p className="shad-form-message text-center">{errors}</p>
            </div>
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
