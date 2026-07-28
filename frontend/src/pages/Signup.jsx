import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Signup.css";

function Signup() {
  return (
    <>
      <Navbar />

      <div className="signup-container">
        <div className="signup-card">

          <h1>Crop Yield Prediction & Agricultural Productivity Forecasting System</h1>

          <p className="subtitle">
            Create your YieldSense AI Account
          </p>

          <form>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create your password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit">
              Sign Up
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Signup;