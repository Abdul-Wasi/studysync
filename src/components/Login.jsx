// src/components/Login.jsx

import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Import sendPasswordResetEmail
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { toast } from "react-toastify"; // Import toast for notifications
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!"); // Success toast
      navigate("/"); // Redirect after login
    } catch (err) {
      // More specific error messages for better user experience
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("Login failed. Please check your credentials.");
        console.error("Login error:", err); // Log full error for debugging
      }
      toast.error(error || "Login failed!"); // Error toast
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.warn("Please enter your email address to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setError(""); // Clear any login errors
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        toast.error("No user found with that email address.");
      } else if (err.code === 'auth/invalid-email') {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Failed to send password reset email. Please try again.");
        console.error("Password reset error:", err);
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Use error-message class for styling */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="auth-links">
          <Link to="#" onClick={handlePasswordReset} className="forgot-password-link">Forgot Password?</Link>
          <span> | </span>
          New user? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;