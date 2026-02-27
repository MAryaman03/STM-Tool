import React from "react";

import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function PricingPage() {
  return (
    <>
      <Hero />

      <LeftSection
        imageURL="/images/kite.png"
        productName="Wave"
        productDescription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, and elegant UI. Available on Android and iOS."
        tryDemo="/demo"
        learnMore="/products/wave"
        googlePlay="https://play.google.com"
        appStore="https://apple.com/app-store"
      />

      <RightSection
        imageURL="/images/console.png"
        productName="Console"
        productDescription="The central dashboard for your Wave account. Gain insights into your trades and investments with in-depth reports and visualisations."
        learnMore="/products/console"
      />

      <LeftSection
        imageURL="/images/coin.png"
        productName="Tides"
        productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account."
        tryDemo="/demo"
        learnMore="/products/tides"
        googlePlay="https://play.google.com"
        appStore="https://apple.com/app-store"
      />

      <RightSection
        imageURL="/images/kiteconnect.png"
        productName="Wave Connect API"
        productDescription="Build powerful trading platforms using our simple HTTP/JSON APIs."
        learnMore="/products/api"
      />

      <LeftSection
        imageURL="/images/varsity.png"
        productName="Varsity mobile"
        productDescription="Stock market lessons with in-depth coverage and illustrations. Learn on the go."
        tryDemo="/demo"
        learnMore="/products/varsity"
        googlePlay="https://play.google.com"
        appStore="https://apple.com/app-store"
      />

      <div className="text-center my-5">
        <p>
          Want to know more about our technology stack?{" "}
          <a
            href="https://wave.tech"
            target="_blank"
            rel="noreferrer"
            className="fw-semibold text-decoration-none"
          >
            Visit Wave.tech →
          </a>
        </p>
      </div>

      <Universe />
    </>
  );
}

export default PricingPage;