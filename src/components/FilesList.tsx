import { getFiles } from "@/lib/actions/file.actions";
import FileCard from "./FileCard";
import { Models } from "node-appwrite";

async function FilesList({
  searchText,
  sort,
  types,
}: {
  types: FileType[];
  sort: string;
  searchText: string;
}) {
  const files = await getFiles({ types, sort, searchText });
  return (
    <>
      {files?.total ? (
        <ul className="file-list">
          {files.documents.map((file: Models.Document) => (
            <li key={file.$id}>
              <FileCard file={file} />
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
