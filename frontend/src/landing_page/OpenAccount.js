import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OpenAccount() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <section className="container py-5 my-5 text-center">

      <h2 className="fw-bold mb-3">Open a Wave account</h2>

      <p className="text-muted mb-4">
        Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
        F&O trades.
      </p>

      {!isLoggedIn && (
        <button
          className="btn btn-primary px-4 py-2 fw-semibold"
          onClick={() => navigate("/signup")}
        >
          Sign up Now
        </button>
      )}

    </section>
  );
}

export default OpenAccount;