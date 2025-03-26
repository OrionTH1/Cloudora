import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

async function Layout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");
  return (
    <main className="flex h-screen">
      <SidebarProvider>
        <Sidebar
          avatar={currentUser.avatar}
          email={currentUser.email}
          fullName={currentUser.fullName}
        />

        <main className="flex h-full flex-1 flex-col">
          <MobileNavigation
            avatar={currentUser.avatar}
            email={currentUser.email}
            fullName={currentUser.fullName}
            accountId={currentUser.accountId}
            userId={currentUser.$id}
          />
          <Header accountId={currentUser.accountId} userId={currentUser.$id} />
          <div className="main-content">{children}</div>
        </main>

        <Toaster />
      </SidebarProvider>
    </main>
  );
}

export default Layout;
