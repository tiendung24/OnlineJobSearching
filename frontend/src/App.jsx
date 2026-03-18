import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ROLES } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import JobSeekerLayout from './layouts/JobSeekerLayout.jsx';
import EmployerLayout from './layouts/EmployerLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import { EmployeeLayout } from './pages/employee/MyJob.jsx';

// Public & Auth Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FindJobs from './pages/jobs/FindJobs.jsx';
import JobDetails from './pages/jobs/JobDetails.jsx';
import Companies from './pages/Companies.jsx';

// JobSeeker Pages
import Profile from './pages/jobseeker/Profile.jsx';
import CVManager from './pages/jobseeker/CVManager.jsx';
import SavedJobs from './pages/jobseeker/SavedJobs.jsx';
import Applications from './pages/jobseeker/Applications.jsx';

// Employer Pages
import CompanyProfile from './pages/employer/CompanyProfile.jsx';
import EmployerDashboard from './pages/employer/Dashboard.jsx';
import JobManager from './pages/employer/JobManager.jsx';
import Applicants from './pages/employer/Applicants.jsx';
import Employees from './pages/employer/Employees.jsx';
import EmployeeDetail from './pages/employer/EmployeeDetail.jsx';
import EmployeeEdit from './pages/employer/EmployeeEdit.jsx';

// Employee Pages
import { MyJob } from './pages/employee/MyJob.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import UserManager from './pages/admin/UserManager.jsx';
import JobModeration from './pages/admin/JobModeration.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Companies />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 1. JobSeeker Routes — protected, role=2 */}
          <Route element={<ProtectedRoute requiredRole={ROLES.JOBSEEKER} />}>
            <Route path="/jobseeker" element={<JobSeekerLayout />}>
              <Route index element={<Navigate to="/jobseeker/profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cv-manager" element={<CVManager />} />
              <Route path="saved-jobs" element={<SavedJobs />} />
              <Route path="applications" element={<Applications />} />
            </Route>
          </Route>

          {/* 2. Employer Routes — protected, role=3 */}
          <Route element={<ProtectedRoute requiredRole={ROLES.EMPLOYER} />}>
            <Route path="/employer" element={<EmployerLayout />}>
              <Route index element={<Navigate to="/employer/dashboard" replace />} />
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="company-profile" element={<CompanyProfile />} />
              <Route path="jobs" element={<JobManager />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="employees" element={<Employees />} />
              <Route path="employees/:employeeId" element={<EmployeeDetail />} />
              <Route path="employees/:employeeId/edit" element={<EmployeeEdit />} />
            </Route>
          </Route>

          {/* 3. Employee Routes — any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route index element={<Navigate to="/employee/my-job" replace />} />
              <Route path="my-job" element={<MyJob />} />
            </Route>
          </Route>

          {/* 4. Admin Routes — protected, role=1 */}
          <Route element={<ProtectedRoute requiredRole={ROLES.ADMIN} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManager />} />
              <Route path="jobs" element={<JobModeration />} />
            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
