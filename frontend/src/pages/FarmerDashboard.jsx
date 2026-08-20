import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PredictionForm from "../components/PredictionForm";
import PredictionResult from "../components/PredictionResult";
import RecentPredictions from "../components/RecentPredictions";

import "../styles/FarmerDashboard.css";


function FarmerDashboard() {

  // ==========================================
  // STATES
  // ==========================================

  const [predictionResult, setPredictionResult] =
    useState(null);

  const [resetForm, setResetForm] =
    useState(false);

  const [refreshHistory, setRefreshHistory] =
    useState(false);


  // ==========================================
  // NEW PREDICTION
  // ==========================================

  const handleNewPrediction = () => {

    setPredictionResult(null);

    setResetForm(true);

  };


  // ==========================================
  // USER NAME
  // ==========================================

  const fullName =
    localStorage.getItem("full_name") || "Farmer";


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="farmer-dashboard-page">

      {/* ======================================
          NAVBAR
      ======================================= */}

      <Navbar />


      {/* ======================================
          MAIN CONTENT
      ======================================= */}

      <main className="dashboard-container">

        {/* ====================================
            DASHBOARD HEADER
        ===================================== */}

        <section className="dashboard-header">

          <h1>
            Hello, {fullName}
          </h1>

          <p>
            Predict your crop yield and get
            practical farming insights.
          </p>

        </section>


        {/* ====================================
            PREDICTION SECTION
        ===================================== */}

        <section className="prediction-section">

          {/* LEFT — PREDICTION FORM */}

          <div className="prediction-left">

            <PredictionForm
              setPredictionResult={
                setPredictionResult
              }

              resetForm={resetForm}

              setResetForm={setResetForm}

              setRefreshHistory={
                setRefreshHistory
              }
            />

          </div>


          {/* RIGHT — RESULT */}

          <div className="prediction-right">

            <PredictionResult
              result={predictionResult}
              variant="hero"
              onNewPrediction={
                handleNewPrediction
              }
            />

          </div>

        </section>


        {/* ====================================
            PREDICTION SUMMARY
        ===================================== */}

        <section className="summary-section">

          <PredictionResult
            result={predictionResult}
            variant="summary"
          />

        </section>


        {/* ====================================
            RECENT PREDICTIONS
        ===================================== */}

        <section className="recent-predictions-section">

          <RecentPredictions
            refreshHistory={refreshHistory}
            setRefreshHistory={
              setRefreshHistory
            }
          />

        </section>

      </main>


      {/* ======================================
          FOOTER
      ======================================= */}

      <Footer />

    </div>

  );

}


export default FarmerDashboard;