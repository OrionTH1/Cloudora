import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

function Plan({
  plan,
  style,
  isBillingAnnualy,
  isSelected,
}: {
  plan: Pricing;
  style: "dark" | "light";
  isBillingAnnualy: boolean;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "flex max-w-[460px] h-[330px] flex-col rounded border-2 p-3",
        style === "light"
          ? "text-white border-white/20"
          : "text-light-100 border-light-100/20"
      )}
      key={plan.name}
    >
      <h2 className="mb-2 text-2xl font-bold">{plan.name}</h2>
      <p className="mb-2 text-sm">
        ${isBillingAnnualy ? plan.annuallyPrice : plan.monthlyPrice}
        <span
          className={cn(
            style === "light" ? "text-white/20" : "text-light-100/20"
          )}
        >
          /{isBillingAnnualy ? "annually" : "monthly"}
        </span>
      </p>
      <p className="h-6 text-sm">{plan.description}</p>
      <Separator
        className={cn(
          "my-auto",
          style === "light" ? "bg-white/20" : "bg-light-100/20"
        )}
      />

      <ul className="mb-5 flex flex-col gap-2">
        {plan.features.map((feature) =>
          feature.avaiable ? (
            <li className="flex items-center gap-1" key={feature.title}>
              <Check size={16} />
              <p className="text-sm">{feature.title}</p>
            </li>
          ) : (
            <li
              className="flex items-center gap-1 opacity-40"
              key={feature.title}
            >
              <X size={16} />
              <p className="text-sm">Can Share files with other users</p>
            </li>
          )
        )}
      </ul>
      {isSelected ? (
        <button
          disabled
          className={cn(
            "w-full rounded !py-3 text-center font-medium",
            style === "light"
              ? "bg-white/60 text-light-100"
              : "bg-brand/60 text-white"
          )}
        >
          Your current plan
        </button>
      ) : (
        <Link
          href={`order/${plan.name.toLowerCase()}?isBillingAnnualy=${isBillingAnnualy}`}
          className={cn(
            "w-full rounded py-3 text-center font-medium",
            style === "light"
              ? "bg-white text-light-100"
              : "bg-brand text-white"
          )}
        >
          Start now
        </Link>
      )}
    </div>
  );
}

export default Plan;
