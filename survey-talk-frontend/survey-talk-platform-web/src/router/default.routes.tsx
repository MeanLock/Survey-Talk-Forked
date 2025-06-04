import { Navigate, type RouteObject } from "react-router-dom";
import DefaultLayout from "../views/components/layouts/default-layout";
import { lazy } from "react";
import AboutUsPage from "../views/pages/about-us-page";

const HomePage = lazy(() => import("../views/pages/home-page"));

export const defaultRoutes: RouteObject = {
  path: "/",
  element: <DefaultLayout />,
  children: [
    { index: true, element: <Navigate to="home" replace /> }, // Redirect from "/" to "/home"
    { path: "home", element: <HomePage /> }, // Route for "/home"
    { path: "about-us", element: <AboutUsPage /> },
    // route con khác...
  ],
};
