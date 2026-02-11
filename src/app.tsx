import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "@/components/protected-page";
import { RouterTweaks } from "@/components/router-tweaks";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-provider";
import QueryProvider from "@/contexts/query-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import Destinations from "@/pages/destinations";
import Devices from "@/pages/devices";
import Gateways from "@/pages/gateways";
import LoginPage from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import Profiles from "@/pages/profiles";
import Rules from "@/pages/rules";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLayoutEffect } from "react";
import AppLayout from "./layouts/app";

function App() {
  useLayoutEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: "ease-in-out",
      offset: -200,
    });
    return () => {
      AOS.refreshHard();
    };
  }, []);
  return (
    <Router>
      <AuthProvider>
        <QueryProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <TooltipProvider>
              <AllRoutes />
              <Toaster richColors />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </AuthProvider>
      <RouterTweaks />
    </Router>
  );
}

function AllRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute visitCondition={!!user} route="/auth/login">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={"App"} />
        <Route path="gateways" element={<Gateways />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="devices" element={<Devices />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="rules" element={<Rules />} />
      </Route>
      <Route
        path="/auth"
        element={
          <ProtectedRoute visitCondition={!user} route="/">
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
