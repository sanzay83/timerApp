import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Privacypolicy from "./components/Privacypolicy";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy" element={<Privacypolicy />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
