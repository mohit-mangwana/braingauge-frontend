import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage'
import ForgotPassword from './pages/ForgotPassword' 
import TeacherSignup from './pages/TeacherSignup'
import StudentSignup from './pages/StudentSignup'
import './App.css'

function App() {
  return (
    // Wrap everything in the Router component
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />} // Cleaned up the unnecessary fragment
        />
         <Route
            path="/forgot-password"
            element={<ForgotPassword />} // Cleaned up the unnecessary fragment
          />
          <Route
          path="/signup/teacher"
          element={<TeacherSignup />} // Cleaned up the unnecessary fragment
        />
         <Route
          path="/signup/student"
          element={<StudentSignup />} // Cleaned up the unnecessary fragment
        />

        {/* Recommended: Add a default route so you don't see a blank page at "/" */}
        <Route path="/" element={<div>Home Page (Go to /login)</div>} />
      </Routes>
    </Router>
  )
}

export default App