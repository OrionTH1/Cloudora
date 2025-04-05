"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE_READABLE, MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { uploadFiles } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  maxStorageSize: number;
  className?: string;
}

function FileUploader({
  accountId,
  className,
  ownerId,
  maxStorageSize,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const uploadPromise = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prev) =>
            prev.filter((prevFile) => prevFile.name !== file.name)
          );
          toast("", {
            description() {
              return (
                <p className="body-2 text-white">
                  <span className="font-semibold">{file.name} </span>
                  is too large. Max file is {MAX_FILE_SIZE_READABLE}MB
                </p>
              );
            },
            className: "error-toast",
          });
        }

        return uploadFiles(file, ownerId, accountId, maxStorageSize, path)
          .then((uploadedFile) => {
            if (uploadedFile) {
              setFiles((prev) =>
                prev.filter((prevFile) => prevFile.name !== uploadedFile.name)
              );
            }
          })
          .catch((err) => {
            setFiles((prev) =>
              prev.filter((prevFile) => prevFile.name !== file.name)
            );
            if (err.message === "Storage limit exceeded.") {
              toast("", {
                description() {
                  return (
                    <p className="body-2 text-white">
                      Upload failed:{" "}
                      <span className="font-semibold">{file.name} </span> file
                      exceeds your plan’s storage limit.
                    </p>
                  );
                },
                className: "error-toast",
              });
            }
          });
      });

      await Promise.all(uploadPromise);
    },
    [ownerId, accountId, maxStorageSize, path]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="file uploader"
          width={24}
          height={24}
          unoptimized
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  alt="remove file"
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FileUploader;
