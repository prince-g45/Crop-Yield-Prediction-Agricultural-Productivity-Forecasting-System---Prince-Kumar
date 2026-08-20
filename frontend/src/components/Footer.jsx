import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* Brand */}
        <div className="footer-brand">
          <h3>
            YieldSense <span>AI</span>
          </h3>

          <p>
            Smarter farming decisions,
            <br />
            powered by intelligence.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-column">
          <p className="footer-heading">Explore</p>

          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About Us</Link>
        </div>

        {/* Admin Help */}
        <div className="footer-column">
          <p className="footer-heading">Admin Help</p>

          <div className="contact-item">
            <Phone size={15} />
            <a href="tel:+919999999999">
              +91 99999 99999
            </a>
          </div>

          <div className="contact-item">
            <Mail size={15} />
            <a href="mailto:admin@yieldsense.ai">
              admin@yieldsense.ai
            </a>
          </div>

          <p className="help-text">
            Contact the administrator for account
            or platform assistance.
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} YieldSense AI • All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;