import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  }, []);

  return (
    <section className="hero-section">

      <div className="container text-center">

        {/* Hero Image */}
        <img
          src="/images/homeHero.png"
          alt="Trading dashboard"
          className="img-fluid hero-img mb-4"
        />

        {/* Headline */}
        <h1 className="hero-title">
          Invest in <span className="gradient-text">everything</span>
        </h1>

        <p className="hero-subtitle">
          Trade stocks, derivatives, mutual funds and more —
          all from a single powerful platform.
        </p>

        {/* CTA */}
        {!isLoggedIn && (
          <div className="mt-4">
            <button
              className="hero-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default Hero;