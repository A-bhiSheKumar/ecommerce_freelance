import { request } from "../api";
import { headers } from "../../../config/config";
import { AUTHORIZATION } from "../../../constants/api/auth";

const { del } = request;

const initialRoute = "products";

export const deleteProduct = async (productId: string) => {
  try {
    const endpoint = `${initialRoute}/delete-product/${encodeURIComponent(
      productId
    )}/`;

    const token = localStorage.getItem("access_token");
    const response = await del(endpoint, {
      ...headers,
      [AUTHORIZATION.Authorization]: `${AUTHORIZATION.Bearer} ${token}`,
    });

    if (response?.status === 200) {
      return response.data;
    }

    throw new Error("Failed to fetch product list");
  } catch (error: unknown) {
    console.error("API error:", error);
    throw error;
  }
};
