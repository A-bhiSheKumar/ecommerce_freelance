import { useEffect, useMemo, useState } from "react";
import { api } from "../../utils/api";
import {
  NormalizedProduct,
  Product,
} from "../../interface/CategoriesInterface";
import CategoryForm, { CategoryPayload } from "../../shared/CategoriesForm";
import toast from "react-hot-toast";
import { SkeletonCard } from "../../shared/SkeletonCard";
import { normalizeProduct } from "../../commanFuntion/normalizeProduct";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center text-center py-20">
    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <span className="text-xl">🛍️</span>
    </div>
    <h3 className="text-xl font-semibold">No products found</h3>
    <p className="text-sm text-white/60 mt-1 max-w-md">
      You haven’t added any products yet. Create your first product to get
      started.
    </p>
    <button
      onClick={onAdd}
      className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
    >
      <span className="text-sm font-medium">+ Add Product</span>
    </button>
  </div>
);

const ProductDetails: React.FC = () => {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] =
    useState<NormalizedProduct | null>(null);

  const [fetchError, setFetchError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "price-asc" | "price-desc" | "name" | "newest"
  >("newest");
  const [openForm, setOpenForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setFetchError("");
      setLoading(true);
      const response = (await api.categories.getCategoryList()) as unknown;
      const rawList: Product[] = Array.isArray(response)
        ? (response as Product[])
        : [];
      const normalized = rawList.map(normalizeProduct);
      setProducts(normalized);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setFetchError("Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  const handleCreateCategory = async (payload: CategoryPayload) => {
    try {
      const response = await api.categories.addCategory(payload);
      console.log("response--->>>", response);
      if (response) {
        toast.success("Category added successfully! 🎉");
        // Refresh list and close modal
        await fetchProducts();
        setOpenForm(false);
      }
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
      console.error(error);
    }
  };
  const filtered = useMemo<NormalizedProduct[]>(() => {
    const q = search.trim().toLowerCase();

    let list = products.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category.toLowerCase();
      return q === "" || name.includes(q) || cat.includes(q);
    });

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        list = [...list].sort((a, b) => {
          const A = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const B = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return B - A;
        });
        break;
    }

    return list;
  }, [products, search, sortBy]);

  const handleEditCategory = async (payload: CategoryPayload) => {
    if (!editingCategory) return;

    try {
      const response = await api.categories.editCategory(
        editingCategory.id,
        payload
      );
      if (response) {
        toast.success("Category updated successfully!");
        await fetchProducts();
        setOpenForm(false);
        setEditingCategory(null);
      }
    } catch (error) {
      toast.error("Failed to update category.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0e22] to-[#0f1a4d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Category</h1>
            <p className="text-sm text-white/60">
              Manage your catalog and keep everything up to date.
            </p>
          </div>
          <button
            onClick={() => setOpenForm(true)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition"
          >
            <span className="text-sm font-medium">+ Add Category</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-80">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or category…"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="hidden md:block text-sm text-white/60">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "price-asc"
                      | "price-desc"
                      | "name"
                      | "newest"
                  )
                }
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="newest">Sort: Newest</option>
                <option value="name">Sort: Name</option>
                <option value="price-asc">Sort: Price (Low → High)</option>
                <option value="price-desc">Sort: Price (High → Low)</option>
              </select>
              <div className="md:hidden text-sm text-white/60">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* States */}
        {fetchError && !loading && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm">
              {fetchError}{" "}
              <button
                onClick={fetchProducts}
                className="underline underline-offset-2 hover:no-underline"
              >
                Retry
              </button>
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => {
              const price =
                typeof product.price === "number"
                  ? currency.format(product.price)
                  : null;

              return (
                <div
                  key={product.id}
                  className="group rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition shadow-sm hover:shadow-md overflow-hidden"
                >
                  {/* Image / Placeholder */}
                  <div className="h-40 w-full bg-gradient-to-br from-white/10 to-white/0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-lg font-semibold">
                      {product.name.slice(0, 1).toUpperCase()}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-tight line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(product);
                            setOpenForm(true);
                          }}
                          className="text-white/60 hover:text-white/90"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            // Optionally add delete logic here
                            toast("Delete logic here");
                          }}
                          className="text-white/60 hover:text-red-400"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {product.description && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {price && (
                      <p className="mt-3 text-sm font-semibold text-blue-300">
                        {price}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !fetchError && <EmptyState onAdd={() => setOpenForm(true)} />
        )}
      </div>

      {/* Modal */}
      <CategoryForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingCategory(null); // clear after close
        }}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
};

export default ProductDetails;
