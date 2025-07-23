import { login } from "./auth/login";
import { register } from "./auth/register";
import {
  addCustomerInfo,
  addPendingDueNote,
  getCustomerWithItemsDetails,
  getItemsDetails,
} from "./billing/billing.api";

export const api = {
  auth: {
    login: login,
    register: register,
  },
  userInfo: {
    addCustomerInfo: addCustomerInfo,
  },
  itemsInfo: {
    getItemsDetails: getItemsDetails,
    getCustomerWithItemsDetails: getCustomerWithItemsDetails,
  },
  billingInfo: {
    addPendingDueNote: addPendingDueNote,
  },
};
