import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDataTime from "./FormattedDataTime";
import FileActionDropdown from "./FileActionDropdown";

interface FileCardProps {
  file: Models.Document;
  user: Models.Document
  isShared: boolean;
}
function FileCard({ file,user, isShared }: FileCardProps) {
  return (
    <Link href={file.url} target="_blank" className="file-card cursor-pointer">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
          isShared={isShared}
        />
        <div className="flex flex-col items-end justify-between">
          <FileActionDropdown file={file} user={user}/>
          <p className="body-1 "> {convertFileSize(file.size)}</p>
        </div>
      </div>
      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>

        <FormattedDataTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">
          {isShared
            ? `Shared by: ${file.owner.fullName}`
            : `By: ${file.owner.fullName}`}
        </p>
      </div>
    </Link>
  );
}

export default FileCard;
