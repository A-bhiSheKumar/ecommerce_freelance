import { login } from "./auth/login";
import { register } from "./auth/register";
import { addCategory } from "./products/addCategory";
import { editCategory } from "./products/editCategory";
import { getCategoryList } from "./products/getCategory";

export const api = {
  auth: {
    login: login,
    register: register,
  },
  categories: {
    getCategoryList: getCategoryList,
    addCategory: addCategory,
    editCategory: editCategory,
  },
};
