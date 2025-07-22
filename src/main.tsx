import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ItemsContextProvider from "./context/ItemsContext/Provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ItemsContextProvider>
      <App />
    </ItemsContextProvider>
  </StrictMode>
);
