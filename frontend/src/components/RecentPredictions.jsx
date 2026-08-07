import { useEffect, useState } from "react";

import {
  getPredictionHistory,
  deletePrediction,
} from "../services/predictionService";

function RecentPredictions({
  refreshHistory,
  setRefreshHistory,
}) {

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================================
  // Load Prediction History
  // ==================================

  const loadHistory = async () => {

    try {

      setLoading(true);

      const data = await getPredictionHistory();

      setPredictions(data);

    } catch (error) {

      console.error(error);

      alert("Unable to load prediction history.");

    } finally {

      setLoading(false);

    }

  };

  // Initial Load
  useEffect(() => {

    loadHistory();

  }, []);

  // Auto Refresh After Prediction
  useEffect(() => {

    if (refreshHistory) {

      loadHistory();

      setRefreshHistory(false);

    }

  }, [refreshHistory, setRefreshHistory]);

  // ==================================
  // Delete Prediction
  // ==================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this prediction permanently?"
    );

    if (!confirmDelete) return;

    try {

      await deletePrediction(id);

      // Reload Table
      loadHistory();

    } catch (error) {

      console.error(error);

      alert("Unable to delete prediction.");

    }

  };

  return (

    <div className="history-card">

      <div className="history-header">

        <div>

          <h2>Recent Predictions</h2>

          <p>Your latest crop yield predictions</p>

        </div>

      </div>

      {loading ? (

        <div className="empty-history">

          <h3>Loading...</h3>

        </div>

      ) : predictions.length === 0 ? (

        <div className="empty-history">

          <h3>No Predictions Yet</h3>

          <p>
            Your recent crop yield predictions will appear here after you make a prediction.
          </p>

        </div>

      ) : (

        <div className="table-container">

          <table className="history-table">

            <thead>

              <tr>

                <th>Date</th>

                <th>Farm</th>

                <th>Crop</th>

                <th>Season</th>

                <th>Yield</th>

                <th>Production</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {predictions.map((prediction) => (

                <tr key={prediction.id}>

                  <td>
                    {new Date(
                      prediction.created_at
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td>{prediction.farm_name}</td>

                  <td>{prediction.crop}</td>

                  <td>{prediction.season}</td>

                  <td>
                    {Number(
                      prediction.predicted_yield
                    ).toFixed(2)} t/ha
                  </td>

                  <td>
                    {Number(
                      prediction.estimated_production
                    ).toFixed(2)} tonnes
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(prediction.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default RecentPredictions;