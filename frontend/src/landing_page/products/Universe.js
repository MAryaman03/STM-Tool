import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Universe() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(status === "true");
  }, []);

  const partners = [
    {
      name: "Smallcase",
      desc: "Thematic investment platform",
      logo: "/images/smallcaseLogo.png",
    },
    {
      name: "Analytics Pro",
      desc: "Investment analytics platform",
      logo: "/images/smallcaseLogo.png",
    },
    {
      name: "PortfolioX",
      desc: "Portfolio management platform",
      logo: "/images/smallcaseLogo.png",
    },
    {
      name: "MutualHub",
      desc: "Mutual fund platform",
      logo: "/images/smallcaseLogo.png",
    },
    {
      name: "BondStreet",
      desc: "Bond investment platform",
      logo: "/images/smallcaseLogo.png",
    },
    {
      name: "GlobalTrade",
      desc: "Global investing platform",
      logo: "/images/smallcaseLogo.png",
    },
  ];

  return (
    <section className="container py-5">

      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">The Wave Universe</h2>
        <p className="text-muted">
          Extend your trading and investment experience
          with our partner platforms.
        </p>
      </div>

      {/* Partner Grid */}
      <div className="row g-4">
        {partners.map((partner, index) => (
          <div className="col-lg-4 col-md-6 text-center" key={index}>
            <div className="p-4 border rounded shadow-sm h-100">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                style={{ maxWidth: "120px" }}
                className="mb-3"
              />
              <h6 className="fw-semibold">{partner.name}</h6>
              <p className="text-muted small mb-0">
                {partner.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {!isLoggedIn && (
        <div className="text-center mt-5">
          <button
            className="btn btn-primary px-4 py-2"
            onClick={() => navigate("/signup")}
          >
            Signup Now
          </button>
        </div>
      )}

    </section>
  );
}

export default Universe;