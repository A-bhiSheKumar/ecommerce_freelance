import { login } from "./auth/login";
import { register } from "./auth/register";
import { addCategory } from "./products/addProduct";
import { getCategoryList } from "./products/getProducts";

export const api = {
  auth: {
    login: login,
    register: register,
  },
  categories: {
    getCategoryList: getCategoryList,
    addCategory: addCategory,
  },
};
