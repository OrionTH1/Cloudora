"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { ChevronRight, GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import SidebarUser from "./SidebarUser";
import { usePathname, useSearchParams } from "next/navigation";
import { sidebarData } from "@/constants";

interface SidebarProps {
  fullName: string;
  email: string;
  avatar: string;
  planType: PlansTypes;
}

function Sidebar({ fullName, email, avatar, planType }: SidebarProps) {
  const type = useSearchParams().get("type");
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <ShadSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
            className={cn("flex justify-between gap-2", !open && "flex-col")}
          >
            <div className="flex gap-2">
              <div className="flex items-center justify-center rounded-[8px] bg-brand p-2">
                <GalleryVerticalEnd color="#FFFFFF" size={16} />
              </div>
              <div className={cn(open ? "flex flex-col" : "hidden")}>
                <h1 className="text-sm font-bold">Cloudora</h1>
                <p className="text-xs">Enterprise</p>
              </div>
            </div>
            <SidebarTrigger className="size-8" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarData.navMain.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                type === subItem.type && "shad-active"
                              )}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(pathname === item.url && "shad-active")}
                >
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={{ name: fullName, email, avatar, plan: planType }} />
      </SidebarFooter>
      <SidebarRail />
    </ShadSidebar>
  );
}

export default Sidebar;
