function PredictionResult({ result }) {

  if (!result) {
    return (
      <div className="result-card">

        <h2>Prediction Result</h2>

        <div className="no-result">

          <p>
            No prediction available.
          </p>

          <small>
            Fill the form and click "Predict Yield".
          </small>

        </div>

      </div>
    );
  }

  return (
    <div className="result-card">

      <h2>Prediction Result</h2>

      <div className="result-grid">

        <div className="result-item">

          <label>Farm Name</label>

          <h3>{result.farm_name}</h3>

        </div>

        <div className="result-item">

          <label>Predicted Yield</label>

          <h3>{result.predicted_yield} t/ha</h3>

        </div>

        <div className="result-item">

          <label>Estimated Production</label>

          <h3>{result.production} tonnes</h3>

        </div>

        <div className="result-item">

          <label>Prediction Date</label>

          <h3>{result.date}</h3>

        </div>

      </div>

    </div>
  );
}

export default PredictionResult;