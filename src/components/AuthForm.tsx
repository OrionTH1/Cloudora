"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  createEmailAuthAccount,
  createOAuthAccount,
} from "@/lib/actions/user.actions";
import OTPModal from "./OPTModal";
import { useRouter } from "next/navigation";
type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
    remember: z.boolean(),
  });
};

function AuthForm({ type }: { type: FormType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      remember: true,
    },
  });
  const {
    setError,
    clearErrors,
    formState: { errors: errorMessage },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    clearErrors();

    try {
      const user = await createEmailAuthAccount(
        values.fullName || "",
        values.email
      );

      setAccountId(user.accountId);
    } catch (error) {
      setError("root", { message: "Something went wrong, please try again." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    clearErrors();

    try {
      const OAuthURL = await createOAuthAccount();

      if (OAuthURL) {
        router.push(OAuthURL);
      }
      // setAccountId(user.accountId);
    } catch (error) {
      setError("root", { message: "Something went wrong, please try again." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Login" : "Create Account"}
          </h1>
          <div className="flex flex-col gap-[18px]">
            {type == "sign-up" && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="form-submit-button"
              disabled={isLoading}
            >
              {type === "sign-in" ? "Sign In" : "Sign Up"}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader icon"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>

            <Button
              type="button"
              className="secondary-btn"
              disabled={isLoading}
              onClick={handleGoogleAuth}
            >
              <Image
                src="assets/icons/google-icon.svg"
                width={24}
                height={24}
                alt="Google Icon"
              />
              {(type === "sign-in" ? "Sign In" : "Sign Up") + " with Google"}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader icon"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>
          </div>
          {errorMessage.root && (
            <p className="error-message">*{errorMessage.root?.message}</p>
          )}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
}

export default AuthForm;
