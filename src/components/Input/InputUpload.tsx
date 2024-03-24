"use client";

import { useErrorStore } from "@/store/errorStore";
import Image from "next/image";
import React, { FC, useRef, useState } from "react";

interface Props {
  label: string;
  errorMessage?: string;
  onSelectFile: (file: File) => void;
}

const InputUpload: FC<Props> = ({ label, errorMessage, onSelectFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === "application/pdf") {
        const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to megabytes
        if (fileSizeInMB > 2) {
          useErrorStore
            .getState()
            .setMessage(`File size exceeds ${2}MB limit.`);
        } else {
          setFile(selectedFile);
          onSelectFile && onSelectFile(selectedFile);
        }
      } else {
        // Handle invalid file type error
        console.error("Invalid file type. Please select a PDF file.");
      }
    }
  };

  return (
    <div>
      <label
        //   htmlFor={name}
        className="text-body-2 font-medium"
      >
        {label}
      </label>
      <div
        onClick={() => handleSelect()}
        className="flex flex-col p-4 border border-grey-2 rounded-2xl mt-2 items-center text-center hover:cursor-pointer"
      >
        <Image src={"/icons/IcUploadGreen.svg"} alt="" height={48} width={48} />
        {file && (
          <span className="mt-2 text-body-1 text-grey">{file?.name}</span>
        )}
        {!file && (
          <span className="mt-2 text-body-1 text-grey">
            Click to upload or drag and drop.
            <br />
            [PDF] (Max. 2 Mb)
          </span>
        )}
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {errorMessage && (
        <p className="text-body-2 text-error mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputUpload;
