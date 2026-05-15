import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCard from "../../components/ImageCard";

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
        <div className="mb-5 d-flex justify-content-center">
          <ImageCard
            src="/images/homeHero.png"
            alt="Trading dashboard"
            imageClassName="hero-img"
          />
        </div>

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