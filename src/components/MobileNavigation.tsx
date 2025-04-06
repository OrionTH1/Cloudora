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
import { sidebarData } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight, GalleryVerticalEnd } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOutUser } from "@/lib/actions/user.actions";

interface MobileNavigationProps {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
  userId: string;
  maxStorageSize: number;
}

function MobileNavigation({
  avatar,
  email,
  fullName,
  accountId,
  userId,
  maxStorageSize,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const type = useSearchParams().get("type");
  return (
    <header className="mobile-header">
      <div className="flex w-full items-center gap-2">
        <h1 className="text-2xl font-bold text-brand">Cloudora</h1>
      </div>
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
            <SheetTitle className="py-2">
              <div className="flex w-full items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-[8px] bg-brand">
                  <GalleryVerticalEnd color="#FFFFFF" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-brand">Cloudora</h1>
                  <p className="text-xs font-medium">Enterprise</p>
                </div>
              </div>
            </SheetTitle>
            <Separator className="mb-4 bg-light-200/20" />
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {sidebarData.navMain.map((item) =>
                  item.items ? (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <div className="w-full">
                        <CollapsibleTrigger asChild>
                          <Button className="mobile-nav-item">
                            {item.icon && <item.icon size={20} />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="flex h-fit p-2">
                            <div className="ml-8 mr-4 max-w-[3px] flex-1 bg-light-100/10" />
                            <div>
                              {item.items?.map((subItem) => (
                                <li
                                  key={subItem.title}
                                  className={cn(
                                    "hover:shad-active flex w-fit rounded p-1",
                                    type === subItem.type && "shad-active"
                                  )}
                                >
                                  <Link href={subItem.url}>
                                    <span className="text-xs text-light-100/60">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ) : (
                    <Link
                      href={item.url}
                      key={item.title}
                      className="w-full transition-all"
                    >
                      <li
                        className={cn(
                          "mobile-nav-item",
                          pathname === item.url && "shad-active"
                        )}
                      >
                        {item.icon && <item.icon size={20} />}
                        <p>{item.title}</p>
                      </li>
                    </Link>
                  )
                )}
              </ul>
              <Separator className="my-5 bg-light-200/20" />
              <ul>
                <Collapsible asChild className="group/collapsible">
                  <div className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button className="mobile-nav-item">
                        <Avatar className="size-8 rounded-full ">
                          <AvatarImage src={avatar} alt={fullName} />
                          <AvatarFallback className="rounded-full">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {fullName}
                          </span>
                          <span className="truncate text-xs">{email}</span>
                        </div>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex h-fit p-2">
                      <div className="ml-8 mr-4 max-w-[3px] flex-1 bg-light-100/10" />
                      <div className="flex flex-col gap-2">
                        {sidebarData.userMain.map((item) =>
                          item.title === "Log out" ? (
                            <div
                              key={item.title}
                              onClick={async () => {
                                await signOutUser();
                              }}
                              className={cn(
                                "hover:shad-active flex w-fit cursor-pointer gap-2 rounded p-1 text-xs text-light-100/60",
                                pathname === item.url && "shad-active"
                              )}
                            >
                              <p>{item.title}</p>
                            </div>
                          ) : (
                            <Link
                              href={item.url}
                              key={item.title}
                              className={cn(
                                "hover:shad-active flex w-fit gap-2 rounded p-1 text-xs text-light-100/60",
                                pathname === item.url && "shad-active"
                              )}
                            >
                              <p>{item.title}</p>
                            </Link>
                          )
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </ul>
            </nav>
            <Separator className="my-5 bg-light-200/20" />
            <FileUploader
              accountId={accountId}
              ownerId={userId}
              maxStorageSize={maxStorageSize}
              className="w-full"
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default MobileNavigation;
