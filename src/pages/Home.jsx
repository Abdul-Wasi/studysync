import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to UniTools</h1>
        <p>Your one-stop solution for university productivity tools.</p>
        <Link to="/tools" className="hero-btn">Explore Tools</Link>
      </section>
    </div>
  );
};

export default Home;
