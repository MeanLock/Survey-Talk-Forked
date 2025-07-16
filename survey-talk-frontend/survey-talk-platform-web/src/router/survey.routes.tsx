import type { RouteObject } from "react-router-dom";
import SurveyLayout from "../views/components/layouts/survey-layout";
import { lazy } from "react";
import SurveyCreatePage from "../views/pages/survey/survey-create-page";
import FilterSurveyPage from "../views/pages/survey/survey-filter-take-page";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteNoMargin from "./ProtectedRouteNoMargin";
import { EndSurveyCustomer, SurveyCustomer } from "@/views/pages/survey/routes";

const SurveyPage = lazy(() => import("../views/pages/survey/survey-take-page"));

export const surveyRoutes: RouteObject = {
  path: "/survey",
  element: <SurveyLayout />,
  children: [
    {
      path: "take-survey",
      element: (
        <ProtectedRouteNoMargin
          redirectUrl="survey/take-survey"
          element={<SurveyPage />}
        />
      ),
    },
    {
      path: "filter-survey",
      element: (
        <ProtectedRouteNoMargin
          redirectUrl="survey/filter-survey"
          element={<FilterSurveyPage />}
        />
      ),
    },
    { path: "new", element: <SurveyCreatePage /> },
    { path: ":id/editing", element: <SurveyCreatePage /> },
    { path: ":id/taking", element: <SurveyCustomer /> },
    { path: ":id/end", element: <EndSurveyCustomer /> },
  ],
};
