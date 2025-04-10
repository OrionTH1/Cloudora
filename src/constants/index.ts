import {
  BadgeCheck,
  BadgePercent,
  CreditCard,
  Folder,
  LayoutDashboard,
  LogOut,
  Settings,
  Share2,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/cloud",
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
          url: "/cloud/files",
          type: "",
        },
        {
          title: "Images",
          url: "/cloud/files?type=images",

          type: "images",
        },
        {
          title: "Documents",
          url: "/cloud/files?type=documents",
          type: "documents",
        },
        {
          title: "Media",
          url: "/cloud/files?type=media",

          type: "media",
        },
        {
          title: "Others",
          url: "/cloud/files?type=others",
          type: "other",
        },
      ],
    },
    {
      title: "Shared with me",
      url: "/cloud/files?type=shared%20with%20me",
      icon: Share2,
    },
  ],
  userMain: [
    {
      title: "Change your Plan",
      url: "/order?name=",
      icon: BadgePercent,
    },
    {
      title: "Account",
      url: "/cloud/settings#user-settings",
      icon: BadgeCheck,
    },
    {
      title: "Billing",
      url: "/cloud/settings#user-billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "/cloud/settings",
      icon: Settings,
    },
    {
      title: "Log out",
      url: "",
      icon: LogOut,
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

export const princing: Pricing[] = [
  {
    name: "Free",
    type: "free",
    monthlyPrice: 0,
    annuallyPrice: 0,
    totalAnnuallPrice: 0,
    description: "A great option for test our application",
    features: [
      {
        title: "10MB Storage",
        avaiable: true,
      },
      {
        title: "Upload Photo, Documents and Files",
        avaiable: true,
      },
      {
        title: "Can Share files with other users",
        avaiable: false,
      },
    ],
  },
  {
    name: "Basic",
    type: "basic",
    monthlyPrice: 10,
    annuallyPrice: 5,
    totalAnnuallPrice: 108,
    description: "A great option for common users",
    features: [
      {
        title: "1GB Storage",
        avaiable: true,
      },
      {
        title: "Upload Photo, Documents and Files",
        avaiable: true,
      },
      {
        title: "Can Share files with other users",
        avaiable: true,
      },
    ],
  },
  {
    name: "Pro",
    type: "pro",
    monthlyPrice: 20,
    annuallyPrice: 10,
    totalAnnuallPrice: 216,
    description: "A awesome option for users with more needs",
    features: [
      {
        title: "2GB Storage",
        avaiable: true,
      },
      {
        title: "Upload Photo, Documents and Files",
        avaiable: true,
      },
      {
        title: "Can Share files with other users",
        avaiable: true,
      },
    ],
  },
];

export const avatarPlacerHolderUrl =
  "https://storage.needpix.com/rsynced_images/avatar-1577909_1280.png";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PROFILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_FILE_SIZE_READABLE = MAX_FILE_SIZE / 1024 / 1024; // 5MB
