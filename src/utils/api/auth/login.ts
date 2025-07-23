/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "../../../config/config";
import { request } from "../api";

const { post } = request;

const initialRoute = "auth";

export const login = async (_payload: any) => {
  try {
    const payload = JSON.stringify(_payload);
    console.log("Payload for login----->>>", payload);

    const endpoint = `${initialRoute}/login/`;
    const response = await post(endpoint, payload, headers);

    console.log("Response--->>forthelogin", response);

    if (response?.status === 200) {
      return response.data;
    }

    // handle other status codes
    throw new Error(`Login failed with status: ${response?.status}`);
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};
