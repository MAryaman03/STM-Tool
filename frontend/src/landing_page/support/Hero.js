import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section id="supportHero" className="py-5 bg-dark text-white">
      <div className="container">

        {/* Top Row */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h4 className="mb-0">Support Portal</h4>
          <Link to="/track-ticket" className="text-white text-decoration-none">
            Track Tickets
          </Link>
        </div>

        {/* Main Row */}
        <div className="row align-items-start">

          {/* LEFT SIDE */}
          <div className="col-md-7">
            <h2 className="fw-semibold mb-4">
              Search for an answer or browse help topics to create a ticket
            </h2>

            <input
              className="form-control mb-3"
              placeholder="Eg. how do I activate F&O"
            />

            <div className="d-flex flex-wrap gap-3">
              <Link to="/" className="text-white text-decoration-none">
                Track account opening
              </Link>
              <Link to="/" className="text-white text-decoration-none">
                Track segment activation
              </Link>
              <Link to="/" className="text-white text-decoration-none">
                Intraday margins
              </Link>
              <Link to="/" className="text-white text-decoration-none">
                User manual
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-5 text-md-end mt-4 mt-md-0">
            <h5 className="bg-primary d-inline-block px-3 py-1 text-white">
              Featured
            </h5>

            <ol className="mt-3 text-start text-md-end">
              <li>
                <Link to="/" className="text-white text-decoration-none">
                  Current Takeovers and Delisting - January 2024
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white text-decoration-none">
                  Latest Intraday leverages - MIS & CO
                </Link>
              </li>
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;