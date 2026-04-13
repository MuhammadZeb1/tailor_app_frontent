import React from "react";
import TailoringInvoice from "./pages/TailoringInvoice";
import InvoiceList from "./pages/InvoiceList";
import { Route, Routes } from "react-router-dom";
import UpdateInvoice from "./pages/UpdateInvoice.jsx";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tracker from "./pages/Tracker.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      {/* Toast Container (must be added once) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-invoice" element={<TailoringInvoice />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/update-invoice/:id" element={<UpdateInvoice />} />
        <Route path="/tracker" element={<Tracker/>} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}
