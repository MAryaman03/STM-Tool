import React, { useState, useCallback, useEffect } from "react";
import api from "../utils/api";

const formatCurrency = (value) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Funds = () => {
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(null); // "add" | "withdraw" | null
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  // Fetch balance from backend on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/funds/balance");
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };
    fetchBalance();
  }, []);

  // Build equity data dynamically from current balance
  const equityData = [
    { label: "Available margin", value: balance, highlight: true },
    { label: "Used margin", value: 0 },
    { label: "Available cash", value: balance },
    { label: "Opening Balance", value: balance },
    { label: "Payin", value: balance },
    { label: "SPAN", value: 0 },
    { label: "Delivery margin", value: 0 },
    { label: "Exposure", value: 0 },
    { label: "Options premium", value: 0 },
    { label: "Collateral (Liquid funds)", value: 0 },
    { label: "Collateral (Equity)", value: 0 },
    { label: "Total Collateral", value: 0 },
  ];

  const handleSubmit = useCallback(async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setStatus("⚠️ Please enter a valid amount.");
      return;
    }

    if (showModal === "withdraw" && val > balance) {
      setStatus("⚠️ Insufficient funds for this withdrawal.");
      return;
    }

    try {
      const endpoint = showModal === "add" ? "/funds/add" : "/funds/withdraw";
      const res = await api.post(endpoint, { amount: val });

      setBalance(res.data.balance);
      setStatus(
        showModal === "add"
          ? `✅ ₹${formatCurrency(val)} added to your account successfully!`
          : `✅ ₹${formatCurrency(val)} withdrawal request submitted!`
      );
    } catch (err) {
      setStatus(`⚠️ ${err.response?.data?.error || "Transaction failed."}`);
    }

    setAmount("");
    setTimeout(() => {
      setShowModal(null);
      setStatus("");
    }, 2000);
  }, [amount, showModal, balance]);

  return (
    <>
      <h3 className="title">Funds</h3>

      {/* Balance Highlight */}
      <div className="funds-balance-card">
        <div className="funds-balance-info">
          <p className="funds-balance-label">Account Balance</p>
          <h2 className="funds-balance-amount">₹{formatCurrency(balance)}</h2>
        </div>
        <div className="funds-actions">
          <button className="btn btn-green" onClick={() => { setShowModal("add"); setStatus(""); setAmount(""); }}>
            + Add Funds
          </button>
          <button className="btn btn-blue" onClick={() => { setShowModal("withdraw"); setStatus(""); setAmount(""); }}>
            Withdraw
          </button>
        </div>
      </div>

      {/* Fund Transfer Modal */}
      {showModal && (
        <div className="funds-modal-overlay" onClick={() => setShowModal(null)}>
          <div className="funds-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{showModal === "add" ? "Add Funds" : "Withdraw Funds"}</h4>
            <p className="funds-modal-sub">
              {showModal === "add"
                ? "Enter the amount you'd like to add to your trading account."
                : `Available balance: ₹${formatCurrency(balance)}`}
            </p>

            <div className="funds-modal-input">
              <span className="funds-modal-currency">₹</span>
              <input
                type="number"
                min="1"
                step="100"
                placeholder="0.00"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setStatus(""); }}
                autoFocus
              />
            </div>

            {/* Quick amount buttons */}
            <div className="funds-quick-amounts">
              {[1000, 5000, 10000, 25000].map((val) => (
                <button key={val} className="funds-quick-btn" onClick={() => setAmount(String(val))}>
                  ₹{val.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            {status && (
              <div className={`funds-modal-status ${status.includes("✅") ? "success" : "warning"}`}>
                {status}
              </div>
            )}

            <div className="funds-modal-actions">
              <button
                className={`btn ${showModal === "add" ? "btn-green" : "btn-blue"}`}
                onClick={handleSubmit}
              >
                {showModal === "add" ? "Add Funds" : "Withdraw"}
              </button>
              <button className="btn btn-grey" onClick={() => setShowModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="funds-grid">

        {/* Equity Column */}
        <div className="funds-section">
          <div className="funds-section-header">
            <span className="funds-section-dot equity" />
            <h4>Equity</h4>
          </div>

          <div className="funds-table">
            {equityData.map((item, index) => (
              <div className="funds-row" key={index}>
                <span className="funds-label">{item.label}</span>
                <span className={`funds-value ${item.highlight ? "highlight" : ""}`}>
                  ₹{formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Column */}
        <div className="funds-section">
          <div className="funds-section-header">
            <span className="funds-section-dot commodity" />
            <h4>Commodity</h4>
          </div>

          <div className="funds-empty-state">
            <div className="funds-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <p>No commodity account found.</p>
            <button className="btn btn-blue" style={{ marginTop: "12px" }}>
              Open Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;