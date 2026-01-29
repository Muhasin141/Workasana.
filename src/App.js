import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify"; // Import ToastContainer

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";
import ProjectView from "./pages/ProjectView";
import TeamView from "./pages/TeamView";
import Reports from "./pages/Reports";
import TaskDetails from "./pages/TaskDetails";
import Dashboard from "./pages/Dashboard";
import AddProject from "./pages/AddProject";

// 🔐 Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      {/* ToastContainer should be inside the AuthProvider */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <BrowserRouter>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Protected Routes (Dashboard Layout) */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<TaskList />} />
            <Route path="tasks/new" element={<TaskForm />} />
            <Route path="tasks/:id" element={<TaskDetails />} />
            <Route path="projects" element={<ProjectView />} />
            <Route path="projects/new" element={<AddProject />} />
            <Route path="teams" element={<TeamView />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* 🚫 Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
