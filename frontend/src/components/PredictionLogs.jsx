import { useState } from "react";
import { Search, Download } from "lucide-react";

function PredictionLogs() {

  const [predictions] = useState([]);

  return (

    <div className="management-container">

      <div className="page-header">

        <h1>Prediction Logs</h1>

        <p>
          View all crop yield predictions made by farmers.
        </p>

      </div>

      {/* Filters */}

      <div className="filters">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search farmer..."
          />

        </div>

        <select>

          <option>All Crops</option>

        </select>

        <select>

          <option>All States</option>

        </select>

        <input type="date" />

        <button className="export-btn">

          <Download size={18} />

          Export CSV

        </button>

      </div>

      {/* Prediction Table */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Farmer</th>

              <th>Farm</th>

              <th>Crop</th>

              <th>State</th>

              <th>Area</th>

              <th>Yield</th>

              <th>Date</th>

            </tr>

          </thead>

          <tbody>

            {predictions.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-row"
                >

                  No prediction records found.

                </td>

              </tr>

            ) : (

              predictions.map((prediction) => (

                <tr key={prediction.id}>

                  <td>{prediction.farmer_name}</td>

                  <td>{prediction.farm_name}</td>

                  <td>{prediction.crop}</td>

                  <td>{prediction.state}</td>

                  <td>{prediction.area}</td>

                  <td>{prediction.predicted_yield}</td>

                  <td>{prediction.created_at}</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default PredictionLogs;