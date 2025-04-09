"use client";
import ProfileUploader from "@/components/ProfileUploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  updateUserAvatar,
  updateUserEmail,
  updateUserName,
} from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileSettingsFormSchema = z.object({
  profilePic: z.custom<File[]>(),
  profileName: z.string().min(2).max(50),
  profileEmail: z.string().email(),
});

const handleUpdateUserAvatar = async (
  file: File,
  userId: string,
  path: string
) => {
  const userUpdated = await updateUserAvatar(file, userId, path);
  if (userUpdated) {
    toast("", {
      description() {
        return (
          <p className="body-2 text-white">
            User info updated{" "}
            <span className="font-semibold">successfully</span>
          </p>
        );
      },

      className: "success-toast",
    });
  }
};

const handleUpdateUserName = async (
  userName: string,
  userId: string,
  path: string
) => {
  const userUpdated = await updateUserName(userName, userId, path);
  if (userUpdated) {
    toast("", {
      description() {
        return (
          <p className="body-2 text-white">
            User info updated{" "}
            <span className="font-semibold">successfully</span>
          </p>
        );
      },

      className: "success-toast",
    });
  }
};

const handleUpdateUserEmail = async (
  newUserEmail: string,
  accountId: string,
  userId: string,
  path: string
) => {
  try {
    const updatedEmail = await updateUserEmail(
      newUserEmail,
      accountId,
      userId,
      path
    );

    if (updatedEmail && updatedEmail.response) {
      return toast("", {
        description() {
          return (
            <p className="body-2 text-white">
              User info updated{" "}
              <span className="font-semibold">successfully</span>
            </p>
          );
        },

        className: "success-toast",
      });
    }

    if (updatedEmail && updatedEmail.error === "email_already_exists") {
      return toast("", {
        description() {
          return (
            <p className="body-2 text-white">
              The <span className="font-semibold">{newUserEmail}</span> email
              already exists
            </p>
          );
        },

        className: "error-toast",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

function ProfileSettingsForm({ user }: { user: Models.Document }) {
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ProfileSettingsFormSchema>>({
    resolver: zodResolver(ProfileSettingsFormSchema),
    defaultValues: {
      profilePic: [] as File[],
      profileName: user.fullName,
      profileEmail: user.email,
    },
  });

  const handleFormSubmit = async (
    values: z.infer<typeof ProfileSettingsFormSchema>
  ) => {
    setIsLoading(true);
    if (values.profilePic.length > 0) {
      await handleUpdateUserAvatar(values.profilePic[0], user.$id, path);
    }

    if (values.profileName !== user.fullName) {
      await handleUpdateUserName(values.profileName, user.$id, path);
    }

    if (values.profileEmail !== user.email) {
      await handleUpdateUserEmail(
        values.profileEmail,
        user.$id,
        user.accountId,
        path
      );
    }
    setIsLoading(false);
  };
  return (
    <>
      <Form {...form}>
        <form
          className="relative flex  flex-col gap-6 md:w-[420px]"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <FormField
            control={form.control}
            name="profilePic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form-label">
                  Profile Picture
                </FormLabel>
                <div className="flex h-20 w-fit gap-2.5 rounded-[10px] bg-light-500 p-2">
                  {field.value.length > 0 ? (
                    <Image
                      src={URL.createObjectURL(field.value[0])}
                      alt="Profile Picture"
                      width={64}
                      height={64}
                      className="rounded-[8px]"
                    />
                  ) : (
                    <Image
                      src={user.avatar}
                      alt="Profile Picture"
                      width={64}
                      height={64}
                      className="rounded-[8px]"
                    />
                  )}
                  <div className="flex h-full flex-col justify-between">
                    <FormControl>
                      <ProfileUploader
                        files={field.value}
                        onChange={field.onChange}
                        setError={form.setError}
                        clearErrors={form.clearErrors}
                      />
                    </FormControl>
                    <p className="text-xs">
                      Must be <span className="font-medium">png</span>,{" "}
                      <span className="font-medium">jpeg</span> or{" "}
                      <span className="font-medium">jpg</span>. Max 2MB
                    </p>
                  </div>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form-label">Profile Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Profile Name"
                    className="shad-no-focus body-2 rounded bg-white text-light-100 placeholder:text-light-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form-label">Profile Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Profile Email"
                    className="shad-no-focus body-2 rounded bg-white text-light-100 placeholder:text-light-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-32 rounded bg-brand py-5 transition-all hover:bg-brand-100"
            disabled={isLoading}
          >
            Save
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader icon"
                width={16}
                height={16}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default ProfileSettingsForm;
