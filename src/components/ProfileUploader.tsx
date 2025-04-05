"use client";
import { MAX_PROFILE_SIZE } from "@/constants";
import { convertFileSize } from "@/lib/utils";
import { FileRejection, useDropzone } from "react-dropzone";
import { UseFormSetError } from "react-hook-form";

interface ProfileUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  setError: UseFormSetError<{
    profilePic: File[];
    profileName: string;
    profileEmail: string;
  }>;
  clearErrors?: () => void;
}

function ProfileUploader({
  files,
  onChange,
  setError,
  clearErrors,
}: ProfileUploaderProps) {
  const handleFileDrop = (acceptedFiles: File[]) => {
    clearErrors?.();

    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles);
    }
  };

  const handleFileRejected = (error: FileRejection[]) => {
    clearErrors?.();

    if (error[0].errors[0].code === "file-too-large") {
      setError("profilePic", {
        type: "validate",
        message: `File size is too large. Max file size is ${convertFileSize(MAX_PROFILE_SIZE)}`,
      });
      return;
    }

    const errorMessage = error[0].errors[0].message;
    setError("profilePic", { type: "validate", message: errorMessage });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
    maxSize: MAX_PROFILE_SIZE,
    onDrop: handleFileDrop,
    onDropRejected: handleFileRejected,
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer rounded bg-brand p-2 text-center transition-all hover:bg-brand-100"
    >
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <p className="text-xs text-white">{files[0].name}</p>
      ) : (
        <p className="text-xs text-white">Update Profile Picture</p>
      )}
    </div>
  );
}

export default ProfileUploader;
