import React, { useState } from "react";

const supportTopics = [
  {
    title: "Account Services",
    links: [
      "Open a Wave Account",
      "Offline Account Process",
      "Business / Partnership Account",
      "NRI Account Services",
      "Account Charges & Fees",
      "KYC & Verification",
      "Profile Update",
      "Close Account Request",
    ],
  },
  {
    title: "Funds & Banking",
    links: [
      "Add Funds",
      "Withdraw Funds",
      "Bank Account Linking",
      "UPI Issues",
      "Payment Failure",
      "Refund Status",
      "Transaction History",
      "Fund Settlement Timeline",
    ],
  },
  {
    title: "Trading & Orders",
    links: [
      "Order Placement Issues",
      "Order Rejected",
      "Modify / Cancel Order",
      "Margin Requirements",
      "Intraday Trading",
      "Delivery Trading",
      "F&O Trading Support",
      "IPO Applications",
    ],
  },
];

function CreateTicket() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!selectedTopic) {
      alert("Please select a topic.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter issue description.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/createTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          topic: selectedTopic,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create ticket");
        return;
      }

      alert("✅ Ticket created successfully!");
      setSelectedCategory("");
      setSelectedTopic("");
      setDescription("");
    } catch (error) {
      alert("⚠️ Server error");
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="row mt-5 mb-4 text-center">
        <h1 className="fw-semibold">Wave Support Center</h1>
        <p className="text-muted">
          Select a topic and submit your ticket.
        </p>
      </div>

      {/* Support Grid */}
      <div className="row">
        {supportTopics.map((section, index) => (
          <div key={index} className="col-md-4 p-4">
            <div className="border rounded p-4 h-100 shadow-sm">
              <h5 className="mb-3">{section.title}</h5>

              {section.links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(section.title);
                    setSelectedTopic(link);
                  }}
                  className={`d-block text-start border-0 bg-transparent mb-2 ${
                    selectedTopic === link
                      ? "fw-bold text-primary"
                      : "text-muted"
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Form Section */}
      {selectedTopic && (
        <div className="row mt-5">
          <div className="col-md-8 mx-auto">
            <div className="border rounded p-4 shadow-sm">
              <h5>Selected Topic:</h5>
              <p className="fw-semibold">{selectedTopic}</p>

              <textarea
                className="form-control mb-3"
                rows="4"
                placeholder="Describe your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="text-end">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="row mt-5 text-center">
        <p className="text-muted">
          Need further assistance? Contact{" "}
          <a href="mailto:support@wave.com">support@wave.com</a>
        </p>
      </div>
    </div>
  );
}

export default CreateTicket;