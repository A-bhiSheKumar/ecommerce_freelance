import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name: string;
    description: string;
    category: string;
    price: string;
    short_description?: string;
    sale_price?: string;
    current_price?: string;
    stock_quantity?: string;
    status?: string[];
    meta_description?: string;
    meta_title?: string;
    is_active?: boolean;
    is_bestseller?: boolean;
    is_featured?: boolean;
    is_on_sale?: boolean;
  } | null;
}

const MAX_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_IMAGES = 5;

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryId = params.get("category");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: categoryId || "",
    price: "",
    short_description: "",
    sale_price: "",

    stock_quantity: "",
    status: [] as string[],
    meta_description: "",
    meta_title: "",
    is_active: false,
    is_bestseller: false,
    is_featured: false,
    is_on_sale: false,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef<HTMLLabelElement>(null);

  const isEditMode = !!defaultValues;

  // Set default values on open
  useEffect(() => {
    if (open) {
      setFormData({
        name: defaultValues?.name || "",
        description: defaultValues?.description || "",
        category_id: defaultValues?.category || categoryId || "",
        price: defaultValues?.price || "",
        short_description: defaultValues?.short_description || "",
        sale_price: defaultValues?.sale_price || "",

        stock_quantity: defaultValues?.stock_quantity || "",
        status: defaultValues?.status || [],
        meta_description: defaultValues?.meta_description || "",
        meta_title: defaultValues?.meta_title || "",
        is_active: defaultValues?.is_active ?? false,
        is_bestseller: defaultValues?.is_bestseller ?? false,
        is_featured: defaultValues?.is_featured ?? false,
        is_on_sale: defaultValues?.is_on_sale ?? false,
      });
      setFiles([]);
      setPreviews([]);
      setError("");
    }
  }, [open, defaultValues, categoryId]);

  // Clean up previews
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, or WebP images are allowed.";
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `File too large. Max ${MAX_MB}MB.`;
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || !newFiles.length) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    let errorMsg = "";

    Array.from(newFiles)
      .slice(0, MAX_IMAGES - files.length)
      .forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errorMsg = error;
          return;
        }
        validFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      });

    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    if (files.length + validFiles.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    setError("");
    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
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

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      const removed = newPreviews.splice(index, 1);
      if (removed[0]?.startsWith("blob:")) {
        URL.revokeObjectURL(removed[0]);
      }
      return newPreviews;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // 👈 safely assert the type
    const { name, value, type } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category_id ||
      !formData.price
    ) {
      setError("All fields are required");
      return;
    }

    if (!isEditMode && files.length === 0) {
      setError("At least one image is required");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("category_id", formData.category_id);
      data.append("price", formData.price);
      data.append("short_description", formData.short_description);
      data.append("sale_price", formData.sale_price);
      data.append("stock_quantity", formData.stock_quantity);
      data.append("meta_description", formData.meta_description);
      data.append("meta_title", formData.meta_title);
      data.append("is_active", formData.is_active ? "true" : "false");
      data.append("is_bestseller", formData.is_bestseller ? "true" : "false");
      data.append("is_featured", formData.is_featured ? "true" : "false");
      data.append("is_on_sale", formData.is_on_sale ? "true" : "false");
      // formData.status.forEach((s, i) => {
      //   data.append(`status[${i}]`, s);
      // });

      files.forEach((file) => {
        data.append("images", file);
      });

      await onSubmit(data);
    } catch (err) {
      console.error("Error--check-->", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1f3a]  rounded-lg w-full max-w-md shadow-lg text-white relative max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-500"
        >
          ✖
        </button>

        <div className="overflow-y-auto max-h-[90vh] p-6 pt-10">
          <h3 className="text-xl font-semibold mb-4">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-white/80">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-white/80">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                required
              />
            </div>

            {/* Category ID */}
            <div>
              <label className="text-sm text-white/80">Category ID</label>
              <input
                type="text"
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm text-white/80">Price</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Sale Price</label>
              <input
                type="number"
                step="0.01"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Stock Quanity</label>
              <input
                type="number"
                step="0.01"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
                required
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="text-sm text-white/80">Short Description</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
              />
            </div>

            {/* Meta Title */}
            <div>
              <label className="text-sm text-white/80">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Meta Description</label>
              <input
                type="text"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-black/20 border border-white/10"
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <label className="text-sm text-white/80">Is Active</label>
            </div>

            {/* Is Bestseller */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_bestseller"
                checked={formData.is_bestseller}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <label className="text-sm text-white/80">Is Bestseller</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <label className="text-sm text-white/80">Is Featured</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_on_sale"
                checked={formData.is_on_sale}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <label className="text-sm text-white/80">Is OnSale</label>
            </div>

            {/* Image Upload (only for add mode) */}
            {!isEditMode && (
              <div>
                <label className="text-sm text-white/80">
                  Images ({files.length}/{MAX_IMAGES})
                </label>
                <label
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`mt-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed ${
                    files.length < MAX_IMAGES
                      ? "border-white/15 bg-white/5 cursor-pointer hover:bg-white/10"
                      : "border-gray-500/30 bg-gray-500/5 cursor-not-allowed"
                  } px-4 py-6 text-center transition`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    multiple
                    disabled={files.length >= MAX_IMAGES}
                  />
                  <div className="text-2xl">📷</div>
                  <div className="text-sm">
                    {files.length < MAX_IMAGES ? (
                      <>
                        Drag & drop images or{" "}
                        <span className="underline">browse</span>
                      </>
                    ) : (
                      "Maximum images reached"
                    )}
                  </div>
                  <div className="text-xs text-white/60">
                    PNG, JPG, or WebP up to {MAX_MB}MB each
                  </div>
                </label>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500/80 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
              >
                {submitting
                  ? isEditMode
                    ? "Saving..."
                    : "Uploading..."
                  : isEditMode
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
