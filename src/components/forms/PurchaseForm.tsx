"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { applyUserPlan } from "@/lib/actions/plans.actions";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const validadeCreditCardNumber = (creditCardNumber: string) => {
  const formatedValue = creditCardNumber.replace(/\s/g, "");
  let lastEvenElement = null;
  let lastOddElement = null;
  let firstMath = 0;
  let secondMath = 0;

  for (let index = formatedValue.length; index > 0; index--) {
    const element = Number(formatedValue[index - 1]);
    const isEven = index % 2 === 0 ? true : false;

    if (isEven) {
      const nextElement = Number(formatedValue[index - 3]) || 0;

      if (lastEvenElement === index - 1) continue;
      lastEvenElement = index - 3;

      firstMath += element + nextElement;
    }

    if (!isEven) {
      const nextElement = Number(formatedValue[index - 3]) || 0;

      if (lastOddElement === index - 1) continue;
      lastOddElement = index - 3;

      const firstElementToSum = String(element * 2);
      const secondElementToSum = String(nextElement * 2);

      const elementToSum = (firstElementToSum + secondElementToSum).split("");

      elementToSum.reduce(
        (_, current) => (secondMath += Number(current)),
        secondMath
      );
    }
  }
  const result = firstMath + secondMath;

  return result % 10 === 0 ? true : false;
};

const puchaseFormSchema = z.object({
  creditCardNumber: z
    .string()
    .min(19, "Enter a valid credit card number (16 digits).")
    .refine(
      (value) => validadeCreditCardNumber(value),
      "This credit card number is not valid."
    ),

  expirationDate: z
    .string()
    .nonempty("The expiration date is required.")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)")
    .refine((value) => {
      const [month, year] = value.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100; // Pegamos os dois últimos dígitos do ano
      const currentMonth = new Date().getMonth() + 1;

      return (
        year > currentYear || (year === currentYear && month >= currentMonth)
      );
    }, "This Credit Card has already expired."),

  creditCardVerificationNumber: z
    .string()
    .nonempty("The security code (CVV) is required.")
    .min(3, "The CVV must be 3 or 4 digits long.")
    .max(4, "The CVV must be 3 or 4 digits long."),
});

const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const formatVerificationNumber = (value: string) => {
  return value.replace(/\D/g, "").trim();
};

const formatExpirationDate = (value: string) => {
  let date = value.replace(/\D/g, "");
  if (date.length > 2) date = `${date.slice(0, 2)}/${date.slice(2, 4)}`;
  return date;
};
function PurchaseForm({
  planType,
  userId,
}: {
  planType: string;
  userId: string;
}) {
  const form = useForm<z.infer<typeof puchaseFormSchema>>({
    resolver: zodResolver(puchaseFormSchema),
    defaultValues: {
      creditCardVerificationNumber: "",
      creditCardNumber: "",
      expirationDate: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleForm = async () => {
    setIsLoading(true);
    const userUpdated = await applyUserPlan(userId, planType);
    if (userUpdated) redirect(`/order/${planType}/finished`);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form className="" onSubmit={form.handleSubmit(handleForm)}>
        <FormField
          control={form.control}
          name="creditCardNumber"
          render={({ field }) => (
            <FormItem className="mb-6">
              <div className="shad-form-item">
                <FormLabel className="shad-form-label">
                  Credit Card Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Credit Card Number"
                    className="shad-input"
                    {...field}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\s/g, "");

                      if (rawValue.length > 16) return;

                      field.onChange(formatCardNumber(rawValue));
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />

        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    Expiration Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
                      className="shad-input"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length > 5) return;
                        field.onChange(formatExpirationDate(value));
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditCardVerificationNumber"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">CVV</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your CVV"
                      className="shad-input"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length > 4) return;
                        field.onChange(formatVerificationNumber(value));
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="shad-submit-btn mt-6"
          disabled={isLoading}
        >
          Finish Payment
          {isLoading && (
            <Image
              src="/assets/icons/loader.svg"
              alt="loader icon"
              width={16}
              height={16}
              className="ml-2 animate-spin"
            />
          )}
        </Button>
      </form>
    </Form>
  );
}

export default PurchaseForm;
