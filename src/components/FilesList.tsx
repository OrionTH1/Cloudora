import { getFiles } from "@/lib/actions/file.actions";
import FileCard from "./FileCard";
import { Models } from "node-appwrite";

async function FilesList({
  searchText,
  sort,
  types,
  isShared,
  user
}: {
  types: FileType[];
  sort: string;
  searchText: string;
  isShared: boolean;
  user: Models.Document
}) {
  const files = await getFiles({ types, sort, searchText });

  return (
    <>
      {isShared ? (
        files?.filesSharedWithMe ? (
          <ul className="file-list">
            {files.filesSharedWithMe.map((file: Models.Document) => (
              <li key={file.$id}>
                <FileCard file={file} isShared={isShared} user={user} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )
      ) : files?.ownFiles ? (
        <ul className="file-list">
          {files.ownFiles.map((file: Models.Document) => (
            <li key={file.$id}>
              <FileCard file={file} isShared={isShared} user={user} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </>
  );
}

export default FilesList;
