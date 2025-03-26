import FilesList from "@/components/FilesList";
import FileCardSkeleton from "@/components/skeletons/FileCardSkeleton";
import Sort from "@/components/Sort";
import TotalSpaceUsed from "@/components/TotalSpaceUsed";
import { Skeleton } from "@/components/ui/skeleton";
import { getFileTypesParams } from "@/lib/utils";
import { Suspense } from "react";

async function Page({ searchParams }: SearchParamProps) {
  const type = ((await searchParams)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type || "All Files"}</h1>
        <div className="total-size-section">
          <div className="body-1 flex items-center gap-1">
            <p>Total:</p>
            <Suspense fallback={<Skeleton className="h-4 w-12" />}>
              <TotalSpaceUsed />
            </Suspense>
          </div>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      <section className="w-full">
        <Suspense
          fallback={
            <ul className="file-list">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <li key={index}>
                    <FileCardSkeleton />
                  </li>
                ))}
            </ul>
          }
        >
          <FilesList searchText={searchText} sort={sort} types={types} />
        </Suspense>
      </section>
    </div>
  );
}

export default Page;
