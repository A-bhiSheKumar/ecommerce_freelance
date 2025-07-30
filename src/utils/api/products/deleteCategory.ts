import { request } from "../api";
import { headers } from "../../../config/config";
import { AUTHORIZATION } from "../../../constants/api/auth";

const { del } = request;

const initialRoute = "categories";

// Consider renaming to deleteCategory for clarity
export const deleteCategory = async (id: number | string) => {
  try {
    const endpoint = `${initialRoute}/delete-category/${id}/`;
    const token = localStorage.getItem("access_token");

    const response = await del(endpoint, {
      ...headers,
      [AUTHORIZATION.Authorization]: `${AUTHORIZATION.Bearer} ${token}`,
    });

    if (response?.status === 200) {
      return response.data;
    }

    throw new Error("Failed to delete category.");
  } catch (error: unknown) {
    console.error("Delete category error:", error);
    throw error;
  }
};
