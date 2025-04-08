import PromoCodeForm from "@/components/forms/PromoCodeForm";
import PurchaseForm from "@/components/forms/PurchaseForm";
import { Separator } from "@/components/ui/separator";
import { princing } from "@/constants";
import { applyUserPlan } from "@/lib/actions/plans.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { capitalize } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

async function Purchase({ params, searchParams }: SearchParamProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");

  const planType = (await params).plan as string;
  const isBillingAnnualy = (await searchParams)?.isBillingAnnualy as string;
  const plan = princing.find((value) => value.type === planType);
  if (!plan) redirect(`/order?name=${currentUser.fullName}`);

  if (planType === "free") {
    const userUpdated = await applyUserPlan(currentUser.$id, planType);
    if (userUpdated) redirect(`/order/${planType}/finished`);
  }

  return planType === "free" ? (
    <div className="flex h-screen items-center justify-center">
      <Image
        src="/assets/icons/loader.svg"
        alt="loader icon"
        width={124}
        height={124}
        className="animate-spin"
      />
    </div>
  ) : (
    <div className="flex min-h-screen w-screen flex-col md:flex-row ">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div>
          <h1 className="mb-4 text-3xl font-semibold text-light-100">
            Payment
          </h1>
          <PurchaseForm planType={planType} userId={currentUser.$id} />
        </div>
      </main>
      <aside className="flex w-full flex-col justify-center gap-6 bg-brand p-4 text-white md:w-5/12">
        <h1 className="text-3xl font-semibold">Order Sumarry</h1>
        <Separator />
        <PromoCodeForm />
        <Separator />
        <div className="flex items-center justify-between">
          <p>Cloudora - {capitalize(planType)} Plan</p>
          <p>
            {isBillingAnnualy ? (
              <span>
                <span className="line-through">${plan.totalAnnuallPrice}</span>{" "}
                -{plan.annuallyPrice}
              </span>
            ) : (
              plan.monthlyPrice
            )}
            <span className="text-white/20">/monthly</span>
          </p>
        </div>
        <Separator />
        <div className="flex justify-between text-xl font-semibold">
          <h2>Total</h2>
          {isBillingAnnualy ? (
            <p>${plan.totalAnnuallPrice}</p>
          ) : (
            <p>${plan.monthlyPrice}</p>
          )}
        </div>
      </aside>
    </div>
  );
}

export default Purchase;
