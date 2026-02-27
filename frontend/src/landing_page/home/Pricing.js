import React from "react";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <section className="premium-pricing">

      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-lg-5 mb-4">
            <h2 className="pricing-title">
              Unbeatable <span className="gradient-text">pricing</span>
            </h2>

            <p className="pricing-subtitle">
              Transparent. Flat. Simple.
              No hidden charges. No surprises.
            </p>

            <Link to="/pricing" className="pricing-link">
              Explore Full Pricing
              <i className="fa fa-long-arrow-right ms-2"></i>
            </Link>
          </div>

          {/* Right Cards */}
          <div className="col-lg-7">
            <div className="row g-4">

              <div className="col-md-6">
                <div className="pricing-card">
                  <h3 className="price-value">₹0</h3>
                  <p>
                    Free equity delivery <br />
                    Direct mutual funds
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="pricing-card highlight-card">
                  <h3 className="price-value">₹20</h3>
                  <p>
                    Intraday & F&O trades <br />
                    Per executed order
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

export default Pricing;