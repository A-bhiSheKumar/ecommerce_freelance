/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "../../../config/config";
import { request } from "../api";

const { post } = request;

const initialRoute = "auth";

export const register = async (_payload: any) => {
  try {
    const payload = JSON.stringify(_payload);
    console.log("Payload for register----->>>", payload);

    const endpoint = `${initialRoute}/register/`;
    const response = await post(endpoint, payload, headers);

    console.log("Response--->>register", response);

    if (response?.status === 201) {
      return response;
    }
    // handle other status codes
    throw new Error(`Login failed with status: ${response?.status}`);
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};
