import React, { useState, useMemo, useCallback } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  refreshDashboard: () => {},
  refreshKey: 0,
});

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ==========================
  // Open Trade Window
  // ==========================
  const openBuyWindow = useCallback((stock) => {
    if (!stock) return;

    setSelectedStock(stock); // { name, price, ... }
    setIsBuyWindowOpen(true);
  }, []);

  // ==========================
  // Close Window
  // ==========================
  const closeBuyWindow = useCallback(() => {
    setIsBuyWindowOpen(false);
    setSelectedStock(null);
  }, []);

  // ==========================
  // Trigger Dashboard Refresh
  // ==========================
  const refreshDashboard = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const value = useMemo(
    () => ({
      openBuyWindow,
      closeBuyWindow,
      refreshDashboard,
      refreshKey,
    }),
    [openBuyWindow, closeBuyWindow, refreshDashboard, refreshKey]
  );

  return (
    <GeneralContext.Provider value={value}>
      {children}

      {isBuyWindowOpen && selectedStock && (
        <BuyActionWindow
          key={selectedStock.name}   // 🔥 forces clean re-mount
          uid={selectedStock.name}
          currentPrice={selectedStock.price}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;