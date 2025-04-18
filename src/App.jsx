//App.jsx

import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import AttendanceCalculator from "./components/AttendanceCalculator";
import SGPACalculator from "./components/SGPACalculator";
import ComingSoon from "./components/ComingSoon";
import StudyPlanner from "./components/StudyPlanner";


function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Analytics />
      <ToastContainer />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tools/attendance" element={<AttendanceCalculator />} />
          <Route path="/tools/sgpa" element={<SGPACalculator />} />
          <Route path="/tools/studyPlanner" element={<StudyPlanner />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
