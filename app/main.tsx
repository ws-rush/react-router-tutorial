import "./index.css";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "virtual:routes";

export const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});

createRoot(document.getElementById("app")!).render(
  // @ts-expect-error fix
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
