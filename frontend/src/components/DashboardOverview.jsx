import { useEffect, useState } from "react";

import {
  Users,
  Sprout,
  Wheat,
  MapPin,
  Activity,
} from "lucide-react";

import { getAdminDashboard } from "../services/adminService";


function DashboardOverview() {

  // ==========================================
  // STATE
  // ==========================================

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getAdminDashboard();

        console.log("ADMIN DASHBOARD DATA:", data);

        setDashboardData(data);

      } catch (err) {

        console.error(
          "Admin dashboard error:",
          err
        );

        if (err.response?.status === 401) {

          setError(
            "Your session has expired. Please login again."
          );

        } else {

          setError(
            "Unable to load dashboard data."
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="overview-container">

        <div className="page-header">

          <h1>Dashboard</h1>

          <p>
            Loading dashboard data...
          </p>

        </div>

        <div className="stats-grid">

          {[1, 2, 3, 4].map((item) => (

            <div
              className="stat-card"
              key={item}
            >

              <div className="dashboard-loading">
                Loading...
              </div>

            </div>

          ))}

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (

      <div className="overview-container">

        <div className="page-header">

          <h1>Dashboard</h1>

          <p>
            Welcome to the YieldSense AI administration panel.
          </p>

        </div>

        <div className="dashboard-error">

          <strong>
            Unable to load dashboard
          </strong>

          <p>
            {error}
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // SAFE DATA
  // ==========================================

  const totalFarmers =
    dashboardData?.total_farmers ?? 0;

  const totalPredictions =
    dashboardData?.total_predictions ?? 0;

  const mostPredictedCrop =
    dashboardData?.most_predicted_crop || "--";

  const mostActiveState =
    dashboardData?.most_active_state || "--";

  const recentActivity =
    dashboardData?.recent_activity || [];


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }

    try {

      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      );

    } catch {

      return "--";

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="overview-container">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <h1>
          Dashboard
        </h1>

        <p>
          Welcome to the YieldSense AI administration panel.
        </p>

      </div>


      {/* =====================================
          STAT CARDS
      ====================================== */}

      <div className="stats-grid">


        {/* TOTAL FARMERS */}

        <div className="stat-card">

          <Users size={28} />

          <h3>
            Total Farmers
          </h3>

          <h2>
            {totalFarmers}
          </h2>

        </div>


        {/* TOTAL PREDICTIONS */}

        <div className="stat-card">

          <Sprout size={28} />

          <h3>
            Total Predictions
          </h3>

          <h2>
            {totalPredictions}
          </h2>

        </div>


        {/* MOST PREDICTED CROP */}

        <div className="stat-card">

          <Wheat size={28} />

          <h3>
            Most Predicted Crop
          </h3>

          <h2>
            {mostPredictedCrop}
          </h2>

        </div>


        {/* MOST ACTIVE STATE */}

        <div className="stat-card">

          <MapPin size={28} />

          <h3>
            Most Active State
          </h3>

          <h2>
            {mostActiveState}
          </h2>

        </div>

      </div>


      {/* =====================================
          RECENT ACTIVITY
      ====================================== */}

      <div className="recent-activity">

        <div className="activity-header">

          <div>

            <h2>
              Recent Activity
            </h2>

            <p>
              Latest crop predictions from farmers
            </p>

          </div>

          <Activity
            size={22}
          />

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Date
                </th>

                <th>
                  User
                </th>

                <th>
                  Activity
                </th>

              </tr>

            </thead>


            <tbody>

              {recentActivity.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="empty-activity"
                  >
                    No recent activity available.
                  </td>

                </tr>

              ) : (

                recentActivity.map(
                  (activity) => (

                    <tr
                      key={activity.id}
                    >

                      <td>

                        {formatDate(
                          activity.date
                        )}

                      </td>


                      <td>

                        {activity.user || "--"}

                      </td>


                      <td>

                        {activity.activity || "--"}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}


export default DashboardOverview;