import { ItemAction } from "../../types/context/itemContext/itemAction.types";
import { Store } from "../../types/context/itemContext/store.types";

import actions from "./actions";

const reducer = (state: Store, action: ItemAction) => {
  switch (action.type) {
    case actions.SET_ITEMS: {
      return {
        ...state,
        items: action.payload.items,
      };
    }
    default:
      throw new Error("Unexpected action: Auth Context");
  }
};

export default reducer;
