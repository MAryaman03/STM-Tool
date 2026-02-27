import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Dashboard Route */}
        <Route path="/*" element={<Dashboard />} />

        {/* Optional Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;