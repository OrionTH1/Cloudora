import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDataTime from "./FormattedDataTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
function ImageThumnail({ file }: { file: Models.Document }) {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <FormattedDataTime date={file.$createdAt} className="caption" />
      </div>
    </div>
  );
}

function DetailRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex ">
      <p className="file-details-label">{label}</p>
      <p className="file-details-value">{value}</p>
    </div>
  );
}

export function FileDetails({ file }: { file: Models.Document }) {
  return (
    <>
      <ImageThumnail file={file} />
      <div className="space-y-4 px-2 pt-2 text-left">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
}

interface FileShareInputProps {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}
function FileShareInput({
  file,
  onInputChange,
  onRemove,
}: FileShareInputProps) {
  return (
    <div>
      <ImageThumnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="Enter email address (separate multiple emails with comma)"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-100">{file.users.length}</p>
          </div>
        </div>
        <ul className="pt-2 ">
          {file.users.map((userEmail: string) => (
            <li
              key={userEmail}
              className="flex items-center justify-between gap-2"
            >
              <p className="subtitle-2">{userEmail}</p>
              <Button
                type="button"
                onClick={() => onRemove(userEmail)}
                className="share-remove-user"
              >
                <Image
                  src="assets/icons/remove.svg"
                  alt="remove icon"
                  width={24}
                  height={24}
                  className="remove-icon"
                />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FileShareInput;
