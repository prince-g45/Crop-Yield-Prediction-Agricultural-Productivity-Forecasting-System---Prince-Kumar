import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ===========================
  // Normal Login
  // ===========================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await api.post("/auth/login", {

        email,

        password,

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

      localStorage.setItem(
        "email",
        response.data.email
      );

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

        err.response?.data?.detail ||

        "Invalid Email or Password"

      );

    }

  };

  // ===========================
  // Google Login
  // ===========================

  const handleGoogleLogin = async (credentialResponse) => {

    try {

      const response = await api.post(
        "/auth/google/login",
        {

          credential: credentialResponse.credential,

        }
      );

      localStorage.setItem(
        "access_token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "full_name",
        response.data.full_name
      );

      localStorage.setItem(
        "email",
        response.data.email
      );

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

    } catch (error) {

      alert(

        error.response?.data?.detail ||

        "Google Login Failed"

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

            {

              error && (

                <p className="error-message">

                  {error}

                </p>

              )

            }

            <button type="submit">

              Login

            </button>

          </form>

          {/* Google Login */}

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