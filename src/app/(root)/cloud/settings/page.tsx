import ProfileSettingsForm from "@/components/forms/settings/UserSettingsForm";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

async function Settings() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");

  return (
    <div className="text-light-100">
      <h1 className="mb-7 text-5xl font-bold">Settings</h1>

      <section id="user-settings" className="relative">
        <h2 className="mb-4 text-2xl font-medium">Profile</h2>

        <ProfileSettingsForm user={currentUser} />
      </section>
    </div>
  );
}

export default Settings;
