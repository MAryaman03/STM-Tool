import React from "react";

function Awards() {
  return (
    <section className="container py-5">

      <div className="row align-items-center">

        {/* Left Image */}
        <div className="col-lg-6 text-center mb-4 mb-lg-0">
          <img
            src="/images/largestBroker.svg"
            alt="Largest Broker Illustration"
            className="img-fluid"
            style={{ maxWidth: "85%" }}
          />
        </div>

        {/* Right Content */}
        <div className="col-lg-6">

          <h2 className="fw-bold mb-4">
            Largest stock broker in India
          </h2>

          <p className="text-muted mb-4 fs-5">
            2+ million Wave clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>

          <div className="row">

            <div className="col-6">
              <ul className="list-unstyled feature-list">
                <li>Futures and Options</li>
                <li>Commodity derivatives</li>
                <li>Currency derivatives</li>
              </ul>
            </div>

            <div className="col-6">
              <ul className="list-unstyled feature-list">
                <li>Stocks & IPOs</li>
                <li>Direct mutual funds</li>
                <li>Bonds & Govt. Securities</li>
              </ul>
            </div>

          </div>

          <div className="mt-4">
            <img
              src="/images/pressLogos.png"
              alt="Press Logos"
              className="img-fluid opacity-75"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Awards;