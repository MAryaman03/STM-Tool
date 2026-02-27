import React from "react";

const equityData = [
  { label: "Available margin", value: 4043.1, highlight: true },
  { label: "Used margin", value: 3757.3 },
  { label: "Available cash", value: 4043.1 },
  { label: "Opening Balance", value: 4043.1 },
  { label: "Closing Balance", value: 3736.4 },
  { label: "Payin", value: 4064.0 },
  { label: "SPAN", value: 0 },
  { label: "Delivery margin", value: 0 },
  { label: "Exposure", value: 0 },
  { label: "Options premium", value: 0 },
  { label: "Collateral (Liquid funds)", value: 0 },
  { label: "Collateral (Equity)", value: 0 },
  { label: "Total Collateral", value: 0 },
];

const Funds = () => {
  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <button className="btn btn-green">Add funds</button>
        <button className="btn btn-blue">Withdraw</button>
      </div>

      <div className="row">
        <div className="col">
          <p>Equity</p>

          <div className="table">
            {equityData.map((item, index) => (
              <div className="data" key={index}>
                <p>{item.label}</p>
                <p className={`imp ${item.highlight ? "colored" : ""}`}>
                  ₹{" "}
                  {item.value.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>No commodity account found.</p>
            <button className="btn btn-blue">Open Account</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;