import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="container border-bottom py-5">
      <div className="text-center">

        <h1 className="fw-bold">Technology</h1>

        <h4 className="text-muted mt-3">
          Sleek, modern and intuitive trading platforms
        </h4>

        <p className="mt-4">
          Check out our{" "}
          <Link
            to="/products"
            className="text-decoration-none fw-semibold"
          >
            investment offerings{" "}
            <i className="fa fa-long-arrow-right ms-1"></i>
          </Link>
        </p>

      </div>
    </section>
  );
}

export default Hero;