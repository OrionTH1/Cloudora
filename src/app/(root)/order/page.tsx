import PricingList from "@/components/PricingList";
import { getUserPlan } from "@/lib/actions/user.actions";

async function ChosePlan({ searchParams }: SearchParamProps) {
  const userPlan = await getUserPlan();

  const userName = (await searchParams)?.name || "";
  return (
    <div className="flex w-screen flex-col items-center justify-center pt-24">
      <div className="mb-12 flex flex-col items-center">
        <h1 className="text-center text-5xl text-light-100">
          Hello <span className="font-semibold">{userName}</span>
        </h1>
        <h2 className="text-center text-3xl text-light-100">
          Select your plan
        </h2>
      </div>
      <PricingList style="dark" planSelected={userPlan?.name} />
    </div>
  );
}

export default ChosePlan;
