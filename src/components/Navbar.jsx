import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex space-x-6 justify-center">
        <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
        <li><Link to="/tools" className="hover:text-gray-200">Tools</Link></li>
        <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
        <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
