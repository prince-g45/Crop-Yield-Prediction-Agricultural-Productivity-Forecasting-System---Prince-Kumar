import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        YieldSense AI
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Login</Link>
        </li>

        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;