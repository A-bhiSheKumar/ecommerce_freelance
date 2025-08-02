import { request } from "../api";
import { headers } from "../../../config/config";
import { Payload } from "../../../types/api/api.types";
import { AUTHORIZATION } from "../../../constants/api/auth";

const { post } = request;

const initialRoute = "products";

export const addProduct = async (payload: Payload | FormData) => {
  try {
    const endpoint = `${initialRoute}/add-product/`;
    const token = localStorage.getItem("access_token");

    // Check if payload is FormData and remove Content-Type if true
    const customHeaders = {
      ...headers,
      [AUTHORIZATION.Authorization]: `${AUTHORIZATION.Bearer} ${token}`,
    };

    if (payload instanceof FormData) {
      delete (customHeaders as any)["Content-Type"];
    }

    const response = await post(endpoint, payload, customHeaders);

    if (response?.status === 201) {
      console.log("ResponseApi--->>>", response);
      return response.data;
    }
    throw new Error();
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};
