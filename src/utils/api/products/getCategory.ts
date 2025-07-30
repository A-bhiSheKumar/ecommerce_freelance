import { request } from "../api";
import { headers } from "../../../config/config";
// import { MESSAGE } from "../../../constants/api/message";
// import {Payload} from '../../../types/api/api.types';

const { get } = request;

const initialRoute = "categories";

export const getCategoryList = async () => {
  try {
    const endpoint = `${initialRoute}/all-categories/`;
    const response = await get(endpoint, {
      ...headers,
    });
    if (response?.status === 200) {
      return response.data;
    }
    throw new Error();
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};
