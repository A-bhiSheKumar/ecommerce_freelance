import { request } from "../api";
import { headers } from "../../../config/config";
import { AUTHORIZATION } from "../../../constants/api/auth";
import { Payload } from "../../../types/api/api.types";
// import { MESSAGE } from "../../../constants/api/message";
// import {Payload} from '../../../types/api/api.types';

const { put } = request;

const initialRoute = "products";

export const updateImageDetails = async (payload: Payload) => {
  try {
    const endpoint = `${initialRoute}/image-details-update/`;
    const token = localStorage.getItem("access_token");
    const customHeaders = {
      ...headers,
      [AUTHORIZATION.Authorization]: `${AUTHORIZATION.Bearer} ${token}`,
    };
    const response = await put(endpoint, payload, customHeaders);
    if (response?.status === 200) {
      return response.data;
    }
    throw new Error("Failed to update category.");
  } catch (error: unknown) {
    console.error("Edit category error:", error);
    throw error;
  }
};
