// CategoriesForm.tsx

import React, { useEffect, useRef, useState } from "react";

export interface CategoryDefaults {
  name?: string;
  description?: string;
  imageUrl?: string;
}

type CategoryFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: FormData) => void;
  defaultValues?: CategoryDefaults;
};

const MAX_MB = 5;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
];

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const [name, setName] = useState(defaultValues?.name || "");
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    defaultValues?.imageUrl || null
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLLabelElement>(null);

  // Reset when open/defaults change
  useEffect(() => {
    if (open) {
      setName(defaultValues?.name || "");
      setDescription(defaultValues?.description || "");
      setFile(null);
      setPreview(defaultValues?.imageUrl || null);
      setError("");
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [open, defaultValues]);

  // Revoke object URLs
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Only JPG, PNG, Gif or WebP images are allowed.";
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      return `File too large. Max ${MAX_MB}MB.`;
    }
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return url;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Both name and description are required.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      // Append image only if user selected a new file.
      // For edit without change, omit image to keep existing server-side.
      if (file) {
        formData.append("image", file);
      }

      await onSubmit(formData);
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      onMouseDown={(e) => e.target === dialogRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f122b] text-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {defaultValues ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="px-2 py-1 bg-white/5 rounded-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-white/80">Name</label>
            <input
              ref={nameInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
              placeholder="e.g., Electronics"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-white/80">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
              placeholder="Short description"
            />
          </div>

          {/* Image uploader */}
          <div>
            <label className="text-sm text-white/80">Image</label>

            {/* Dropzone / picker */}
            <label
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mt-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center cursor-pointer hover:bg-white/10 transition"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="text-2xl">📷</div>
              <div className="text-sm">
                Drag & drop an image or{" "}
                <span className="underline">browse</span>
              </div>
              <div className="text-xs text-white/60">
                PNG, JPG, Gif or WebP up to {MAX_MB}MB
              </div>
            </label>

            {/* Preview */}
            {(preview || file) && (
              <div className="mt-3 flex items-center gap-3">
                <div className="h-20 w-20 flex items-center justify-center rounded-lg bg-white">
                  <img
                    src={preview ?? ""}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (preview?.startsWith("blob:"))
                      URL.revokeObjectURL(preview);
                    setPreview(defaultValues?.imageUrl || null);
                    setFile(null);
                  }}
                  className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-lg"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
            >
              {submitting ? "Saving..." : defaultValues ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
