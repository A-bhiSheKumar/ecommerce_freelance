import { login } from "./auth/login";
import { register } from "./auth/register";
import { addCategory } from "./categories/addCategory";
import { deleteCategory } from "./categories/deleteCategory";
import { editCategory } from "./categories/editCategory";
import { getCategoryList } from "./categories/getCategory";
import { addProduct } from "./products/addProducts";
import { deleteProduct } from "./products/deleteProducts";
import { editProduct } from "./products/editProducts";
import { getProductList } from "./products/getProductsList";
import { updateImageDetails } from "./products/imageDetailsUpdate";

export const api = {
  auth: {
    login: login,
    register: register,
  },
  categories: {
    getCategoryList: getCategoryList,
    addCategory: addCategory,
    editCategory: editCategory,
    deleteCategory: deleteCategory,
  },
  product: {
    getProductList: getProductList,
    deleteProduct: deleteProduct,
    editProduct: editProduct,
    addProduct: addProduct,
    updateImageDetails: updateImageDetails,
  },
};
