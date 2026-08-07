import "../styles/SoilAnalysis.css";

function SoilAnalysis({ result }) {

  if (!result) {
    return (
      <div className="soil-card">

        <h2>🌱 Soil Analysis</h2>

        <div className="no-soil">
          <p>No soil analysis available.</p>
          <small>
            Make a prediction to view soil information.
          </small>
        </div>

      </div>
    );
  }

  return (

    <div className="soil-card">

      <h2> Soil Analysis</h2>

      <div className="soil-grid">

        <div className="soil-item">
          <span>Nitrogen (N)</span>
          <strong>{result.N}</strong>
        </div>

        <div className="soil-item">
          <span>Phosphorus (P)</span>
          <strong>{result.P}</strong>
        </div>

        <div className="soil-item">
          <span>Potassium (K)</span>
          <strong>{result.K}</strong>
        </div>

        <div className="soil-item">
          <span>pH Value</span>
          <strong>{result.pH}</strong>
        </div>

        <div className="soil-item full-width">
          <span>Soil Health</span>
          <strong>{result.soil_health}</strong>
        </div>

        <div className="soil-item full-width">
          <span>Recommended Crop</span>
          <strong>{result.recommended_crop}</strong>
        </div>

        <div className="soil-item full-width">
          <span>Recommendation</span>
          <strong>{result.recommendation}</strong>
        </div>

      </div>

    </div>

  );

}

export default SoilAnalysis;