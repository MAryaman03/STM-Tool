import React from "react";
import { Link } from "react-router-dom";

function Brokerage() {
  return (
    <section className="container py-5">
      <div className="row border-top pt-5 align-items-start">

        {/* Brokerage Calculator Section */}
        <div className="col-lg-8 col-md-12 mb-5">
          <Link
            to="/pricing"
            className="text-decoration-none"
          >
            <h3 className="fs-5 fw-semibold mb-4">
              Brokerage calculator
            </h3>
          </Link>

          <ul className="text-muted small lh-lg ps-3">
            <li>
              Call & Trade and RMS auto-squareoff: ₹50 + GST per order.
            </li>
            <li>
              Digital contract notes will be sent via e-mail.
            </li>
            <li>
              Physical contract notes (optional): ₹20 per note + courier charges.
            </li>
            <li>
              NRI (non-PIS): 0.5% or ₹100 per order (whichever lower).
            </li>
            <li>
              NRI (PIS): 0.5% or ₹200 per order (whichever lower).
            </li>
            <li>
              Debit balance accounts: ₹40 per executed order.
            </li>
          </ul>
        </div>

        {/* Charges Section */}
        <div className="col-lg-4 col-md-12">
          <div className="p-4 border rounded shadow-sm h-100">
            <Link
              to="/charges"
              className="text-decoration-none"
            >
              <h3 className="fs-5 fw-semibold mb-3">
                List of charges
              </h3>
            </Link>

            <p className="text-muted small mb-3">
              Detailed breakdown of brokerage, taxes, transaction
              charges and other statutory fees.
            </p>

            <Link
              to="/charges"
              className="text-decoration-none fw-semibold"
            >
              View complete charges →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Brokerage;