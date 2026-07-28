import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  // State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // JWT Token Save
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      alert("Login Successful!");

      // Dashboard baad me banega
      navigate("/");

    } catch (err) {
      setError("Invalid Email or Password");
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-card">

          <h1>
            Crop Yield Prediction & Agricultural Productivity Forecasting System
          </h1>

          <p className="subtitle">
            Welcome to YieldSense AI
          </p>

          <form onSubmit={handleLogin}>

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  marginBottom: "15px",
                  fontWeight: "bold",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit">
              Login
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Login;