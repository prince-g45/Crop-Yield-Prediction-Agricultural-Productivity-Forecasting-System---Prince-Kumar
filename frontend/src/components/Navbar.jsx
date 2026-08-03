import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";
import { getWeatherByCoordinates } from "../services/weatherService";

function Navbar({

  activeSection,

  setActiveSection,

}) {

  const location = useLocation();

  const navigate = useNavigate();

  const isDashboard = location.pathname.includes("dashboard");

  const role = localStorage.getItem("role");

  const [userName, setUserName] = useState("");

  const [weather, setWeather] = useState({

    temp: "--",

    city: "Loading...",

    condition: "",

    icon: "",

  });

  useEffect(() => {

    const name = localStorage.getItem("full_name");

    if (name) {

      setUserName(name);

    }

  }, []);

  // Weather only for Farmer

  useEffect(() => {

    if (!isDashboard || role !== "Farmer") return;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const { latitude, longitude } = position.coords;

          const data = await getWeatherByCoordinates(

            latitude,

            longitude

          );

          setWeather({

            temp: Math.round(data.current.temp_c),

            city: data.location.name,

            condition: data.current.condition.text,

            icon: data.current.condition.icon,

          });

        } catch (error) {

          console.error(error);

        }

      }

    );

  }, [isDashboard, role]);

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  return (

    <nav className="navbar">

      {/* Logo */}

      <div className="logo">

        <img src={logo} alt="YieldSense AI" />

        <div className="logo-text">

          <h2>YieldSense AI</h2>

          <p>Crop Yield Prediction</p>

        </div>

      </div>

      <ul className="nav-links">

        {isDashboard ? (

          role === "Administrator" ? (

            <>

              <li>

                <button

                  className={`nav-btn ${

                    activeSection === "dashboard"

                      ? "active"

                      : ""

                  }`}

                  onClick={() =>

                    setActiveSection("dashboard")

                  }

                >

                  Dashboard

                </button>

              </li>

              <li>

                <button

                  className={`nav-btn ${

                    activeSection === "farmers"

                      ? "active"

                      : ""

                  }`}

                  onClick={() =>

                    setActiveSection("farmers")

                  }

                >

                  Farmers

                </button>

              </li>

              <li>

                <button

                  className={`nav-btn ${

                    activeSection === "predictions"

                      ? "active"

                      : ""

                  }`}

                  onClick={() =>

                    setActiveSection("predictions")

                  }

                >

                  Predictions

                </button>

              </li>

              <li>

                <button

                  className={`nav-btn ${

                    activeSection === "datasets"

                      ? "active"

                      : ""

                  }`}

                  onClick={() =>

                    setActiveSection("datasets")

                  }

                >

                  Datasets

                </button>

              </li>

              <li>

                <button

                  className={`nav-btn ${

                    activeSection === "analytics"

                      ? "active"

                      : ""

                  }`}

                  onClick={() =>

                    setActiveSection("analytics")

                  }

                >

                  Analytics

                </button>

              </li>

              <li>

                <div className="admin-user">

                  <User size={18} />

                  <span>{userName}</span>

                </div>

              </li>

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

          ) : (

            <>

              <li className="weather-box">

                {weather.icon && (

                  <img

                    src={`https:${weather.icon}`}

                    alt={weather.condition}

                    className="weather-icon"

                  />

                )}

                <div>

                  <span>{weather.temp}°C</span>

                  <small>{weather.city}</small>

                </div>

              </li>

              <li>

                <Link

                  className="profile-link"

                  to="#"

                >

                  <User size={18} />

                  {userName}

                </Link>

              </li>

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

          )

        ) : (

          <>

            <li>

              <Link to="/about">

                About

              </Link>

            </li>

            <li>

              <Link

                className="login-btn"

                to="/"

              >

                Login

              </Link>

            </li>

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