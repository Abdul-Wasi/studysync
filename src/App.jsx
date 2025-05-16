// App.jsx

import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfilePage from "./components/ProfilePage";
import AttendanceCalculator from "./components/AttendanceCalculator";
import SGPACalculator from "./components/SGPACalculator";
import ComingSoon from "./components/ComingSoon";
import StudyPlanner from "./components/StudyPlanner";
import CitationGenerator from './components/CitationGenerator';
import BudgetingTool from './components/BudgetingTool';
import { auth } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Analytics />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="tools" element={<Tools />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/tools/attendance" element={<AttendanceCalculator />} />
          <Route path="/tools/sgpa-calculator" element={<SGPACalculator />} />
          <Route path="/tools/studyPlanner" element={<StudyPlanner />} />
          <Route path="/tools/coming-soon" element={<ComingSoon />} />
          <Route path="/tools/citationGenerator" element={<CitationGenerator />} />
          <Route path="/tools/budgetingTool" element={<BudgetingTool />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;