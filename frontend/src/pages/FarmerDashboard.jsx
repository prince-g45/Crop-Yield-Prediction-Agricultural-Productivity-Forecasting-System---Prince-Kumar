import { useState } from "react";

import Navbar from "../components/Navbar";

import WeatherCard from "../components/WeatherCard";
import PredictionForm from "../components/PredictionForm";
import PredictionResult from "../components/PredictionResult";
import RecentPredictions from "../components/RecentPredictions";

import "../styles/FarmerDashboard.css";

function FarmerDashboard() {

  // Prediction Result State
  const [predictionResult, setPredictionResult] = useState(null);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        {/* Header */}

        <div className="dashboard-header">

          <h1>
Hello, {localStorage.getItem("full_name")} 
</h1>

<p>
Welcome back! Predict your crop yield using YieldSense AI.
</p>

        </div>

        {/* Current Weather */}

        <WeatherCard />

        {/* Prediction Form */}

        <PredictionForm
          setPredictionResult={setPredictionResult}
        />

        {/* Prediction Result */}

        <PredictionResult
          result={predictionResult}
        />

        {/* Recent Predictions */}

        <RecentPredictions />

      </div>

    </>
  );
}

export default FarmerDashboard;