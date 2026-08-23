import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertTriangle,
  Info,
  ArrowUp,
} from "lucide-react";

import "../styles/Footer.css";

function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      {/* =========================================
          MAIN FOOTER
      ========================================== */}

      <div className="footer-content">

        {/* =====================================
            BRAND
        ====================================== */}

        <div className="footer-brand">

          <div className="footer-brand-title">
            <div className="footer-brand-logo">
              Y
            </div>

            <div>
              <h3>
                YieldSense <span>AI</span>
              </h3>

              <p className="footer-tagline">
                Intelligent Agriculture Platform
              </p>
            </div>
          </div>

          <div className="footer-description">

            <p>
              Smarter farming decisions powered by
              crop yield prediction, weather analysis,
              soil insights and artificial intelligence.
            </p>

          </div>

        </div>


        {/* =====================================
            CONTACT
        ====================================== */}

        <div className="footer-column">

          <p className="footer-heading">
            CONTACT US
          </p>


          <div className="contact-item">

            <MapPin size={17} />

            <span>
              Agriculture Support Center
              <br />
              India
            </span>

          </div>


          <div className="contact-item">

            <Phone size={17} />

            <a href="tel:+916299434585">
              +91 6299434585
            </a>

          </div>


          <div className="contact-item">

            <Mail size={17} />

            <a href="mailto:admin@yieldsense.ai">
              princesingh030903@gmail.com
            </a>

          </div>


          <div className="contact-item">

            <Clock size={17} />

            <span>
              Mon – Fri
              <br />
              9:00 AM – 6:00 PM
            </span>

          </div>

        </div>


        {/* =====================================
            EXPLORE
        ====================================== */}

        <div className="footer-column">

          <p className="footer-heading">
            EXPLORE
          </p>

          <Link to="/">
            Home
          </Link>

          <Link to="/farmer-dashboard">
            Dashboard
          </Link>

          <Link to="/farmer-analytics">
            Analytics
          </Link>

          <Link to="/farmer-reports">
            Reports
          </Link>

          <Link to="/about">
            About Us
          </Link>

        </div>


        {/* =====================================
            IMPORTANT INFORMATION
        ====================================== */}

        <div className="footer-column">

          <p className="footer-heading">
            IMPORTANT INFORMATION
          </p>


          <div className="footer-info">

            <div className="footer-info-icon">
              <AlertTriangle size={16} />
            </div>

            <p>
              Yield predictions are estimates based
              on available agricultural, weather and
              soil data.
            </p>

          </div>


          <div className="footer-info">

            <div className="footer-info-icon">
              <Info size={16} />
            </div>

            <p>
              AI recommendations are designed to
              support farming decisions and should
              be considered with local expertise.
            </p>

          </div>


          <div className="footer-info">

            <div className="footer-info-icon">
              <Info size={16} />
            </div>

            <p>
              AI-generated reports do not guarantee
              agricultural outcomes.
            </p>

          </div>

        </div>

      </div>


      {/* =========================================
          BOTTOM
      ========================================== */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} YieldSense AI.
          All Rights Reserved.
        </p>

        <div className="footer-bottom-links">

          <Link to="/about">
            About
          </Link>

          <Link to="/">
            Login
          </Link>

        </div>

      </div>


      {/* =========================================
          BACK TO TOP
      ========================================== */}

      <button
        className="footer-top-button"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp size={19} />
      </button>

    </footer>
  );
}

export default Footer;