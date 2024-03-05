import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./context/PrivateRoute";
import { UserProvider } from "./context/UserContext";
export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes (accessible without authentication) */}
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes (require authentication) */}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>

            {/* Default route (redirects to login if not authenticated) */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
}
