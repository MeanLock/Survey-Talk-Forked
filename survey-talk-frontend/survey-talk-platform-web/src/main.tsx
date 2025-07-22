import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { persistor, store } from "./redux/store";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { ErrorBoundary } from "./views/components/layouts/error-boundary/ErrorBoundary";

// Tanstack
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/query";

ModuleRegistry.registerModules([AllCommunityModule]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <GoogleOAuthProvider
            clientId={
              "41387618387-k6pvfem2g06avjs3a9ri7k4g5uapskjt.apps.googleusercontent.com"
            }
          >
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </GoogleOAuthProvider>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </StrictMode>
);
