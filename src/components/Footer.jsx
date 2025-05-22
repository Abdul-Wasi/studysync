// src/components/Footer.jsx

import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} StudySync. All rights reserved.</p>
      <p className="footer-tagline">Made with ❤️ by students, for students</p>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link> {/* NEW: FAQ Link */}
      </div>
    </footer>
  );
};

export default Footer;