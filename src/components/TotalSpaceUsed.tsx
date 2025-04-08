import { getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize } from "@/lib/utils";

async function TotalSpaceUsed({ type }: { type: FileType }) {
  const usedStorageSpace = await getTotalSpaceUsed();
  let totalSize = null;
  switch (type) {
    case "document":
      totalSize = usedStorageSpace?.document.size;
      break;
    case "image":
      totalSize = usedStorageSpace?.image.size;
      break;
    case "video":
    case "audio":
      totalSize = usedStorageSpace?.media.size;
      break;
    case "other":
      totalSize = usedStorageSpace?.other.size;
      break;
    default:
      totalSize = usedStorageSpace?.total;
      break;
  }

  return <span>{convertFileSize(totalSize || 0)}</span>;
}

export default TotalSpaceUsed;
