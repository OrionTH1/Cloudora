import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

async function Layout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");
  return (
    <main className="flex h-screen">
      <Sidebar
        avatar={currentUser.avatar}
        email={currentUser.email}
        fullName={currentUser.fullName}
      />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation
          avatar={currentUser.avatar}
          email={currentUser.email}
          fullName={currentUser.fullName}
        />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}

export default Layout;
