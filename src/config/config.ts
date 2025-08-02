import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");

export const url = "https://kalida.duckdns.org";
// zip -r app.zip dist package.json package-lock.json node_modules
export const port = "4000";
export const version = "v1";

export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": csrftoken,
};
