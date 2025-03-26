import { getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize } from "@/lib/utils";

async function TotalSpaceUsed() {
  const usedStorageSpace = await getTotalSpaceUsed();
  return <span>{convertFileSize(usedStorageSpace?.total || 0)}</span>;
}

export default TotalSpaceUsed;
