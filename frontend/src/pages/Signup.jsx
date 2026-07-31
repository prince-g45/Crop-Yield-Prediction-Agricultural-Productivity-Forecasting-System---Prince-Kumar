import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Farmer");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
        await api.post("/auth/signup", {
            full_name: fullName,
            email: email,
            password: password,
            role: role,
        });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.detail || "Signup failed."
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="signup-container">

        <div className="signup-card">

          <h1>YieldSense AI</h1>

          <p className="project-title">
            AI-Powered Crop Yield Prediction &
            Agricultural Productivity Forecasting
          </p>

          <p className="subtitle">
            Create Your Account
          </p>

          <form onSubmit={handleSignup}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">

              <label>User Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Farmer">Farmer</option>

                <option value="Agriculture Department">
                  Agriculture Department
                </option>

                <option value="Consultant">
                  Consultant
                </option>

                <option value="Researcher">
                  Researcher
                </option>

                <option value="Administrator">
                  ⚙ Administrator
                </option>
              </select>

            </div>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {success && (
              <p
                style={{
                  color: "#9CFF9C",
                  textAlign: "center",
                  marginBottom: "15px",
                  fontWeight: "600",
                }}
              >
                {success}
              </p>
            )}

            <button type="submit">
              Create Account
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </p>

        </div>

      </div>
    </>
  );
}

export default Signup;