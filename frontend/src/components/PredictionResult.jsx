import "../styles/PredictionResult.css";

function PredictionResult({
  result,
  variant = "hero",
  onNewPrediction,
}) {

  // ===========================
  // HERO CARD
  // ===========================

  if (variant === "hero") {

    return (

      <div>

        <div className="production-card">

          <h2>Estimated Production</h2>

          <div className="production-value">
            {result
              ? Number(result.estimated_production).toFixed(2)
              : "--"}
          </div>

          <p>Tonnes</p>

          <span>
            {result
              ? "Prediction Completed"
              : "Prediction not available"}
          </span>

        </div>

        {result && (

          <button
            className="new-prediction-btn"
            onClick={onNewPrediction}
          >
            ➕ New Prediction
          </button>

        )}

      </div>

    );

  }

  // ===========================
  // SUMMARY CARD
  // ===========================

  return (

    <div className="summary-card">

      <h2>Prediction Summary</h2>

      {!result ? (

        <div className="no-result">

          <p>No prediction available.</p>

          <small>
            Fill the form and click "Predict Yield".
          </small>

        </div>

      ) : (

        <div className="summary-grid">

          <div className="summary-row">
            <span>Farm Name</span>
            <strong>{result.farm_name}</strong>
          </div>

          <div className="summary-row">
            <span>Detected State</span>
            <strong>{result.state}</strong>
          </div>

          <div className="summary-row">
            <span>Crop</span>
            <strong>{result.crop}</strong>
          </div>

          <div className="summary-row">
            <span>Season</span>
            <strong>{result.season}</strong>
          </div>

          <div className="summary-row">
            <span>Predicted Yield</span>
            <strong>
              {Number(result.predicted_yield).toFixed(2)} t/ha
            </strong>
          </div>

          <div className="summary-row">
            <span>Area</span>
            <strong>
              {Number(result.area).toFixed(2)} ha
            </strong>
          </div>

          <div className="summary-row full-width">

            <span>Prediction Date</span>

            <strong>
              {result.created_at
                ? new Date(result.created_at).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )
                : "-"}
            </strong>

          </div>

        </div>

      )}

    </div>

  );

}

export default PredictionResult;