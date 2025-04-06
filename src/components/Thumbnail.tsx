import { cn, getFileIcon } from "@/lib/utils";
import { GitCompareArrows, Share, Waypoints } from "lucide-react";
import Image from "next/image";

interface ThumbnailProps {
  type: string;
  extension: string;
  isShared?: boolean;
  url?: string;
  imageClassName?: string;
  className?: string;
}
function Thumbnail({
  extension,
  type,
  isShared,
  url = "",
  className,
  imageClassName,
}: ThumbnailProps) {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="file thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
      />
      {isShared && (
        <Waypoints
          color="#FFFFFF"
          size={32}
          className="absolute bottom-[-2px] right-[-2px] rounded-full bg-light-100 p-2"
        />
      )}
    </figure>
  );
}

export default Thumbnail;
