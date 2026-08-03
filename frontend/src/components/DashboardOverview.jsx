import { Users, Sprout, Wheat, MapPin } from "lucide-react";

function DashboardOverview() {

  return (

    <div className="overview-container">

      <div className="page-header">

        <h1>Dashboard</h1>

        <p>
          Welcome to the YieldSense AI administration panel.
        </p>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <Users size={28} />

          <h3>Total Farmers</h3>

          <h2>0</h2>

        </div>

        <div className="stat-card">

          <Sprout size={28} />

          <h3>Total Predictions</h3>

          <h2>0</h2>

        </div>

        <div className="stat-card">

          <Wheat size={28} />

          <h3>Most Predicted Crop</h3>

          <h2>--</h2>

        </div>

        <div className="stat-card">

          <MapPin size={28} />

          <h3>Most Active State</h3>

          <h2>--</h2>

        </div>

      </div>

      <div className="recent-activity">

        <h2>Recent Activity</h2>

        <table>

          <thead>

            <tr>

              <th>Date</th>

              <th>User</th>

              <th>Activity</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td
                colSpan="3"
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No recent activity available.
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default DashboardOverview;