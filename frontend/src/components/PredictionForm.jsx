import { useState } from "react";
import { predictYield } from "../services/predictionService";

function PredictionForm({ setPredictionResult }) {

  const [formData, setFormData] = useState({
    farm_name: "",
    state: "",
    crop: "",
    season: "",
    area: "",
    fertilizer: "",
    pesticide: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const result = await predictYield(formData);

      setPredictionResult(result);

    } catch (error) {

      console.error(error);

      alert("Prediction failed. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="prediction-card">

      <h2>Crop Yield Prediction</h2>

      <form
        className="prediction-form"
        onSubmit={handlePredict}
      >

        {/* Farm Name */}

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

        {/* State */}

        <div className="form-group">

          <label>State</label>

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >

            <option value="">Select State</option>

            <option>Bihar</option>
            <option>Punjab</option>
            <option>Haryana</option>
            <option>Uttar Pradesh</option>
            <option>Maharashtra</option>
            <option>Madhya Pradesh</option>
            <option>Rajasthan</option>
            <option>West Bengal</option>
            <option>Odisha</option>
            <option>Tamil Nadu</option>

          </select>

        </div>

        {/* Crop */}

        <div className="form-group">

          <label>Crop</label>

          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
          >

            <option value="">Select Crop</option>

            <option>Rice</option>
            <option>Wheat</option>
            <option>Maize</option>
            <option>Cotton</option>
            <option>Sugarcane</option>
            <option>Barley</option>
            <option>Millets</option>
            <option>Pulses</option>

          </select>

        </div>

        {/* Season */}

        <div className="form-group">

          <label>Season</label>

          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
          >

            <option value="">Select Season</option>

            <option>Kharif</option>
            <option>Rabi</option>
            <option>Summer</option>
            <option>Winter</option>
            <option>Whole Year</option>
            <option>Autumn</option>

          </select>

        </div>

        {/* Area */}

        <div className="form-group">

          <label>Area (Hectares)</label>

          <input
            type="number"
            name="area"
            placeholder="Enter Area"
            value={formData.area}
            onChange={handleChange}
            required
          />

        </div>

        {/* Fertilizer */}

        <div className="form-group">

          <label>Fertilizer Used (kg)</label>

          <input
            type="number"
            name="fertilizer"
            placeholder="Enter Fertilizer Quantity"
            value={formData.fertilizer}
            onChange={handleChange}
            required
          />

        </div>

        {/* Pesticide */}

        <div className="form-group">

          <label>Pesticide Used (kg)</label>

          <input
            type="number"
            name="pesticide"
            placeholder="Enter Pesticide Quantity"
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