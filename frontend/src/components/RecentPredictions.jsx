import { useEffect, useState } from "react";

function RecentPredictions() {

  const [predictions, setPredictions] = useState([]);

  useEffect(() => {

    // Later:
    // Fetch prediction history from backend

    setPredictions([]);

  }, []);

  return (

    <div className="history-card">

      <div className="history-header">

        <h2>Recent Predictions</h2>

      </div>

      <table className="history-table">

        <thead>

          <tr>

            <th>Date</th>

            <th>Farm Name</th>

            <th>Crop</th>

            <th>Yield (t/ha)</th>

          </tr>

        </thead>

        <tbody>

          {predictions.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                className="empty-history"
              >

                No predictions available.

              </td>

            </tr>

          ) : (

            predictions.map((prediction) => (

              <tr key={prediction.id}>

                <td>{prediction.date}</td>

                <td>{prediction.farm_name}</td>

                <td>{prediction.crop}</td>

                <td>{prediction.predicted_yield}</td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default RecentPredictions;