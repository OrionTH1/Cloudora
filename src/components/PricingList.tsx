"use client";
import { princing } from "@/constants";
import Plan from "./Plan";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";

function PricingList({
  style,
  planSelected,
}: {
  style: "dark" | "light";
  planSelected?: string | null;
}) {
  const [isBillingAnnualy, setIsBillingAnnualy] = useState(true);
  const handleBillChange = (value: boolean) => {
    setIsBillingAnnualy(value);
  };
  return (
    <>
      <div className="mb-8 flex items-center gap-2.5 text-sm font-medium">
        <p
          className={cn(
            isBillingAnnualy
              ? style === "dark"
                ? "text-light-100/40"
                : "text-white/40"
              : style === "dark"
                ? "text-light-100"
                : "text-white"
          )}
        >
          Bill Monthly
        </p>
        <Switch checked={isBillingAnnualy} onCheckedChange={handleBillChange} />
        <p
          className={cn(
            isBillingAnnualy
              ? style === "dark"
                ? "text-light-100"
                : "text-white"
              : style === "dark"
                ? "text-light-100/40"
                : "text-white/40"
          )}
        >
          Bill Annually
        </p>
      </div>
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-3" id="pricing">
        {princing.map((item) => (
          <Plan
            plan={item}
            key={item.name}
            style={style}
            isBillingAnnualy={isBillingAnnualy}
            isSelected={planSelected === item.name.toLowerCase()}
          />
        ))}
      </section>
    </>
  );
}

export default PricingList;
