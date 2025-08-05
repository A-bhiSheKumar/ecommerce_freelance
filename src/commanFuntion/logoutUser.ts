export const logoutUser = () => {
  localStorage.clear();
  window.location.href = "/"; // or "/login" depending on your route
};
