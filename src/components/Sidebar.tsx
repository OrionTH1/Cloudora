"use client";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  fullName: string;
  email: string;
  avatar: string;
}

function Sidebar({ fullName, email, avatar }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href={"/"}>
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={100}
          height={100}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link href={url} key={name} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
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
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        width={508}
        height={418}
        alt="logo"
        className="w-full"
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          width={44}
          height={44}
          alt="Avatar"
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
