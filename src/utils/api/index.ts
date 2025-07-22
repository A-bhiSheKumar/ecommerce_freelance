import {
  addCustomerInfo,
  addPendingDueNote,
  getCustomerWithItemsDetails,
  getItemsDetails,
} from "./billing/billing.api";

export const api = {
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
