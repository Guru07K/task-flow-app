import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Projects from "./pages/Projects";
import Unauthorized from "./pages/Unauthorized";
import { AuthorizedModules } from "./types/authorization-permissions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route element={<ProtectedRoute moduleName={AuthorizedModules.ProjectManagement} />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />

              <Route element={<ProtectedRoute moduleName={AuthorizedModules.ProjectManagement} permission="project:create" />}>
                <Route path="/projects/create" element={<CreateProject />} />
              </Route>

              <Route element={<ProtectedRoute moduleName={AuthorizedModules.ProjectManagement} permission="project:edit" />}>
                <Route path="/projects/:id/edit" element={<EditProject />} />
              </Route>
            </Route>



          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
