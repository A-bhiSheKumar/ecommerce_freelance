import { request } from "../api";
import { headers } from "../../../config/config";
import { AUTHORIZATION } from "../../../constants/api/auth";
import { Payload } from "../../../types/api/api.types";
// import { MESSAGE } from "../../../constants/api/message";
// import {Payload} from '../../../types/api/api.types';

const { patch } = request;

const initialRoute = "products";

export const editProduct = async (
  id: number | string,
  payload: Payload | FormData
) => {
  try {
    const endpoint = `${initialRoute}/edit-product/${id}/`;
    const token = localStorage.getItem("access_token");
    const customHeaders = {
      ...headers,
      [AUTHORIZATION.Authorization]: `${AUTHORIZATION.Bearer} ${token}`,
    };

    if (payload instanceof FormData) {
      delete (customHeaders as any)["Content-Type"];
    }
    const response = await patch(endpoint, payload, customHeaders);
    if (response?.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update category.");
  } catch (error: unknown) {
    console.error("Edit category error:", error);
    throw error;
  }
};
