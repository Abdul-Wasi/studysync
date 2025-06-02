// src/components/Signup.jsx

import React, { useState } from "react";
import { auth, db } from "../firebase"; // <--- Import 'db' here
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database"; // <--- Import 'ref' and 'set'
import { useNavigate, Link } from "react-router-dom"; // <--- Import Link
import { toast } from "react-toastify"; // <--- Import toast
import "../styles/Auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // <--- New state for display name
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!displayName.trim()) { // Basic validation for display name
        setError("Display Name cannot be empty.");
        toast.error("Display Name cannot be empty.");
        return;
    }

    try {
      // 1. Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save additional user data (like display name) to Realtime Database
      // Create a reference to the user's profile in the 'users' node
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        email: user.email,
        displayName: displayName.trim(), // Save the display name
        createdAt: new Date().toISOString(), // Store creation timestamp
        // You can add more profile fields here if needed
      });

      toast.success("Account created successfully!");
      navigate("/"); // Navigate to home or profile page after successful signup
    } catch (err) {
      console.error("Signup error:", err);
      // More user-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
        toast.error('The email address is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
        toast.error('The email address is not valid.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please use at least 6 characters.');
        toast.error('The password is too weak (min 6 chars).');
      } else {
        setError(`Signup failed: ${err.message}`);
        toast.error('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>} {/* Use error-message class */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input // <--- New input field for display name
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p className="auth-links"> {/* Use auth-links class for consistent styling */}
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;