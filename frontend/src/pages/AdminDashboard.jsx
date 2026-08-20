import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import DashboardOverview from "../components/DashboardOverview";
import FarmerManagement from "../components/FarmerManagement";
import PredictionLogs from "../components/PredictionLogs";
import DatasetManagement from "../components/DatasetManagement";
import Analytics from "../components/Analytics";

import "../styles/AdminDashboard.css";


function AdminDashboard() {

  const [activeSection, setActiveSection] =
    useState("dashboard");


  // ==========================================
  // RENDER ACTIVE SECTION
  // ==========================================

  const renderSection = () => {

    switch (activeSection) {

      case "dashboard":
        return <DashboardOverview />;

      case "farmers":
        return <FarmerManagement />;

      case "predictions":
        return <PredictionLogs />;

      case "datasets":
        return <DatasetManagement />;

      case "analytics":
        return <Analytics />;

      default:
        return <DashboardOverview />;

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="admin-page">

      {/* ======================================
          NAVBAR
      ======================================= */}

      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />


      {/* ======================================
          MAIN ADMIN CONTENT
      ======================================= */}

      <main className="admin-container">

        {renderSection()}

      </main>


      {/* ======================================
          FOOTER
      ======================================= */}

      <Footer />

    </div>

  );

}


export default AdminDashboard;