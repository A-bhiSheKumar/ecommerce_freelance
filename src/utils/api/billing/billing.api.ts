/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "../api";
import { headers } from "../../../config/config";
import { MESSAGE } from "../../../constants/api/message";
import { Payload } from "../../../types/api/api.types";

const { post, get } = request;

const initialRoute = "customer";

export const addCustomerInfo = async (payload: Payload) => {
  try {
    const endpoint = `${initialRoute}/add-customer-info`;
    const response = await post(endpoint, payload, {
      ...headers,
      "Content-Type": "multipart/form-data",
    });
    if (response) {
      const {
        data: { message },
      } = response;
      if (message === MESSAGE.post.succ) {
        const {
          data: { result },
        } = response;
        return result;
      }
    }
    throw new Error();
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};

// export const getItemsDetails = async (payload: Payload) => {
//   try {
//     const endpoint = `${initialRoute}/get-items-info`;
//     const response = await post(endpoint, payload, { ...headers });

//     if (response) {
//       const {
//         data: { message, items, newItem },
//       } = response;

//       if (message === MESSAGE.post.succ || message === "Matching items found") {
//         return items || [newItem]; // Ensure consistent return type (array)
//       }
//     }

//     throw new Error("Unexpected response");
//   } catch (error) {
//     console.log("Error in getItemsDetails API call:", error);
//     throw error;
//   }
// };

export const getItemsDetails = async (payload: { name: string }) => {
  try {
    const endpoint = `${initialRoute}/get-items-info?name=${encodeURIComponent(
      payload.name
    )}`;
    const response = await get(endpoint, { ...headers });

    if (response?.data) {
      const { message, items } = response.data;

      if (message === MESSAGE.get.succ) {
        return items;
      }
    }

    throw new Error("Invalid response structure");
  } catch (error: any) {
    console.error("Error fetching item details:", error?.message || error);
    throw error;
  }
};

export const addItemDetails = async (payload: { name: string }) => {
  try {
    const endpoint = `${initialRoute}/add-items-info`;
    const response = await post(endpoint, payload, {
      ...headers,
    });

    if (response?.data) {
      const { message, newItem } = response.data;

      if (message === MESSAGE.post.succ) {
        return newItem;
      }
    }

    throw new Error("Invalid response structure");
  } catch (error: any) {
    console.error("Error adding item details:", error?.message || error);
    throw error;
  }
};

export const addPendingDueNote = async (payload: Payload) => {
  try {
    const endpoint = `${initialRoute}/add-customer-dues-note`;
    const response = await post(endpoint, payload, {
      ...headers,
    });
    if (response) {
      const {
        data: { message },
      } = response;
      if (message === MESSAGE.post.succ) {
        const {
          data: { result },
        } = response;
        return result;
      }
    }
    throw new Error();
  } catch (error: any) {
    console.error("Error adding item details:", error?.message || error);
    throw error;
  }
};

export const getCustomerWithItemsDetails = async (payload: {
  phone_number: string;
}) => {
  try {
    const endpoint = `${initialRoute}/get-customer-with-items?phone_number=${encodeURIComponent(
      payload.phone_number
    )}`;
    const response = await get(endpoint, { ...headers });

    if (response) {
      const {
        data: { message },
      } = response;
      if (message === MESSAGE.get.succ) {
        const {
          data: { result },
        } = response;
        return result;
      }
    }
    throw new Error("Invalid response structure");
  } catch (error: any) {
    console.error("Error fetching item details:", error?.message || error);
    throw error;
  }
};
