import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css"; // Updated path

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>UniTools</h2>
          <p>Essential tools for students & scholars</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UniTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
