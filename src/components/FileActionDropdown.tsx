"use client";

import { Models } from "node-appwrite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState } from "react";
import { actionsDropdownItems } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFile,
  renameFile,
  shareFileToUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import FileShareInput, { FileDetails } from "./FileActionsModalContent";
import { toast } from "sonner";

function FileActionDropdown({ file }: { file: Models.Document }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [IsModalOpen, setIsModalOpen] = useState(true);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const closeAllModels = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(false);
    setAction(null);
    setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;

    try {
      setIsLoading(true);

      const actions = {
        rename: () => renameFile(file.$id, name, pathname),
        share: () => shareFileToUsers(file.$id, emails, pathname),
        delete: () => deleteFile(file.$id, file.bucketFileId, pathname),
      };

      const success = await actions[action.value as keyof typeof actions]();

      console.log(success);

      if (!success?.error) {
        // closeAllModels();
        return toast("", {
          description() {
            return (
              <p className="body-2 text-white">
                File {action.value}d
                <span className="font-semibold"> successfully</span>
              </p>
            );
          },

          className: "success-toast",
        });
      }

      if (success.error === "email_does_not_exits") {
        console.log("Email nao existe");

        return toast("", {
          description() {
            return (
              <p className="body-2 text-white">
                The <span className="font-semibold">{success.response}</span>{" "}
                email doesn&apos;t exists
              </p>
            );
          },

          className: "error-toast",
        });
      }

      if (success.error === "does_not_has_feature") {
        return toast("", {
          description() {
            return (
              <p className="body-2 text-white">
                Your <span className="font-semibold">current plan</span>{" "}
                <span className="font-semibold">
                  doesn&apos;t allow file sharing.
                </span>{" "}
                Please <span className="font-semibold">upgrade</span> to a
                higher plan to access this feature.
              </p>
            );
          },

          className: "error-toast",
        });
      }

      toast("", {
        description() {
          return (
            <p className="body-2 text-white">
              Something went wrong, please try again.
            </p>
          );
        },

        className: "error-toast",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast("", {
        description() {
          return (
            <p className="body-2 text-white">
              Something went wrong, please try again.
            </p>
          );
        },

        className: "error-toast",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await shareFileToUsers(file.$id, updatedEmails, pathname);

    if (success) setEmails(updatedEmails);
    closeAllModels();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { label, value } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <FileShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModels} className="modal-cancel-button">
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className="modal-submit-button"
              disabled={isLoading}
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={IsModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="Open Downdrop Menu"
            width={20}
            height={20}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((action) => (
            <DropdownMenuItem
              key={action.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(action);
                if (
                  ["rename", "share", "delete", "details"].includes(
                    action.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {action.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={action.icon}
                    alt={`${action.label} action icon`}
                    width={30}
                    height={30}
                  />
                  {action.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={action.icon}
                    alt={`${action.label} action icon`}
                    width={30}
                    height={30}
                  />
                  {action.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
}

export default FileActionDropdown;
