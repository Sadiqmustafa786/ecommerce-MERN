import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import favicon from "./assets/favicon.png";

const faviconLink = document.querySelector("link[rel='icon']");
if (faviconLink) {
  faviconLink.href = favicon;
  faviconLink.type = "image/png";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
);
