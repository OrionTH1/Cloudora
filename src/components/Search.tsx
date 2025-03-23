"use client";
import Image from "next/image";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import { useDebounce } from "use-debounce";
import Thumbnail from "./Thumbnail";
import FormattedDataTime from "./FormattedDataTime";

function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Models.Document[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    const fetchFIles = async () => {
      if (debouncedQuery.length === 0) {
        setResult([]);
        setIsOpen(false);
        return;
      }
      const files = await getFiles({ types: [], searchText: debouncedQuery });
      if (files) {
        setResult(files?.documents);
        setIsOpen(true);
      }
    };

    fetchFIles();
  }, [debouncedQuery, path, router, searchParams]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setIsOpen(false);
    setResult([]);
    setQuery("");

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${file.name.split(".")[0]}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search icon"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {isOpen && (
          <ul className="search-result">
            {result.length ? (
              result.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDataTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
