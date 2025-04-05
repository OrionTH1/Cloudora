import { capitalize, cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

function PlanCard({ planType }: { planType: PlansTypes }) {
  return (
    <div
      className={cn(
        "w-[70px] flex items-center gap-1 rounded py-1.5 justify-center ",
        planType === "free" && "bg-light-100/20 text-light-100",
        planType === "basic" && "bg-brand/20 text-brand",
        planType === "pro" && "bg-gold/20 text-gold"
      )}
    >
      <Sparkles size={12} />
      <p className="text-xs font-medium">{capitalize(planType)}</p>
    </div>
  );
}

export default PlanCard;
