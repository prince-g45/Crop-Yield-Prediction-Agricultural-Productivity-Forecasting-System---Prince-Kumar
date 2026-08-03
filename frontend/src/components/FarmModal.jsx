import { useEffect, useState } from "react";

function FarmModal({ farm, onClose, onSave }) {
  const [formData, setFormData] = useState({
    farm_name: "",
    crop_name: "",
    area: "",
    location: "",
    season: "",
  });

  useEffect(() => {
    if (farm) {
      setFormData({
        farm_name: farm.farm_name,
        crop_name: farm.crop_name,
        area: farm.area,
        location: farm.location,
        season: farm.season,
      });
    }
  }, [farm]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(formData);
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>
          {farm ? "Edit Farm" : "Add New Farm"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Farm Name</label>

            <input
              type="text"
              name="farm_name"
              value={formData.farm_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Crop Name</label>

            <input
              type="text"
              name="crop_name"
              value={formData.crop_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Area (Acres)</label>

            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
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
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Summer">Summer</option>
            </select>
          </div>

          <div className="modal-buttons">

            <button
              type="submit"
              className="save-btn"
            >
              {farm ? "Update Farm" : "Save Farm"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default FarmModal;