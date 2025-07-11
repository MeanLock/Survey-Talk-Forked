import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./index.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { persistor, store } from "./redux/store.ts";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Tanstack
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/query.ts";

ModuleRegistry.registerModules([AllCommunityModule]);
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <GoogleOAuthProvider
        clientId={
          "284467404982-b4j9dvoani124mce15l0mmtfucil72g0.apps.googleusercontent.com"
        }
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
