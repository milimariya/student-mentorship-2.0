import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import MyMentor from './pages/student/MyMentor';
import Goals from './pages/student/Goals';
import Concerns from './pages/student/Concerns';
import Meetings from './pages/student/Meetings';
import Feedback from './pages/student/Feedback';

import MentorDashboard from './pages/mentor/MentorDashboard';
import MyStudents from './pages/mentor/MyStudents';
import StudentDetails from './pages/mentor/StudentDetails';
import MentorMeetings from './pages/mentor/Meetings';
import MentorFeedback from './pages/mentor/Feedback';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageMentors from './pages/admin/ManageMentors';
import AssignMentors from './pages/admin/AssignMentors';

const DashboardLayout = ({ role, children }) => (
  <div className="app-shell">
    <Sidebar role={role} />
    <main className="page-body">{children}</main>
  </div>
);

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <StudentProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-mentor"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <MyMentor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/goals"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <Goals />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/concerns"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <Concerns />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/meetings"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <Meetings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/feedback"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <Feedback />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <DashboardLayout role="mentor">
                <MentorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/students"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <DashboardLayout role="mentor">
                <MyStudents />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/student/:studentId"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <DashboardLayout role="mentor">
                <StudentDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/meetings"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <DashboardLayout role="mentor">
                <MentorMeetings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/feedback"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <DashboardLayout role="mentor">
                <MentorFeedback />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <ManageStudents />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mentors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <ManageMentors />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign-ment"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <AssignMentors />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
