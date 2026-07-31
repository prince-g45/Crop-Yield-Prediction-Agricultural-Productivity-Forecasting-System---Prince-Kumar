import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">

        <img src={logo} alt="YieldSense AI" />

        <h2>Crop Yield Prediction &
Agricultural Productivity Forecasting System</h2>

      </div>

      <ul className="nav-links">

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link className="login-btn" to="/">
            Login
          </Link>
        </li>

        <li>
          <Link className="signup-btn" to="/signup">
            Sign Up
          </Link>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;