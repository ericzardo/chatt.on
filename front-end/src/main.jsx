import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "src/lib/queryClient";

import router from "./routes";

import "./index.css";

const theme = window.localStorage.getItem("theme") || "dark";
document.documentElement.classList.toggle("dark", theme === "dark");
document.body.classList.add(theme === "dark" ? "bg-zinc-950" : "bg-zinc-50");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> 
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
