import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // HARD-CODED ADMIN EMAIL
  // =====================================================

  const ADMIN_EMAIL = "princesingh030903@gmail.com";

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save access token
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // =================================================
      // HARD-CODE ADMIN ROLE
      // =================================================

      const userRole =
        response.data.email?.toLowerCase() === ADMIN_EMAIL
          ? "Administrator"
          : response.data.role;

      // Save user information
      localStorage.setItem(
        "role",
        userRole
      );

      localStorage.setItem(
        "full_name",
        response.data.full_name
      );

      localStorage.setItem(
        "email",
        response.data.email
      );

      // =================================================
      // REDIRECT BASED ON ROLE
      // =================================================

      switch (userRole) {

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
        err.response?.data?.detail ||
        "Invalid Email or Password"
      );

    }

  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async (credentialResponse) => {

    try {

      const response = await api.post(
        "/auth/google/login",
        {
          credential: credentialResponse.credential,
        }
      );

      // Save access token
      localStorage.setItem(
        "access_token",
        response.data.token
      );

      // =================================================
      // HARD-CODE ADMIN ROLE FOR GOOGLE LOGIN
      // =================================================

      const userRole =
        response.data.email?.toLowerCase() === ADMIN_EMAIL
          ? "Administrator"
          : response.data.role;

      // Save user information
      localStorage.setItem(
        "role",
        userRole
      );

      localStorage.setItem(
        "full_name",
        response.data.full_name
      );

      localStorage.setItem(
        "email",
        response.data.email
      );

      // =================================================
      // REDIRECT BASED ON ROLE
      // =================================================

      switch (userRole) {

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

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Google Login Failed"
      );

    }

  };

  // =====================================================
  // UI
  // =====================================================

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

          {/* ================= NORMAL LOGIN ================= */}

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            {/* Error */}

            {error && (

              <p className="error-message">

                {error}

              </p>

            )}

            <button type="submit">

              Login

            </button>

          </form>

          {/* ================= GOOGLE LOGIN ================= */}

          <div className="divider">

            <span>OR</span>

          </div>

          <div className="google-login">

            <GoogleLogin

              onSuccess={handleGoogleLogin}

              onError={() => {

                alert("Google Login Failed");

              }}

            />

          </div>

          {/* ================= SIGN UP ================= */}

          <p className="signup-text">

            Don't have an account?{" "}

            <Link to="/signup">

              Sign Up

            </Link>

          </p>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Login;