import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import BootScreen from "./components/BootScreen";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }) {
  const role = localStorage.getItem("turningPoint_role");
  if (!role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/boot"
            element={
              <ProtectedRoute>
                <BootScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
