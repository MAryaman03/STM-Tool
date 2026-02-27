import React from "react";
import { Link } from "react-router-dom";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <section className="container py-5">
      <div className="row align-items-center gy-4">

        {/* Text Section */}
        <div className="col-lg-6 order-lg-1 order-2">
          <h2 className="fw-bold mb-3">{productName}</h2>

          <p className="text-muted">
            {productDescription}
          </p>

          {learnMore && (
            <div className="mt-3">
              <Link
                to={learnMore}
                className="text-decoration-none fw-semibold"
              >
                Learn More →
              </Link>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="col-lg-6 text-center order-lg-2 order-1">
          {imageURL && (
            <img
              src={imageURL}
              alt={productName}
              className="img-fluid"
              style={{ maxWidth: "90%" }}
            />
          )}
        </div>

      </div>
    </section>
  );
}

export default RightSection;