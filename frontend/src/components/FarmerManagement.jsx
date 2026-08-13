import { useEffect, useState } from "react";

import {
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  Search,
} from "lucide-react";

import {
  getFarmers,
  updateFarmerStatus,
  deleteFarmer,
} from "../services/adminService";


function FarmerManagement() {

  // ==========================================
  // STATE
  // ==========================================

  const [search, setSearch] = useState("");

  const [farmers, setFarmers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);


  // ==========================================
  // LOAD FARMERS
  // ==========================================

  const loadFarmers = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getFarmers();

      setFarmers(data);

    } catch (err) {

      console.error(
        "Failed to load farmers:",
        err
      );

      setError(
        "Unable to load farmers."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadFarmers();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredFarmers = farmers.filter(
    (farmer) => {

      const searchText =
        search.toLowerCase().trim();

      return (

        farmer.full_name
          ?.toLowerCase()
          .includes(searchText)

        ||

        farmer.email
          ?.toLowerCase()
          .includes(searchText)

      );

    }
  );


  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const handleStatusToggle = async (
    farmer
  ) => {

    try {

      setUpdatingId(farmer.id);

      const updated =
        await updateFarmerStatus(
          farmer.id
        );


      setFarmers(
        (currentFarmers) =>
          currentFarmers.map(
            (item) =>
              item.id === farmer.id
                ? {
                    ...item,
                    is_active:
                      updated.farmer.is_active,
                  }
                : item
          )
      );

    } catch (err) {

      console.error(err);

      alert(
        "Unable to update farmer status."
      );

    } finally {

      setUpdatingId(null);

    }

  };


  // ==========================================
  // DELETE FARMER
  // ==========================================

  const handleDelete = async (
    farmer
  ) => {

    const confirmed = window.confirm(
      `Delete ${farmer.full_name}? This will also delete their farms and predictions.`
    );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(farmer.id);

      await deleteFarmer(
        farmer.id
      );


      setFarmers(
        (currentFarmers) =>
          currentFarmers.filter(
            (item) =>
              item.id !== farmer.id
          )
      );

    } catch (err) {

      console.error(err);

      alert(
        "Unable to delete farmer."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "--";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="management-container">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <h1>
          Farmer Management
        </h1>

        <p>
          View and manage registered farmers.
        </p>

      </div>


      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="search-box">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search farmer or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (

        <div className="management-error">

          {error}

        </div>

      )}


      {/* =====================================
          TABLE
      ====================================== */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Joined
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="empty-row"
                >
                  Loading farmers...
                </td>

              </tr>

            ) : filteredFarmers.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="empty-row"
                >
                  No farmers found.
                </td>

              </tr>

            ) : (

              filteredFarmers.map(
                (farmer) => (

                  <tr
                    key={farmer.id}
                  >

                    {/* NAME */}

                    <td>

                      <strong>
                        {farmer.full_name}
                      </strong>

                    </td>


                    {/* EMAIL */}

                    <td>
                      {farmer.email}
                    </td>


                    {/* JOINED */}

                    <td>

                      {formatDate(
                        farmer.created_at
                      )}

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          farmer.is_active
                            ? "status active"
                            : "status inactive"
                        }
                      >

                        <span className="status-dot" />

                        {farmer.is_active
                          ? "Active"
                          : "Inactive"}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="farmer-actions">

                        {/* VIEW */}

                        <button
                          className="action-btn view"
                          title="View farmer"
                          onClick={() =>
                            alert(
                              `Name: ${farmer.full_name}\nEmail: ${farmer.email}`
                            )
                          }
                        >

                          <Eye size={16} />

                        </button>


                        {/* ACTIVE / INACTIVE */}

                        <button
                          className={
                            farmer.is_active
                              ? "action-btn block"
                              : "action-btn activate"
                          }
                          title={
                            farmer.is_active
                              ? "Deactivate farmer"
                              : "Activate farmer"
                          }
                          disabled={
                            updatingId ===
                            farmer.id
                          }
                          onClick={() =>
                            handleStatusToggle(
                              farmer
                            )
                          }
                        >

                          {farmer.is_active ? (

                            <Ban size={16} />

                          ) : (

                            <CheckCircle
                              size={16}
                            />

                          )}

                        </button>


                        {/* DELETE */}

                        <button
                          className="action-btn delete"
                          title="Delete farmer"
                          disabled={
                            deletingId ===
                            farmer.id
                          }
                          onClick={() =>
                            handleDelete(
                              farmer
                            )
                          }
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}


export default FarmerManagement;