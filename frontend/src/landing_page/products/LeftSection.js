import React from "react";
import { Link } from "react-router-dom";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <section className="container py-5">
      <div className="row align-items-center">

        {/* Left Image */}
        <div className="col-lg-6 mb-4">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
          />
        </div>

        {/* Right Content */}
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">{productName}</h2>

          <p className="text-muted">
            {productDescription}
          </p>

          {/* CTA Links */}
          <div className="d-flex gap-4 mt-3">
            {tryDemo && (
              <Link to={tryDemo} className="text-decoration-none fw-semibold">
                Try Demo
              </Link>
            )}

            {learnMore && (
              <Link to={learnMore} className="text-decoration-none fw-semibold">
                Learn More
              </Link>
            )}
          </div>

          {/* App Store Buttons */}
          <div className="d-flex gap-4 mt-4">
            {googlePlay && (
              <a href={googlePlay} target="_blank" rel="noreferrer">
                <img
                  src="/images/googlePlayBadge.svg"
                  alt="Google Play"
                  className="img-fluid"
                  style={{ maxWidth: "140px" }}
                />
              </a>
            )}

            {appStore && (
              <a href={appStore} target="_blank" rel="noreferrer">
                <img
                  src="/images/appstoreBadge.svg"
                  alt="App Store"
                  className="img-fluid"
                  style={{ maxWidth: "140px" }}
                />
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default LeftSection;