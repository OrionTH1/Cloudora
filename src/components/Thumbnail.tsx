import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";

interface ThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  className?: string;
}
function Thumbnail({ extension, type, url = "", className }: ThumbnailProps) {
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
          className,
          isImage && "thumbnail-image"
        )}
      />
    </figure>
  );
}

export default Thumbnail;
