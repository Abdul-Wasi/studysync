// src/App.jsx

import React from 'react'; // React import (often implicit in newer React versions, but good practice)
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ToastContainer } from "react-toastify";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page Components
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Specific Tool/Feature Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfilePage from "./components/ProfilePage";
import AttendanceCalculator from "./components/AttendanceCalculator";
import SGPACalculator from "./components/SGPACalculator";
import StudyPlanner from "./components/StudyPlanner";
import CitationGenerator from './components/CitationGenerator';
import BudgetingTool from './components/BudgetingTool';
import FAQPage from './components/FAQPage'; // Grouped with other specific components
import ComingSoon from "./components/ComingSoon"; // Keep "ComingSoon" as it is

// Forum Components
import DiscussionList from "./components/DiscussionList";
import NewDiscussionForm from "./components/NewDiscussionForm";
import DiscussionDetail from "./components/DiscussionDetail";

// Firebase Import
import { auth } from "./firebase"; // Keep Firebase import separate or with other utilities

// Global Styles
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; // External CSS frameworks
import "react-toastify/dist/ReactToastify.css"; // React Toastify CSS

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Analytics />
      {/* Added theme="colored" for better visual consistency with toasts */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <div className="main-container">
        <Routes>
          {/* Core Pages */}
          <Route path="/" element={<DiscussionList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} /> {/* FAQ Page */}

          {/* Tools Section (Main Tools page and individual tool routes) */}
          <Route path="/tools" element={<Tools />} /> {/* Parent route for tools */}
          <Route path="/tools/attendance" element={<AttendanceCalculator />} />
          <Route path="/tools/sgpa-calculator" element={<SGPACalculator />} />
          <Route path="/tools/studyPlanner" element={<StudyPlanner />} />
          <Route path="/tools/citationGenerator" element={<CitationGenerator />} />
          <Route path="/tools/budgetingTool" element={<BudgetingTool />} />
          <Route path="/tools/coming-soon" element={<ComingSoon />} /> {/* Coming Soon page */}

          {/* Discussion Forum Routes */}
          <Route path="/forum" element={<DiscussionList />} />
          <Route path="/forum/new" element={<NewDiscussionForm />} />
          <Route path="/forum/:discussionId" element={<DiscussionDetail />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
