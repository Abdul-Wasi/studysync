// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes, FaUserCircle } from "react-icons/fa"; // Added FaUserCircle
import "../styles/Navbar.css";
import { auth } from '../firebase'; // Import your Firebase auth instance

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // State to track logged-in user

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to home after logout
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally display an error message to the user
    }
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
            {user && (
              <li className={location.pathname === "/profile" ? "active" : ""}>
                <Link to="/profile">Profile</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="navbar-right">
          <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaMoon /> : <FaSun />}
          </div>

          {user ? (
            <>
              <Link to="/profile" className="user-profile-link desktop-only">
                <FaUserCircle size={24} />
              </Link>
              <button className="logout-button desktop-only" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link desktop-only">
                Login
              </Link>
              <Link to="/signup" className="nav-link desktop-only">
                Sign Up
              </Link>
            </>
          )}

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
          {user && (
            <li onClick={closeMenu}>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {user ? (
            <li onClick={handleLogout}>
              Logout
            </li>
          ) : (
            <>
              <li onClick={closeMenu}>
                <Link to="/login">Login</Link>
              </li>
              <li onClick={closeMenu}>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Backdrop */}
      {menuOpen && <div className="mobile-backdrop show" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;