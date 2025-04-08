import Chart from "@/components/Chart";
import FileActionDropdown from "@/components/FileActionDropdown";
import FormattedDataTime from "@/components/FormattedDataTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getPlanById } from "@/lib/actions/plans.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { convertFileSize } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const [files, usedStorageSpace, currentUser] = await Promise.all([
    getFiles({ types: [], limit: 6, sort: "$createdAt-desc" }),
    getTotalSpaceUsed(),
    getCurrentUser(),
  ]);

  if (!currentUser) redirect("/sign-up");
  const userPlan = await getPlanById(currentUser.plans?.$id);
  if (!userPlan) return redirect(`/order?name=${currentUser.fullName}`);

  const maxStorageSize = userPlan.maxStorageSize;
  return (
    <div className="dashboard-container">
      <section>
        <Chart
          storageUsed={usedStorageSpace?.total || 0}
          maxStorageSize={maxStorageSize}
        />
        <ul className="dashboard-summary-list">
          {usedStorageSpace &&
            Object.entries(usedStorageSpace).map(([key, value]) => {
              if (key === "total") return;
              if (["image", "document", "media", "other"].includes(key)) {
                return (
                  <Link
                    key={key}
                    href={value.url}
                    className="dashboard-summary-card"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between gap-3">
                        <Image
                          src={value.icon}
                          width={100}
                          height={100}
                          alt="uploaded image"
                          className="summary-type-icon"
                        />
                        <h4 className="summary-type-size">
                          {convertFileSize(value.size)}
                        </h4>
                      </div>

                      <h5 className="summary-type-title">{value.title}</h5>
                      <Separator className="bg-light-400" />
                      <div className="space-y-2">
                        <p className="text-center text-light-200">
                          Last update
                        </p>
                        <FormattedDataTime
                          date={usedStorageSpace[key as SpaceUsedKeys].date}
                          className="text-center text-light-100"
                        />
                      </div>
                    </div>
                  </Link>
                );
              }
            })}
        </ul>
      </section>
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent Files uploaded</h2>
        <ul className="mt-5 flex flex-col gap-5">
          {files?.ownFiles ? (
            files.ownFiles.map((file) => (
              <li key={file.$id}>
                <Link
                  href={file.url}
                  target="_blank"
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-light-400"
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <div className="recent-file-details">
                    <div className="flex flex-col gap-1">
                      <p className="recent-file-name">{file.name}</p>
                      <FormattedDataTime
                        date={file.$createdAt}
                        className="caption"
                      />
                    </div>
                    <FileActionDropdown file={file} user={currentUser} />
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>No files found</p>
          )}
        </ul>
      </section>
    </div>
  );
}
