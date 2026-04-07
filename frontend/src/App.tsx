import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoPage from "./components/TodoPage";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

<<<<<<< HEAD

=======
>>>>>>> 24093ea5c0a2ca47dba0157f216cc3b270aee77d
function App() {
  return (
    <Routes>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          localStorage.getItem("token")
            ? <Navigate to="/todos" />
            : <Navigate to="/login" />
        }
      />

      {/* ✅ Direct components */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Todo */}
      <Route
        path="/todos"
        element={
          <PrivateRoute>
            <TodoPage />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;