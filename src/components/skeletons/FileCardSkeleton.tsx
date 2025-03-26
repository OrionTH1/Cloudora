import { Skeleton } from "../ui/skeleton";

function FileCardSkeleton() {
  return (
    <div className="file-card">
      <div className="flex items-end justify-between">
        <Skeleton className={"size-20 rounded-full"} />
        <div className="flex flex-col items-end justify-between">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="file-card-details">
        <Skeleton className="h-4 w-40" />

        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export default FileCardSkeleton;
