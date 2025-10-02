import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Artboard } from "./screens/Artboard/Artboard";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Artboard />
  </StrictMode>,
);
