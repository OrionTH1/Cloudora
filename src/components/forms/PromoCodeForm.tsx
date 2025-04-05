"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PromoCodeFormSchema = z.object({
  promoCode: z.string().refine(() => false, "Invalid Promo Code"),
});

function PromoCodeForm() {
  const form = useForm<z.infer<typeof PromoCodeFormSchema>>({
    resolver: zodResolver(PromoCodeFormSchema),
    defaultValues: { promoCode: "" },
  });

  const handleFormSubmit = () => {};

  return (
    <Form {...form}>
      <form
        className="flex items-end gap-2"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <FormField
          name="promoCode"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex items-end gap-2">
                <div className="w-full">
                  <FormLabel className="body-2 text-white">
                    Promo Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="promo-code"
                      placeholder="Enter the Promo Code"
                      className="shad-no-focus body-2 rounded bg-white text-light-100 placeholder:text-light-200"
                      {...field}
                    />
                  </FormControl>
                </div>
                <Button
                  type="submit"
                  className="w-[150px] rounded bg-white text-xs text-light-100 transition-all hover:bg-light-400"
                >
                  Apply
                </Button>
              </div>
              <FormMessage className="shad-form-message" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default PromoCodeForm;
