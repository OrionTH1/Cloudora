import { getFiles } from "@/lib/actions/file.actions";
import FileCard from "./FileCard";
import { Models } from "node-appwrite";

async function FilesList({
  searchText,
  sort,
  types,
  isShared,
}: {
  types: FileType[];
  sort: string;
  searchText: string;
  isShared: boolean;
}) {
  const files = await getFiles({ types, sort, searchText });

  return (
    <>
      {isShared ? (
        files?.filesSharedWithMe ? (
          <ul className="file-list">
            {files.filesSharedWithMe.map((file: Models.Document) => (
              <li key={file.$id}>
                <FileCard file={file} isShared={isShared} />
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
              <FileCard file={file} isShared={isShared}/>
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
