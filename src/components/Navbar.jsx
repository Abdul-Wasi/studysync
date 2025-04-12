import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"; // prevent scroll when menu is open
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand-link">StudySync</Link>
        </div>

        <div className="navbar-center desktop-only">
          <ul className="navbar-links">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">Home</Link>
            </li>
            <li className={location.pathname.startsWith("/tools") ? "active" : ""}>
              <Link to="/tools">Tools</Link>
            </li>
            <li className={location.pathname === "/about" ? "active" : ""}>
              <Link to="/about">About</Link>
            </li>
            <li className={location.pathname === "/contact" ? "active" : ""}>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-right">
          <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaMoon /> : <FaSun />}
          </div>

          <div className="menu-toggle mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>

      {/* Slide-out menu for mobile */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={closeMenu}>
            <Link to="/">Home</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/tools">Tools</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/about">About</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="mobile-backdrop show" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;
