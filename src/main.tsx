import "./global.css";

// @ts-ignore: Vite knows how to handle this.
import("react-toastify/dist/ReactToastify.css");

import ReactDOM from "react-dom/client";
import App from "./components/App";

if (process.env.NODE_ENV === "development") {
    ReactDOM.createRoot(document.getElementById("app")!).render(<App />);
} else {
    ReactDOM.hydrateRoot(document.getElementById("app")!, <App />);
}
