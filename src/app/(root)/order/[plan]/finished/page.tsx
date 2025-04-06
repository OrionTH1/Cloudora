"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { useReward } from "react-rewards";
import { redirect } from "next/navigation";

function FinishedPage() {
  const rewardConfig = {
    elementCount: 100,
    spread: 140,
    decay: 0.96,
    lifetime: 200,
    startVelocity: 30,
  };
  const { reward: playConfetti } = useReward(
    "confetti",
    "confetti",
    rewardConfig
  );
  const { reward: playConfetti2 } = useReward("confetti-2", "confetti", {
    ...rewardConfig,
    angle: 80,
  });
  const [secondsToRedirect, setSecondsToRedirect] = useState(5);

  useEffect(() => {
    playConfetti();
    playConfetti2();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsToRedirect === 0) redirect("/cloud");

    console.log("test");
    const interval = setInterval(() => {
      setSecondsToRedirect((prev) => prev - 1);
    }, 1 * 1000);

    return () => clearInterval(interval);
  }, [secondsToRedirect]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-brand text-white">
        <div className="flex w-[420px] flex-col items-center gap-y-8">
          <div className="flex flex-col items-center">
            <DotLottieReact
              src="/assets/images/success.lottie"
              autoplay
              className="w-64"
            />

            <h1 className="text-center text-4xl font-semibold">
              Your <span className="text-green">Payment</span> has been
              successfully confirmed
            </h1>
          </div>
          <div className="text-sm font-semibold text-white">
            {secondsToRedirect > 0 ? (
              <p>
                Redirecting to home in{" "}
                <span className="text-green">{secondsToRedirect}</span>{" "}
                seconds...
              </p>
            ) : (
              <p>Redirecting to home...</p>
            )}
          </div>
        </div>
      </div>
      <span id="confetti" className="absolute bottom-0 left-1 size-1" />
      <span id="confetti-2" className="absolute bottom-0 right-0 size-1" />
    </>
  );
}

export default FinishedPage;
