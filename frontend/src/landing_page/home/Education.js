import React from "react";
import { Link } from "react-router-dom";

function Education() {
  return (
    <section className="container py-5">

      <div className="row align-items-center">

        {/* Left Illustration */}
        <div className="col-lg-6 text-center mb-4 mb-lg-0">
          <img
            src="/images/education.svg"
            alt="Wave education illustration"
            className="img-fluid"
            style={{ maxWidth: "80%" }}
          />
        </div>

        {/* Right Content */}
        <div className="col-lg-6">

          <h2 className="fw-bold mb-4">
            Free and open market education
          </h2>

          <p className="text-muted fs-5">
            <strong>Varsity</strong>, the largest online stock market education
            platform covering everything from basics to advanced trading.
          </p>

          <Link to="/varsity" className="edu-link">
            Explore Varsity
            <i className="fa fa-long-arrow-right ms-2"></i>
          </Link>

          <p className="text-muted fs-5 mt-4">
            <strong>TradingQ&A</strong>, the most active trading and investment
            community in India for all your market-related queries.
          </p>

          <Link to="/community" className="edu-link">
            Visit TradingQ&A
            <i className="fa fa-long-arrow-right ms-2"></i>
          </Link>

        </div>
      </div>

    </section>
  );
}

export default Education;