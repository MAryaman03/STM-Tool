import React from "react";
import { Link } from "react-router-dom";

function Stats() {
  const features = [
    {
      title: "Customer-first always",
      desc: "1.3+ crore customers trust Wave with ₹3.5+ lakh crores worth of equity investments.",
    },
    {
      title: "No spam or gimmicks",
      desc: "No gimmicks, spam, or push notifications. Clean, professional trading experience.",
    },
    {
      title: "The Wave universe",
      desc: "A complete ecosystem with 30+ fintech integrations tailored to your financial needs.",
    },
    {
      title: "Do better with money",
      desc: "With smart nudges and risk controls, we help you trade with discipline.",
    },
  ];

  return (
    <section className="premium-stats">
      <div className="container">

        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-lg-6 mb-5">
            <h2 className="stats-title">
              Trade with <span className="gradient-text">confidence</span>
            </h2>

            <div className="row g-4 mt-3">
              {features.map((item, index) => (
                <div className="col-md-6" key={index}>
                  <div className="stats-card">
                    <h6>{item.title}</h6>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="col-lg-6 text-center">
            <img
              src="/images/ecosystem.png"
              alt="Wave Ecosystem"
              className="img-fluid ecosystem-img"
            />

            <div className="mt-4 d-flex justify-content-center gap-4 flex-wrap">
              <Link to="/products" className="stats-link">
                Explore Products
                <i className="fa fa-long-arrow-right ms-2"></i>
              </Link>

              <Link to="/demo" className="stats-link">
                Try Wave Demo
                <i className="fa fa-long-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Stats;