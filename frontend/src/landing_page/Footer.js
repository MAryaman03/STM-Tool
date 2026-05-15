import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-5" style={{ background: "linear-gradient(180deg, #020617 0%, #041b14 100%)", color: "#ffffff" }}>
      <div className="container pt-5 border-t border-white/10">

        <div className="row gy-4">

          {/* Brand */}
          <div className="col-md-3">
            <img
              src={process.env.PUBLIC_URL + "/images/newlogo.png"}
              alt="Wave Logo"
              style={{ width: "180px", transform: "scale(1.2)", transformOrigin: "left center" }}
              className="mb-3"
            />
            <p className="text-gray-400 small mb-1">
              &copy; 2025 - 2026, Wave Broking Ltd.
            </p>
            <p className="text-gray-400 small">
              Dedicated Support Portal for trading and account assistance.
            </p>
          </div>

          {/* Company */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3 text-white">Company</h6>
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
            <h6 className="fw-semibold mb-3 text-white">Support</h6>
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
            <h6 className="fw-semibold mb-3 text-white">Account</h6>
            <ul className="list-unstyled small">
              <li><Link to="/signup" className="footer-link">Open an Account</Link></li>
              <li><Link to="/fund-transfer" className="footer-link">Fund Transfer</Link></li>
              <li><Link to="/profile" className="footer-link">Profile Settings</Link></li>
              <li><Link to="/security" className="footer-link">Account Security</Link></li>
            </ul>
          </div>

        </div>

        <hr className="my-4 border-white/10" />

        {/* Legal Section */}
        <div
          className="text-gray-400 small"
          style={{ fontSize: "13px", lineHeight: "1.8" }}
        >
          <p>
            Wave Broking Ltd. – Member of NSE & BSE.
            Registered Address: Bengaluru, Karnataka, India.
            For complaints write to <strong className="text-white">complaints@wave.com</strong>.
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

        <div className="text-center text-gray-400 small mt-4 pb-4">
          Built for seamless customer support and transparent assistance.
        </div>

      </div>
    </footer>
  );
}

export default Footer;