import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  User,
  LogOut,
} from "lucide-react";

import "../styles/Navbar.css";

import logo from "../assets/logo.png";

import WeatherDropdown from "./WeatherDropdown";


function Navbar({
  activeSection,
  setActiveSection,
}) {

  const location = useLocation();

  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const [userName, setUserName] =
    useState("");


  // ==========================================
  // CURRENT PAGE
  // ==========================================

  const isDashboard =
    location.pathname.includes("dashboard");

  const isFarmerPage =
    role !== "Administrator" &&
    (
      location.pathname ===
        "/farmer-dashboard" ||

      location.pathname ===
        "/farmer-analytics" ||

      location.pathname ===
        "/farmer-reports"
    );


  // ==========================================
  // USER NAME
  // ==========================================

  useEffect(() => {

    const name =
      localStorage.getItem("full_name");

    if (name) {

      setUserName(name);

    }

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <nav className="navbar">

      {/* ======================================
          LOGO
      ======================================= */}

      <div className="logo">

        <img
          src={logo}
          alt="YieldSense AI"
        />

        <div className="logo-text">

          <h2>
            YieldSense AI
          </h2>

        </div>

      </div>


      {/* ======================================
          NAVIGATION
      ======================================= */}

      <ul className="nav-links">


        {/* ====================================
            ADMIN NAVIGATION
        ===================================== */}

        {role === "Administrator" &&
        isDashboard ? (

          <>

            {/* Dashboard */}

            <li>

              <button
                className={`nav-btn ${
                  activeSection === "dashboard"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(
                    "dashboard"
                  )
                }
              >
                Dashboard
              </button>

            </li>


            {/* Farmers */}

            <li>

              <button
                className={`nav-btn ${
                  activeSection === "farmers"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(
                    "farmers"
                  )
                }
              >
                Farmers
              </button>

            </li>


            {/* Predictions */}

            <li>

              <button
                className={`nav-btn ${
                  activeSection === "predictions"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(
                    "predictions"
                  )
                }
              >
                Predictions
              </button>

            </li>


            {/* Datasets */}

            <li>

              <button
                className={`nav-btn ${
                  activeSection === "datasets"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(
                    "datasets"
                  )
                }
              >
                Datasets
              </button>

            </li>


            {/* Analytics */}

            <li>

              <button
                className={`nav-btn ${
                  activeSection === "analytics"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveSection(
                    "analytics"
                  )
                }
              >
                Analytics
              </button>

            </li>


            {/* Admin User */}

            <li>

              <div className="admin-user">

                <User size={18} />

                <span>
                  {userName}
                </span>

              </div>

            </li>


            {/* Logout */}

            <li>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >

                <LogOut size={18} />

                Logout

              </button>

            </li>

          </>


        ) : isFarmerPage ? (

          /* ==================================
             FARMER NAVIGATION
          ================================== */

          <>

            {/* Dashboard */}

            <li>

              <Link
                to="/farmer-dashboard"
                className={
                  location.pathname ===
                  "/farmer-dashboard"
                    ? "active"
                    : ""
                }
              >
                Dashboard
              </Link>

            </li>


            {/* Analytics */}

            <li>

              <Link
                to="/farmer-analytics"
                className={
                  location.pathname ===
                  "/farmer-analytics"
                    ? "active"
                    : ""
                }
              >
                Analytics
              </Link>

            </li>


            {/* Reports */}

            <li>

              <Link
                to="/farmer-reports"
                className={
                  location.pathname ===
                  "/farmer-reports"
                    ? "active"
                    : ""
                }
              >
                Reports
              </Link>

            </li>


            {/* Weather */}

            <li>

              <WeatherDropdown />

            </li>


            {/* User Profile */}

            <li>

              <Link
                className="profile-link"
                to="#"
              >

                <User size={18} />

                {userName}

              </Link>

            </li>


            {/* Logout */}

            <li>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >

                <LogOut size={18} />

                Log Out

              </button>

            </li>

          </>


        ) : (

          /* ==================================
             PUBLIC NAVIGATION
          ================================== */

          <>

            {/* About */}

            <li>

              <Link to="/about">
                About
              </Link>

            </li>


            {/* Login */}

            <li>

              <Link
                className="login-btn"
                to="/"
              >
                Login
              </Link>

            </li>


            {/* Signup */}

            <li>

              <Link
                className="signup-btn"
                to="/signup"
              >
                Sign Up
              </Link>

            </li>

          </>

        )}

      </ul>

    </nav>

  );

}


export default Navbar;