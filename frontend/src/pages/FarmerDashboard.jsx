import { useState } from "react";


import Navbar from "../components/Navbar";
import PredictionForm from "../components/PredictionForm";
import PredictionResult from "../components/PredictionResult";
import SoilAnalysis from "../components/SoilAnalysis";
import RecentPredictions from "../components/RecentPredictions";

import "../styles/FarmerDashboard.css";

function FarmerDashboard() {

  // ===========================
  // States
  // ===========================

  const [predictionResult, setPredictionResult] = useState(null);

  const [resetForm, setResetForm] = useState(false);

  const [refreshHistory, setRefreshHistory] = useState(false);

  // ===========================
  // New Prediction
  // ===========================

  const handleNewPrediction = () => {

    setPredictionResult(null);

    setResetForm(true);

  };

  return (

    <>

      <Navbar />

      <div className="dashboard-container">

        {/* ===========================
            Header
        =========================== */}

        <div className="dashboard-header">

          <h1>
            Hello, {localStorage.getItem("full_name")}
          </h1>

          <p>
            Welcome back! Predict your crop yield using YieldSense AI.
          </p>

        </div>

        {/* ===========================
            Form + Hero Card
        =========================== */}

        <div className="prediction-section">

          <div className="prediction-left">

            <PredictionForm
              setPredictionResult={setPredictionResult}
              resetForm={resetForm}
              setResetForm={setResetForm}
              setRefreshHistory={setRefreshHistory}
            />

          </div>

          <div className="prediction-right">

            <PredictionResult
              result={predictionResult}
              variant="hero"
              onNewPrediction={handleNewPrediction}
            />

          </div>

        </div>

        {/* ===========================
    Prediction Summary
=========================== */}

<div className="summary-section">

  <PredictionResult
    result={predictionResult}
    variant="summary"
  />

</div>

{/* ===========================
    Soil Analysis
=========================== */}

<div className="soil-section">

  <SoilAnalysis
    result={predictionResult}
  />

</div>

{/* ===========================
    Recent Predictions
=========================== */}

<RecentPredictions
  refreshHistory={refreshHistory}
  setRefreshHistory={setRefreshHistory}
/>

      </div>

    </>

  );

}

export default FarmerDashboard;