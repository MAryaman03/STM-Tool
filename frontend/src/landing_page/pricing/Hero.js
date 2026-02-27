import React from "react";

function PricingHero() {
  const pricingData = [
    {
      img: "/images/pricingEquity.svg",
      alt: "Free equity delivery",
      title: "Free equity delivery",
      desc:
        "All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.",
    },
    {
      img: "/images/intradayTrades.svg",
      alt: "Intraday trading",
      title: "Intraday and F&O trades",
      desc:
        "Flat ₹20 or 0.03% (whichever is lower) per executed order.",
    },
    {
      img: "/images/pricingEquity.svg",
      alt: "Direct mutual funds",
      title: "Free direct MF",
      desc:
        "All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.",
    },
  ];

  return (
    <section className="container py-5">
      
      {/* Heading */}
      <div className="text-center mb-5 border-bottom pb-4">
        <h1 className="fw-bold">Pricing</h1>
        <p className="text-muted fs-5 mt-3">
          Free equity investments and flat ₹20 intraday and F&O trades
        </p>
      </div>

      {/* Cards */}
      <div className="row text-center g-4">
        {pricingData.map((item, index) => (
          <div className="col-lg-4 col-md-6" key={index}>
            <img
              src={item.img}
              alt={item.alt}
              className="img-fluid mb-3"
              style={{ maxHeight: "120px" }}
            />
            <h3 className="fs-4">{item.title}</h3>
            <p className="text-muted">{item.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default PricingHero;