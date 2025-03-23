import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>StudySync 📚</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tools">Tools</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
