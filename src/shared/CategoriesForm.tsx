import React, { useEffect, useRef, useState } from "react";

export interface CategoryPayload {
  name: string;
  description: string;
}

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CategoryPayload) => Promise<void> | void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reset fields when opened
  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setError("");
      // focus first field after render
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    if (!trimmedDesc) {
      setError("Description is required.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ name: trimmedName, description: trimmedDesc });
    } catch (err) {
      console.error(err);
      setError("Failed to create. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      onMouseDown={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f122b] text-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Category</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm mb-1 text-white/80">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skin Care"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm mb-1 text-white/80"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beauty products"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="pt-1 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm rounded-lg px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-sm rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
            >
              {submitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
