import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Farmer");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "full_name",
        response.data.full_name
      );

      alert("Login Successful!");

      switch (response.data.role) {
        case "Farmer":
          navigate("/farmer-dashboard");
          break;

        case "Agriculture Department":
          navigate("/department-dashboard");
          break;

        case "Consultant":
          navigate("/consultant-dashboard");
          break;

        case "Researcher":
          navigate("/research-dashboard");
          break;

        case "Administrator":
          navigate("/admin-dashboard");
          break;

        default:
          navigate("/");
      }

    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid Login Credentials"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-container">

        <div className="login-card">

          <h1>YieldSense AI</h1>

          <p className="project-title">
            AI-Powered Crop Yield Prediction &
            Agricultural Productivity Forecasting
          </p>

          <p className="subtitle">
            Sign in to continue
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

            <div className="form-group">

              <label>Login As</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Farmer"> Farmer</option>

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

            <button type="submit">
              Login
            </button>

          </form>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign Up
            </Link>
          </p>

        </div>

      </div>
    </>
  );
}

export default Login;