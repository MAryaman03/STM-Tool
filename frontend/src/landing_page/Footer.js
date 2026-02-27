import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-light mt-5">
      <div className="container pt-5 border-top">

        <div className="row gy-4">

          {/* Brand */}
          <div className="col-md-3">
            <img
              src="/images/logo.svg"
              alt="Wave Logo"
              style={{ width: "120px" }}
              className="mb-3"
              onError={(e) => (e.target.style.display = "none")}
            />
            <p className="text-muted small mb-1">
              &copy; 2025 - 2026, Not Wave Broking Ltd.
            </p>
            <p className="text-muted small">
              Dedicated Support Portal for trading and account assistance.
            </p>
          </div>

          {/* Company */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/product" className="footer-link">Products</Link></li>
              <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
              <li><Link to="/careers" className="footer-link">Careers</Link></li>
              <li><Link to="/press" className="footer-link">Press & Media</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li><Link to="/support" className="footer-link">Support Portal</Link></li>
              <li><Link to="/track-ticket" className="footer-link">Track Tickets</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/downloads" className="footer-link">Downloads</Link></li>
              <li><Link to="/charges" className="footer-link">List of Charges</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Account</h6>
            <ul className="list-unstyled small">
              <li><Link to="/signup" className="footer-link">Open an Account</Link></li>
              <li><Link to="/fund-transfer" className="footer-link">Fund Transfer</Link></li>
              <li><Link to="/profile" className="footer-link">Profile Settings</Link></li>
              <li><Link to="/security" className="footer-link">Account Security</Link></li>
            </ul>
          </div>

        </div>

        <hr className="my-4" />

        {/* Legal Section */}
        <div
          className="text-muted small"
          style={{ fontSize: "13px", lineHeight: "1.8" }}
        >
          <p>
            Wave Broking Ltd. – Member of NSE & BSE.
            Registered Address: Bengaluru, Karnataka, India.
            For complaints write to <strong>complaints@wave.com</strong>.
          </p>

          <p>
            Investments in securities market are subject to market risks.
            Read all related documents carefully before investing.
          </p>

          <p>
            Prevent unauthorized transactions. Update your contact details
            with your broker to receive exchange alerts directly.
          </p>

          <p>
            Wave does not provide stock tips or authorize third parties to trade
            on behalf of clients. If someone claims so, please create a support ticket.
          </p>
        </div>

        <div className="text-center text-muted small mt-4 pb-4">
          Built for seamless customer support and transparent assistance.
        </div>

      </div>
    </footer>
  );
}

export default Footer;