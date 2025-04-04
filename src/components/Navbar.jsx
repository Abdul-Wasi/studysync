import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">StudySync</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/tools">Tools</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
