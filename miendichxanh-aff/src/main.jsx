import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import 'react-texty/styles.css'
import "./index.css";

import { EzsSplashScreenProvider } from "./app/_ezs/core/EzsSplashScreen";
import { AuthInit, AuthProvider } from "./app/_ezs/core/Auth";
import AppRoutes from "./app/routing/AppRoutes";
import moment from "moment";
import 'moment/dist/locale/vi'

moment.locale("vi");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <EzsSplashScreenProvider>
      <AuthProvider>
        <AuthInit>
          <AppRoutes />
        </AuthInit>
      </AuthProvider>
    </EzsSplashScreenProvider>
  </QueryClientProvider>
);
