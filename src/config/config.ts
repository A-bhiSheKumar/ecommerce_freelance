import Cookies from "js-cookie";

const csrftoken = Cookies.get("csrftoken");

export const url = "https://sspp-backend-1yf5.onrender.com";
// zip -r app.zip dist package.json package-lock.json node_modules
// export const url = "http://localhost:4000";
// export const url = "https://sundarban-resort-node-server.onrender.com";
// export const url = "https://d3630964imf05y.cloudfront.net";
export const port = "4000";
export const version = "v1";

export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": csrftoken,
};
