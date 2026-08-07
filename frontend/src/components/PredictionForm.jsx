import "../styles/PredictionForm.css";

import { useEffect, useState } from "react";
import {
  predictYield,
  getPredictionMetadata,
} from "../services/predictionService";

function PredictionForm({
  setPredictionResult,
  resetForm,
  setResetForm,
  setRefreshHistory,
}) {

  // ===========================
  // Initial Form Data
  // ===========================

  const initialFormData = {
    farm_name: "",
    crop: "",
    season: "",
    area: "",
    fertilizer: "",
    pesticide: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [crops, setCrops] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===========================
  // Load Metadata
  // ===========================

  useEffect(() => {

    const loadMetadata = async () => {

      try {

        const data = await getPredictionMetadata();

        setCrops(data.crops);
        setSeasons(data.seasons);

      } catch (error) {

        console.error(error);

        alert("Unable to load crops and seasons.");

      }

    };

    loadMetadata();

  }, []);

  // ===========================
  // Reset Form
  // ===========================

  useEffect(() => {

    if (resetForm) {

      setFormData(initialFormData);

      setResetForm(false);

    }

  }, [resetForm, setResetForm]);

  // ===========================
  // Handle Change
  // ===========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // ===========================
  // Predict
  // ===========================

  const handlePredict = async (e) => {

    e.preventDefault();

    setLoading(true);

    if (!navigator.geolocation) {

      alert("Geolocation is not supported.");

      setLoading(false);

      return;

    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const payload = {

            ...formData,

            latitude: position.coords.latitude,

            longitude: position.coords.longitude,

          };

          const result = await predictYield(payload);

          // Update Hero Card + Summary
          setPredictionResult(result);

          // Refresh History Table
          if (setRefreshHistory) {
            setRefreshHistory(true);
          }

        } catch (error) {

          console.error(error);

          alert("Prediction failed.");

        } finally {

          setLoading(false);

        }

      },

      () => {

        alert("Please allow location access.");

        setLoading(false);

      }

    );

  };

  return (

    <div className="prediction-card">

      <h2>Crop Yield Prediction</h2>

      <form
        className="prediction-form"
        onSubmit={handlePredict}
      >

        <div className="form-group">

          <label>Farm Name</label>

          <input
            type="text"
            name="farm_name"
            placeholder="Enter Farm Name"
            value={formData.farm_name}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>Crop</label>

          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
          >

            <option value="">Select Crop</option>

            {crops.map((crop) => (

              <option
                key={crop}
                value={crop}
              >
                {crop}
              </option>

            ))}

          </select>

        </div>

        <div className="form-group">

          <label>Season</label>

          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
          >

            <option value="">Select Season</option>

            {seasons.map((season) => (

              <option
                key={season}
                value={season}
              >
                {season}
              </option>

            ))}

          </select>

        </div>

        <div className="form-group">

          <label>Area (ha)</label>

          <input
            type="number"
            name="area"
            step="0.01"
            placeholder="e.g. 12.5"
            value={formData.area}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>Fertilizer (kg)</label>

          <input
            type="number"
            name="fertilizer"
            step="0.01"
            placeholder="e.g. 250"
            value={formData.fertilizer}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>Pesticide (kg)</label>

          <input
            type="number"
            name="pesticide"
            step="0.01"
            placeholder="e.g. 18"
            value={formData.pesticide}
            onChange={handleChange}
            required
          />

        </div>

        <button
          type="submit"
          className="predict-btn"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Yield"}
        </button>

      </form>

    </div>

  );

}

export default PredictionForm;