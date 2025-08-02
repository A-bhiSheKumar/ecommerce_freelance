import { NormalizedProduct, ICategory } from "../interface/CategoriesInterface";

export function normalizeProduct(
  p: ICategory,
  index: number
): NormalizedProduct {
  const id =
    (typeof p.id === "number" || typeof p.id === "string"
      ? String(p.id)
      : null) ||
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
    image: p.image || "/placeholder.jpg", // fallback
    description: typeof p.description === "string" ? p.description : undefined,
    createdAt: createdAtStr,
  };
}
