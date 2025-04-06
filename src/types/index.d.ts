declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

declare interface ShareInputProps {
  file: Models.Document;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}

declare interface SpaceUsedObject {
  images: SpaceUsedFile;
  documents: SpaceUsedFile;
  media: SpaceUsedFile;
  others: SpaceUsedFile;
  total: number;
}

declare interface SpaceUsedFile {
  url: string;
  icon: string;
  title: string;
  date: number;
  size: number;
}

declare type PlansTypes = "free" | "basic" | "pro";
declare type PlansNames = "Free" | "Basic" | "Pro";
declare type PlansFeatures = "share_files" | "upload_files";
declare interface PricingFeatures {
  title: string;
  avaiable: boolean;
}
declare interface Pricing {
  name: PlansNames;
  type: PlansTypes;
  annuallyPrice: number;
  monthlyPrice: number;
  description: string;
  features: PricingFeatures[];
}
