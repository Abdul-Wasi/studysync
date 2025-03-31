import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AttendanceCalculator from "./components/AttendanceCalculator";
import AttendanceRequirementCalculator from "./components/AttendanceRequirementCalculator";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tools/attendance" element={<AttendanceCalculator />} />
          <Route path="tools/attendance-requirement" element={<AttendanceRequirementCalculator />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
