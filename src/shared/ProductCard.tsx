import { Product } from "../interface/ProductInterface";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-sm space-y-2 hover:shadow-md transition">
      <h1 className="text-white text-xl font-bold">{product.name}</h1>
      <p className="text-white/80 text-sm">{product.description}</p>

      {product.short_description && (
        <p className="text-white/60 text-sm">
          <strong>Short:</strong> {product.short_description}
        </p>
      )}

      <div className="text-white/80 text-sm grid grid-cols-2 gap-2">
        <p>
          <strong>Price:</strong> ₹{product.price}
        </p>
        {product.sale_price && (
          <p>
            <strong>Sale:</strong> ₹{product.sale_price}
          </p>
        )}
        {product.stock_quantity && (
          <p>
            <strong>Stock:</strong> {product.stock_quantity}
          </p>
        )}
        {product.category?.name && (
          <p>
            <strong>Category:</strong> {product.category.name}
          </p>
        )}
        <p>
          <strong>SKU:</strong> {product.sku}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs mt-2">
        {product.is_active && (
          <span className="bg-green-600 text-white px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
        {product.is_bestseller && (
          <span className="bg-yellow-600 text-white px-2 py-0.5 rounded-full">
            Bestseller
          </span>
        )}
        {product.is_featured && (
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
        {product.is_on_sale && (
          <span className="bg-pink-600 text-white px-2 py-0.5 rounded-full">
            On Sale
          </span>
        )}
      </div>

      <button
        onClick={() => onEdit(product)}
        className="mt-4 bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20"
      >
        Edit
      </button>
    </div>
  );
};

export default ProductCard;
