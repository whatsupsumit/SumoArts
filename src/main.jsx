import { createRoot } from "react-dom/client";
import Routing from "./Routes.jsx";
import "./index.css";

createRoot(document.getElementById("app-container")).render(<Routing />);
