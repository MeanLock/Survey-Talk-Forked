import type { RouteObject } from "react-router-dom";
import AuthLayout from "../views/components/layouts/auth-layout";
import { lazy } from "react";
import ForgotPassword from "../views/pages/forgot-password-page";
import ResetPassword from "../views/pages/reset-password-page";
import AccountVerification from "@/views/pages/account-verification-page";

const LoginPage = lazy(() => import("../views/pages/login-page"));
const RegisterPage = lazy(() => import("../views/pages/register-page"));

export const authRoutes: RouteObject = {
  path: "/",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> },
    { path: "/forgot-password/:step", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/account-verification", element: <AccountVerification />}
  ],
};
