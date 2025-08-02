import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../utils/api";
import { Product } from "../../interface/ProductInterface";

import toast from "react-hot-toast";
import ProductForm from "../../shared/ProductForm";

const ProductDetails = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryName = params.get("categoryName");
  const categoryId = params.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [modalImages, setModalImages] = useState<
    | {
        id: number;
        image: string;
        display_order: number;
        alt_text: string;
        is_main: boolean;
      }[]
    | null
  >(null);

  const fetchByCategory = useCallback(async () => {
    try {
      setLoading(true);
      const allProducts = await api.product.getProductList(categoryId || "");
      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to load products by category:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchByCategory();
  }, [categoryName, fetchByCategory]);

  const handleDelete = async (productId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await api.product.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id.toString() !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product. Try again.");
    }
  };

  return (
    <>
      <div className="p-6 text-white relative">
        <ProductForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null); // reset edit mode on close
          }}
          defaultValues={
            editingProduct
              ? {
                  name: editingProduct.name,
                  description: editingProduct.description,
                  category: categoryId ?? "",
                  price: editingProduct.price.toString(),
                }
              : undefined
          }
          onSubmit={async (formData) => {
            try {
              if (editingProduct) {
                // Update case
                const updated = await api.product.editProduct(
                  editingProduct.id,
                  formData
                );
                setProducts((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                );
                toast.success("Product updated successfully!");
                await fetchByCategory();
              } else {
                // Add case
                const response = await api.product.addProduct(formData);
                setProducts((prev) => [...prev, response]);
                toast.success("Product added successfully!");
                await fetchByCategory();
              }
              setIsFormOpen(false);
              setEditingProduct(null);
            } catch (error) {
              console.error("Error submitting product:", error);
              toast.error("Failed to submit product.");
            }
          }}
        />

        {/* Header + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-2">
            Products in Category:{" "}
            <span className="text-yellow-400">{categoryName}</span>
          </h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-white/60">No products found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#1c1f3a] rounded-xl shadow-md p-4 border border-white/10 hover:shadow-lg transition-all relative"
              >
                {/* Bottom-right action buttons */}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct({ ...product, images: [] }); // strip out images
                      setIsFormOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit Product"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(product.id.toString())}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Product"
                  >
                    🗑️
                  </button>
                </div>

                {product.images?.[0]?.image && (
                  <div className="relative">
                    <img
                      src={product.images[0].image}
                      alt={product.name}
                      className="w-full h-48 object-contain bg-white/10 rounded-lg mb-4"
                    />

                    {product.images.length > 1 && (
                      <>
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {product.images.length} Images
                        </div>
                        <button
                          onClick={() =>
                            setModalImages(
                              product.images.map((img) => ({
                                id: img.id,
                                image: img.image,
                                display_order: img.display_order,
                                alt_text: img.alt_text,
                                is_main: img.is_main,
                              }))
                            )
                          }
                          className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 rounded text-white"
                        >
                          View All
                        </button>
                      </>
                    )}
                  </div>
                )}

                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

                <div className="flex flex-wrap gap-2 mb-2 text-sm">
                  {product.is_on_sale && (
                    <span className="bg-red-600 px-2 py-0.5 rounded-full text-white">
                      Sale
                    </span>
                  )}
                  {product.is_bestseller && (
                    <span className="bg-green-600 px-2 py-0.5 rounded-full text-white">
                      Bestseller
                    </span>
                  )}
                  {product.stock_quantity === 0 && (
                    <span className="bg-gray-500 px-2 py-0.5 rounded-full text-white">
                      Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-xl font-bold text-yellow-300 mb-1">
                  ${product.current_price}
                </p>
                {product.sale_price && (
                  <p className="text-sm line-through text-white/50">
                    Original: ${product.price}
                  </p>
                )}
                <p className="text-sm text-white/60">
                  SKU: <span className="text-white">{product.sku}</span>
                </p>
                <p className="text-sm text-white/60 mb-2">
                  Category:{" "}
                  <span className="text-white">{product.category?.name}</span>
                </p>

                <p className="text-sm text-white/80">{product.description}</p>

                <p className="text-xs text-white/40 mt-4">
                  Updated at:{" "}
                  {new Date(product.updated_at).toLocaleDateString("en-GB")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalImages && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1c1f3a] p-6 rounded-lg max-w-4xl w-full overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setModalImages(null)}
              className="absolute top-2 right-2 text-white text-2xl hover:text-red-400"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-white">
              Reorder Images{" "}
              <span className="text-yellow-400">(drag & drop to arrange)</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {modalImages
                .sort((a, b) => a.display_order - b.display_order)
                .map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("dragIndex", index.toString())
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const fromIndex = Number(
                        e.dataTransfer.getData("dragIndex")
                      );
                      const toIndex = index;
                      if (fromIndex === toIndex) return;

                      setModalImages((prev) => {
                        if (!prev) return prev;
                        const updated = [...prev];
                        const [moved] = updated.splice(fromIndex, 1);
                        updated.splice(toIndex, 0, moved);

                        return updated.map((img, idx) => ({
                          ...img,
                          display_order: idx,
                        }));
                      });
                    }}
                    className="bg-white/10 rounded p-2 text-center cursor-pointer"
                  >
                    <img
                      src={img.image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-40 object-contain mb-2 rounded"
                    />

                    <input
                      type="text"
                      value={img.alt_text}
                      onChange={(e) =>
                        setModalImages(
                          (prev) =>
                            prev?.map((imgObj, i) =>
                              i === index
                                ? { ...imgObj, alt_text: e.target.value }
                                : imgObj
                            ) || null
                        )
                      }
                      placeholder="Alt text"
                      className="w-full text-sm px-2 py-1 rounded mb-2 text-black"
                    />

                    <label className="flex items-center justify-center gap-2 text-sm text-white">
                      <input
                        type="radio"
                        name="mainImage"
                        checked={img.is_main}
                        onChange={() =>
                          setModalImages(
                            (prev) =>
                              prev?.map((imgObj) => ({
                                ...imgObj,
                                is_main: imgObj.id === img.id,
                              })) || null
                          )
                        }
                      />
                      Set as Main Image
                    </label>

                    <p className="text-xs text-white/60 mt-1">
                      Display Order: {img.display_order}
                    </p>
                  </div>
                ))}
            </div>

            <button
              onClick={async () => {
                try {
                  await api.product.updateImageDetails(
                    modalImages.map(
                      ({ id, display_order, alt_text, is_main }) => ({
                        id,
                        display_order,
                        alt_text,
                        is_main,
                      })
                    )
                  );
                  toast.success("Image order saved successfully!");
                  setModalImages(null);
                } catch (error) {
                  console.error("Failed to update image order", error);
                  toast.error("Failed to update image order.");
                }
              }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
