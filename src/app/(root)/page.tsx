import PricingList from "@/components/PricingList";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

function LadingPage() {
  return (
    <div>
      <main>
        <section id="company" className="flex w-full">
          <div className="flex-1 bg-brand px-9 text-white">
            <h1 className="mb-14 mt-9 text-5xl font-medium">Cloudora</h1>
            <div className="mb-8 flex w-[340px] flex-col gap-4">
              <h2 className="text-4xl/[3.466rem] font-bold">
                Manage your files the best way
              </h2>
              <p className="text-base/6">
                We&apos;ve created the perfect place for you to store all your
                documents.
              </p>
            </div>

            <div className="mb-14 flex gap-8">
              <Link
                href={"/sign-up"}
                className="flex w-[150px] items-center justify-center rounded bg-white py-3 font-medium text-light-100 "
              >
                Start now
              </Link>
              <a
                href="#pricing"
                className="flex w-[150px] items-center justify-center rounded border-2 border-white bg-transparent py-3 font-medium text-white"
              >
                View pricing
              </a>
            </div>
          </div>

          <aside className="hidden flex-1 lg:flex">
            <Image
              src="/assets/images/ilustration.svg"
              alt="Ilustration"
              width={600}
              height={450}
            />
          </aside>
        </section>
        <section
          id="about"
          className="flex w-full flex-col items-center px-9 py-16 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="mb-12 w-[570px]">
            <h1 className="mb-5 text-4xl font-bold text-light-100">
              Your Cloud, Simple & Secure!
            </h1>
            <p className="text-xl font-medium text-light-100">
              Store, access, and share your files anytime, anywhere. Fast,
              secure, and reliable cloud storage—your data, always within reach.
            </p>
          </div>
          <div>
            <Image
              src="/assets/images/app-preview.png"
              alt="App preview"
              width={500}
              height={400}
            />
          </div>
        </section>
        <section
          className="flex w-full flex-col items-center gap-10 bg-brand p-10 lg:grid-cols-3"
          id="pricing"
        >
          <PricingList style="light" />
        </section>
      </main>
      <footer className="flex w-full flex-col items-center gap-4 px-20 py-8">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-medium text-brand">Cloudora</h1>
          <p className="text-sm text-light-100/60">
            @ 2025 Cloudora All right reserved
          </p>
        </div>
        <Separator />
        <div className="flex gap-12">
          <ul className="flex gap-2 text-sm text-light-100/60 underline">
            <li>
              <a href="#company">Company</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
          </ul>

          <ul className="flex gap-2 text-sm text-light-100/60 underline">
            <li>
              <Link href={"/cloud/dashboard"}>Dashboard</Link>
            </li>
            <li>
              <Link href={"/cloud/files"}>Files</Link>
            </li>
            <li>
              <Link href={"/cloud/settings"}>Settings</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default LadingPage;
