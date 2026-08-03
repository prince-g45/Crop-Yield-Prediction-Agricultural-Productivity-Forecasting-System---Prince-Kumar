import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/ChooseRole.css";

function ChooseRole() {

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state;

  const [role, setRole] = useState("Farmer");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/google/save",
        {

          full_name: user.full_name,

          email: user.email,

          google_id: user.google_id,

          role: role,

        }
      );

      // Save JWT & User Details
      localStorage.setItem(
        "token",
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

      // Redirect according to role
      switch (response.data.role) {

        case "Farmer":
          navigate("/farmer-dashboard");
          break;

        case "Consultant":
          navigate("/consultant-dashboard");
          break;

        case "Researcher":
          navigate("/researcher-dashboard");
          break;

        case "Agriculture Department":
          navigate("/department-dashboard");
          break;

        case "Administrator":
          navigate("/admin-dashboard");
          break;

        default:
          navigate("/");
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.detail ||
        "Failed to create account."
      );

    } finally {

      setLoading(false);

    }

  };

  if (!user) {

    return (

      <>
        <Navbar />

        <div className="choose-role-container">

          <div className="choose-role-card">

            <h2>No Google User Found</h2>

            <p>Please signup with Google first.</p>

          </div>

        </div>

      </>

    );

  }

  return (

    <>
      <Navbar />

      <div className="choose-role-container">

        <div className="choose-role-card">

          <img
            src={user.picture}
            alt={user.full_name}
            className="profile-image"
          />

          <h2>
            Welcome {user.full_name}
          </h2>

          <p>{user.email}</p>

          <h3>Select Your Role</h3>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >

            <option value="Farmer">
              Farmer
            </option>

            <option value="Agriculture Department">
              Agriculture Department
            </option>

            

          </select>

          <button
            onClick={handleContinue}
            disabled={loading}
          >
            {
              loading
                ? "Creating Account..."
                : "Continue"
            }
          </button>

        </div>

      </div>

    </>

  );

}

export default ChooseRole;