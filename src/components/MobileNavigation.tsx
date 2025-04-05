"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "./ui/separator";

import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import { signOutUser } from "@/lib/actions/user.actions";

interface MobileNavigationProps {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
  userId: string;
}

function MobileNavigation({
  avatar,
  email,
  fullName,
  accountId,
  userId,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className="mobile-header">
      <Image
        src="assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={120}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image
                  src={avatar}
                  alt="user avatar"
                  width={44}
                  height={44}
                  className="header-user-avatar"
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
              <Separator className="mb-4 bg-light-200/20" />
            </SheetTitle>
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {/* {navItems.map(({ url, name, icon }) => (
                  <Link href={url} key={name} className="lg:w-full">
                    <li
                      className={cn(
                        "mobile-nav-item",
                        pathname === url && "shad-active"
                      )}
                    >
                      <Image
                        src={icon}
                        width={24}
                        height={24}
                        alt={`${name} link`}
                        className={cn(
                          "nav-icon",
                          pathname === url && "nav-icon-active"
                        )}
                      />
                      <p>{name}</p>
                    </li>
                  </Link>
                ))}  */}
              </ul>
            </nav>

            <Separator className="my-5 bg-light-200/20" />
            <div className="flex flex-col justify-between gap-5">
              <FileUploader accountId={accountId} ownerId={userId} />

              <Button
                type="submit"
                className="mobile-sign-out-button"
                onClick={async () => await signOutUser()}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logout icon"
                  width={24}
                  height={24}
                />
                <p>Logout</p>
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default MobileNavigation;
