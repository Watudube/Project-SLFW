// Dependencies:
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages:
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";

// Components:
import PageTemplate from "./components/PageTemplate";
import ProtectedRoute from "./components/ProtectedRoute";

// Contexts:
import { UserProvider } from "./contexts/UserContext";

// Styles:
import "./App.css";

/**
 * Main Application Component
 *
 * Root component that sets up routing, user context, and page structure.
 * Provides user authentication context to all child components.
 *
 * @returns {JSX.Element} Main application component.
 */
export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PageTemplate />}>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/game"
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
