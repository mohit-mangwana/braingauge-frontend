import './App.css'
import { Navigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage'
import ForgotPassword from './pages/ForgotPassword' 
import TeacherSignup from './pages/TeacherSignup'
import StudentSignup from './pages/StudentSignup'
import Onboard from './Components/ui/Onboard'
import Signup from './pages/Signup'
import ScrollToTop from './Components/ui/ScrollToTop'
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage'
import DashboardLayout from './Components/layout/DashboardLayout'
import QuizPage from './pages/QuizPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import QuizHistoryPage from './pages/QuizHistoryPage'
import ProtectedRoute from './Components/layout/ProtectedRoute'
import TeacherLayout from './Components/layout/TeacherLayout'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import QuestionBankPage from './pages/teacher/QuestionBankPage'
import StudentPages from './pages/teacher/StudentPages'
import TeacherProfilePage from './pages/teacher/TeacherProfilePage'
import { useAuth } from './context/AuthContext'

 // Redirect logged-in users away from /login and /register

 function homeFor(role) {
  return role === "teacher" ? "/teacher/dashboard" : "/dashboard";
}

  function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  }

function RoleRoute({ role, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  console.log(user.role)
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) {
    return <Navigate to={user?.role === "teacher" ? "/teacher/dashboard" : "/dashboard"} replace />;
  }
  return children;
}

// ── Root redirect based on role ───────────────────────────────
function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  console.log(user.role)
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === "teacher" ? "/teacher/dashboard" : "/dashboard"} replace />;
}

function App() {

 


  return (
    // Wrap everything in the Router component
    <Router>
    <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={ <PublicRoute><Login /></PublicRoute>} 
        />
         {/* <Route
            path="/forgot-password"
            element={<ForgotPassword />} 
          /> */}
          <Route
          path="/signup/teacher"
          element={<TeacherSignup />} 
        />
         <Route
          path="/signup/student"
          element={<StudentSignup />} 
        />
         <Route
          path="/onboard/student"
          element={<Onboard />} 
        />
        <Route
          path="/signup"
          element={ <PublicRoute><Signup /></PublicRoute>} 
        />
        {/* Protected layout (add auth guard here later) */}
                <Route element={ 
                  <ProtectedRoute>
      <DashboardLayout />
                  </ProtectedRoute>
    }>
                  <Route path="/dashboard"      element={<DashboardPage />} />
                      <Route path="/quiz/history"   element={<QuizHistoryPage />} />
                      <Route path="/quiz"           element={<QuizPage />} />
                      <Route path="/quiz/:subject"  element={<QuizPage />} />
                      <Route path="/notifications"  element={<NotificationsPage />} />
                      <Route path="/settings"       element={<SettingsPage />} />
                      <Route path="/profile"        element={<ProfilePage />} />
                </Route>

                 {/* ── Teacher routes ── */}
        <Route element={
          <ProtectedRoute>
            <RoleRoute role="teacher"><TeacherLayout /></RoleRoute>
          </ProtectedRoute>
        }>
          <Route path="/teacher/dashboard"  element={<TeacherDashboardPage />} />
          <Route path="/teacher/questions"  element={<QuestionBankPage />} />
          <Route path="/teacher/students"   element={<StudentPages />} />
          <Route path="/teacher/profile"    element={<TeacherProfilePage />} />
          <Route path="/teacher/settings"   element={<SettingsPage />} />
        </Route>

       {/* ── Fallback ── */}
             <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  )
}

export default App



