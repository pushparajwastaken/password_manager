import { createBrowserRouter } from "react-router-dom";
import SignUp from "./Components/SignUp/SignUp";
import { App } from "./App";
import React from "react";
import { SignIn } from "./Components/SignIn/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
]);
export default router;
