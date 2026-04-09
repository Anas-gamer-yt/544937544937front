"use client";

import { ImagePlus, LoaderCircle, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { uploadAdminImages } from "@/lib/admin";

export default function ImageUploadField({
  token,
  multiple = false,
  label = "Upload image",
  hint = "",
  onUploaded
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList) {
    if (!fileList?.length) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadAdminImages(fileList, token);
      onUploaded(uploaded.map((item) => item.url));
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed");
    } finally {
      setUploading(false);
      setDragging(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-[24px] border border-dashed px-5 py-6 text-center ${
          dragging
            ? "border-brand-secondary bg-brand-secondary/8"
            : "border-brand-border bg-brand-background"
        }`}
      >
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-secondary shadow-soft">
          {uploading ? <LoaderCircle size={22} className="animate-spin" /> : <UploadCloud size={22} />}
        </div>
        <p className="mt-4 text-sm font-semibold text-brand-primary">{label}</p>
        <p className="mt-2 text-xs leading-6 text-brand-muted">
          Drag and drop {multiple ? "images" : "an image"} here, or use the button below.
        </p>
        {hint ? <p className="mt-1 text-xs leading-6 text-brand-muted">{hint}</p> : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="button-secondary mt-4 gap-2"
        >
          <ImagePlus size={16} />
          {uploading ? "Uploading..." : multiple ? "Choose Images" : "Choose Image"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
