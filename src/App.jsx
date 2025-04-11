//App.jsx

import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AttendanceCalculator from "./components/AttendanceCalculator";
import SGPACalculator from "./components/SGPACalculator";
import ComingSoon from "./components/ComingSoon";


function App() {
  return (
    <>
      <Navbar />
      <Analytics />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tools/attendance" element={<AttendanceCalculator />} />
          <Route path="/tools/sgpa" element={<SGPACalculator />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
