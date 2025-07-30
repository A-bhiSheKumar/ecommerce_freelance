import { request } from "../api";
import { headers } from "../../../config/config";
// import { MESSAGE } from "../../../constants/api/message";
// import {Payload} from '../../../types/api/api.types';

const { put } = request;

const initialRoute = "categories";

export const editCategory = async (id: number | string, payload: any) => {
  try {
    const endpoint = `${initialRoute}/edit-category/${id}/`;
    const response = await put(endpoint, payload, headers);

    if (response?.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update category.");
  } catch (error: unknown) {
    console.error("Edit category error:", error);
    throw error;
  }
};
