import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import TeachersPage from "./pages/Teachers"
import AboutUs from "./pages/Aboutus"
import Footer from "./components/Footer"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Student_Profile from "./pages/Student_Profile"
import Teacher_Profile from "./pages/Teacher_Profile"
import Admin_Dashboard from "./pages/Admin_Dashboard"
import StudentUGForm from "./components/StudentUg"
import UGFormManagement from "./components/UgForm"
import ProjectsShowcase from "./pages/Projects"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<Student_Profile />} />
        <Route path="/student/dashboard/ug" element={<StudentUGForm />} />
        <Route path="/teacher/dashboard" element={<Teacher_Profile />} />
        <Route path="/admin/dashboard" element={<Admin_Dashboard />} />
        <Route path="/admin/dashboard/ug-form" element={<UGFormManagement />} />
        <Route path="/projects" element={<ProjectsShowcase />} />


      </Routes>
      <Footer/>
</>
  )
}

export default App