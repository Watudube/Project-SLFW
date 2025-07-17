// Importing Dependencies:
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importing Page Components:
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";

// Importing Components:
import PageTemplate from "./components/PageTemplate";
import ProtectedRoute from "./components/ProtectedRoute";

// Importing Contexts:
import { UserProvider } from "./contexts/UserContext";

// Importing Styles:
import "./App.css";

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
