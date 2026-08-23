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


  // ==========================================
  // LOAD METADATA
  // ==========================================

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


  // ==========================================
  // RESET
  // ==========================================

  useEffect(() => {

    if (resetForm) {

      setFormData(initialFormData);

      setResetForm(false);

    }

  }, [resetForm, setResetForm]);


  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {

    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));

  };


  // ==========================================
  // PREDICT
  // ==========================================

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

          setPredictionResult(result);

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


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="yield-prediction-card">

      <div className="yield-prediction-header">

        <h2>Crop Yield Prediction</h2>

        <p>
          Enter your farm details to estimate crop yield.
        </p>

      </div>


      <form
        className="yield-prediction-form"
        onSubmit={handlePredict}
      >

        {/* FARM NAME */}

        <div className="yield-form-group">

          <label htmlFor="farm_name">
            Farm Name
          </label>

          <input
            id="farm_name"
            type="text"
            name="farm_name"
            placeholder="Enter Farm Name"
            value={formData.farm_name}
            onChange={handleChange}
            required
          />

        </div>


        {/* CROP */}

        <div className="yield-form-group">

          <label htmlFor="crop">
            Crop
          </label>

          <select
            id="crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Crop
            </option>

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


        {/* SEASON */}

        <div className="yield-form-group">

          <label htmlFor="season">
            Season
          </label>

          <select
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Season
            </option>

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


        {/* AREA */}

        <div className="yield-form-group">

          <label htmlFor="area">
            Area (ha)
          </label>

          <input
            id="area"
            type="number"
            name="area"
            step="0.01"
            placeholder="e.g. 12.5"
            value={formData.area}
            onChange={handleChange}
            required
          />

        </div>


        {/* FERTILIZER */}

        <div className="yield-form-group">

          <label htmlFor="fertilizer">
            Fertilizer (kg)
          </label>

          <input
            id="fertilizer"
            type="number"
            name="fertilizer"
            step="0.01"
            placeholder="e.g. 250"
            value={formData.fertilizer}
            onChange={handleChange}
            required
          />

        </div>


        {/* PESTICIDE */}

        <div className="yield-form-group">

          <label htmlFor="pesticide">
            Pesticide (kg)
          </label>

          <input
            id="pesticide"
            type="number"
            name="pesticide"
            step="0.01"
            placeholder="e.g. 18"
            value={formData.pesticide}
            onChange={handleChange}
            required
          />

        </div>


        {/* BUTTON */}

        <button
          type="submit"
          className="yield-predict-btn"
          disabled={loading}
        >

          {loading
            ? "Predicting..."
            : "Predict Yield"}

        </button>

      </form>

    </div>

  );

}

export default PredictionForm;