import FileCard from "@/components/FileCard";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";

async function Page({ params }: SearchParamProps) {
  const type = ((await params)?.type as string) || "";
  const files = await getFiles();
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total <span className="h-5">0 MB</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files?.total ? (
        <ul className="dashboard-summary-list">
          {files.documents.map((file: Models.Document) => (
            <li key={file.$id}>
              <FileCard file={file} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
}

export default Page;
