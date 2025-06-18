import type { RouteObject } from "react-router-dom";
import SurveyLayout from "../views/components/layouts/survey-layout";
import { lazy } from "react";
import SurveyCreatePage from "../views/pages/survey/survey-create-page";
import FilterSurveyPage from "../views/pages/survey/survey-filter-take-page";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteNoMargin from "./ProtectedRouteNoMargin";

const SurveyPage = lazy(() => import("../views/pages/survey/survey-take-page"));

export const surveyRoutes: RouteObject = {
  path: "/survey",
  element: <SurveyLayout />,
  children: [
    {
      path: "take-survey",
      element: (
        <ProtectedRouteNoMargin
          redirectUrl="manage/points"
          element={<SurveyPage />}
        />
      ),
    },
    {
      path: "filter-survey",
      element: (
        <ProtectedRoute
          redirectUrl="manage/points"
          element={<FilterSurveyPage />}
        />
      ),
    },
    { path: "create", element: <SurveyCreatePage /> },
  ],
};
