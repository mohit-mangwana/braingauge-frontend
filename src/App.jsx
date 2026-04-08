import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage'
import ForgotPassword from './pages/ForgotPassword' 
import TeacherSignup from './pages/TeacherSignup'
import StudentSignup from './pages/StudentSignup'
import Onboard from './Components/ui/Onboard'
import Signup from './pages/Signup'
import './App.css'

function App() {
  return (
    // Wrap everything in the Router component
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />} 
        />
         <Route
            path="/forgot-password"
            element={<ForgotPassword />} 
          />
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
          element={<Signup />} 
        />

        {/* Recommended: Add a default route so you don't see a blank page at "/" */}
        <Route path="/" element={<div>Home Page (Go to /login)</div>} />
      </Routes>
    </Router>
  )
}

export default App