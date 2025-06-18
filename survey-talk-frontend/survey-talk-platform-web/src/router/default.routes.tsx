import { Navigate, type RouteObject } from "react-router-dom";
import DefaultLayout from "../views/components/layouts/default-layout";
import { lazy } from "react";
import AboutUsPage from "../views/pages/about-us-page";
import ProtectedRoute from "./ProtectedRoute";
import AvailableSurveys from "../views/pages/available-surveys-page";

import TransactionsPage from "../views/pages/user/transactions-page";
import DataMarketPage from "../views/pages/data-market-page";
import ManageDataMarketPage from "../views/pages/manage/manage-data-markets";
import ManageSurveyPage from "../views/pages/manage/mange-surveys";
import ManagePointPage from "../views/pages/manage/manage-points";
import ProfilePage from "../views/pages/user/profile-page";
import LevelPage from "../views/pages/user/level-page";
import PaymentResultPage from "../views/pages/user/payment-result-page";

const HomePage = lazy(() => import("../views/pages/home-page"));

export const defaultRoutes: RouteObject = {
  path: "/",
  element: <DefaultLayout />,
  children: [
    // PUBLIC ROUTES
    { index: true, element: <Navigate to="home" replace /> }, // Redirect from "/" to "/home"
    { path: "home", element: <HomePage /> }, // Route for "/home"
    { path: "about-us", element: <AboutUsPage /> },

    // LOGIN REQUIRED ROUTES
    // KHẢO SÁT
    {
      path: "available-surveys",
      element: (
        <ProtectedRoute
          redirectUrl="available-surveys"
          element={<AvailableSurveys />}
        />
      ),
    },

    // DATA MARKET
    {
      path: "data-market",
      element: (
        <ProtectedRoute
          redirectUrl="data-market"
          element={<DataMarketPage />}
        />
      ),
    },

    // MANAGE
    {
      path: "manage/surveys",
      element: (
        <ProtectedRoute
          redirectUrl="manage/surveys"
          element={<ManageSurveyPage />}
        />
      ),
    },
    {
      path: "manage/points",
      element: (
        <ProtectedRoute
          redirectUrl="manage/points"
          element={<ManagePointPage />}
        />
      ),
    },
    {
      path: "manage/data-market",
      element: (
        <ProtectedRoute
          redirectUrl="manage/data-market"
          element={<ManageDataMarketPage />}
        />
      ),
    },

    // USER
    {
      path: "user/profile",
      element: (
        <ProtectedRoute redirectUrl="user/profile" element={<ProfilePage />} />
      ),
    },
    {
      path: "user/level",
      element: (
        <ProtectedRoute redirectUrl="user/level" element={<LevelPage />} />
      ),
    },
    {
      path: "user/transactions",
      element: (
        <ProtectedRoute
          redirectUrl="user/transactions"
          element={<TransactionsPage />}
        />
      ),
    },
    {
      path: "user/transactions/payment-result",
      element: (
        <ProtectedRoute
          redirectUrl="user/transactions"
          element={<PaymentResultPage />}
        />
      ),
    },
  ],
};
