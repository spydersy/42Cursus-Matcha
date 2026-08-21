import { Route, Routes } from "react-router-dom";

import GuestRoute from "./components/GuestRoute";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

/**
 * Route table. Feature tasks replace <Placeholder> with the real page
 * (see ROADMAP.md for the task owning each route).
 */
export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Guest-only routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute>
                <ResetPassword />
              </GuestRoute>
            }
          />

          {/* Protected feature routes */}
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <Placeholder title="Browse" task="T11–T12" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Placeholder title="Search" task="T13–T14" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Placeholder title="Chat" task="T17–T18" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Placeholder title="Profile" task="T7–T8" />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
