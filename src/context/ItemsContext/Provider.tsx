/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useReducer } from "react";
import { ContextProviderProps } from "../context.types";

import reducer from "./reducer";
import ItemContext from "./itemsContext";
import { Store } from "../../types/context/itemContext/store.types";
import actions from "./actions";

const getUserFromLocalStorage = () => {
  const items = localStorage.getItem("@items");
  return items ? JSON.parse(items) : null;
};

const initialState: Store = {
  items: getUserFromLocalStorage(),
};

const ItemsContextProvider = ({ children }: ContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setItems = useCallback(
    (items: any | null) => {
      dispatch({ type: actions.SET_ITEMS, payload: { ...state, items } });
      if (items) {
        localStorage.setItem("@items", JSON.stringify(items));
      } else {
        localStorage.removeItem("@items");
      }
    },
    [state]
  );

  const value = {
    items: state.items,
    setItems,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export default ItemsContextProvider;
