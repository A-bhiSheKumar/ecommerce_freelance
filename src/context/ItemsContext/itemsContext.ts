import { createContext } from "react";
import { ItemContextProps } from "../../types/context/itemContext/itemContextProps.types";

const ItemContext = createContext({} as ItemContextProps);

export default ItemContext;
