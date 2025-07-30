import { request } from "../api";
import { headers } from "../../../config/config";

import { Payload } from "../../../types/api/api.types";
import { AUTHORIZATION } from "../../../constants/api/auth";

const { post } = request;

const initialRoute = "categories";

export const addCategory = async (payload: Payload) => {
  try {
    const endpoint = `${initialRoute}/add-category/`;
    const token = localStorage.getItem("access_token");
    const response = await post(endpoint, payload, {
      ...headers,
      [AUTHORIZATION.Authorization]: `${AUTHORIZATION.Bearer} ${token}`,
    });

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
