import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser, getUserPlan } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

async function Layout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");

  const userPlan = await getUserPlan();
  if (!userPlan) return redirect(`/order?name=${currentUser.fullName}`);
  return (
    <main className="flex h-screen">
      <SidebarProvider>
        <Sidebar
          avatar={currentUser.avatar}
          email={currentUser.email}
          fullName={currentUser.fullName}
          planType={currentUser.plans.name}
        />

        <main className="flex h-full flex-1 flex-col">
          <MobileNavigation
            avatar={currentUser.avatar}
            email={currentUser.email}
            fullName={currentUser.fullName}
            accountId={currentUser.accountId}
            userId={currentUser.$id}
          />
          <Header
            accountId={currentUser.accountId}
            userId={currentUser.$id}
            maxStorageSize={userPlan.maxStorageSize}
          />
          <div className="main-content">{children}</div>
        </main>

        <Toaster />
      </SidebarProvider>
    </main>
  );
}

export default Layout;
