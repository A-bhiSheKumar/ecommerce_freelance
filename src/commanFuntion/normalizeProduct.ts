import { NormalizedProduct, Product } from "../interface/CategoriesInterface";

export function normalizeProduct(p: Product, index: number): NormalizedProduct {
  const id =
    (typeof p.id === "string" && p.id) ||
    (typeof p._id === "string" && p._id) ||
    (typeof p.slug === "string" && p.slug) ||
    (typeof p.name === "string" && p.name) ||
    String(index);

  const name =
    typeof p.name === "string" && p.name.trim() ? p.name : "Untitled";
  const category =
    typeof p.category === "string" && p.category.trim()
      ? p.category
      : "Uncategorized";

  let priceNum: number | undefined;
  if (typeof p.price === "number") {
    priceNum = Number.isFinite(p.price) ? p.price : undefined;
  } else if (typeof p.price === "string") {
    const parsed = Number(p.price);
    priceNum = Number.isFinite(parsed) ? parsed : undefined;
  }

  let createdAtStr: string | undefined;
  if (p.createdAt instanceof Date) {
    createdAtStr = p.createdAt.toISOString();
  } else if (
    typeof p.createdAt === "string" ||
    typeof p.createdAt === "number"
  ) {
    const d = new Date(p.createdAt);
    if (!isNaN(d.getTime())) createdAtStr = d.toISOString();
  }

  return {
    id,
    name,
    category,
    price: priceNum,
    description: typeof p.description === "string" ? p.description : undefined,
    createdAt: createdAtStr,
  };
}
