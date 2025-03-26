import { Folder, LayoutDashboard, Share2, Trash2 } from "lucide-react";

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "My Files",
      url: "#",
      icon: Folder,
      isActive: true,
      items: [
        {
          title: "All files",
          url: "/files",
          type: "",
        },
        {
          title: "Images",
          url: "/files?type=images",

          type: "images",
        },
        {
          title: "Documents",
          url: "/files?type=documents",
          type: "documents",
        },
        {
          title: "Media",
          url: "/files?type=media",

          type: "media",
        },
        {
          title: "Others",
          url: "/files?type=others",
          type: "other",
        },
      ],
    },
    {
      title: "Shared with me",
      url: "/files/shared",
      icon: Share2,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2,
    },
  ],
};

export const actionsDropdownItems = [
  {
    label: "Rename",
    icon: "/assets/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Share",
    icon: "/assets/icons/share.svg",
    value: "share",
  },
  {
    label: "Download",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];

export const avatarPlacerHolderUrl =
  "https://storage.needpix.com/rsynced_images/avatar-1577909_1280.png";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE_READABLE = MAX_FILE_SIZE / 1024 / 1024; // 5MB
