import React from "react";
import TailoringInvoice from "./pages/TailoringInvoice";
import InvoiceList from "./pages/InvoiceList";
import { Route, Routes } from "react-router-dom";
import UpdateInvoice from "./pages/updateInvoice";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
// import ServiceFilterBar from "./components/ServiceFilterBar";

export default function App() {
 return (
  <>
    <Navbar /> 
    <Routes>
    {/* <Route path="/ll" element={<ServiceFilterBar />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/create-invoice" element={<TailoringInvoice />} />
      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/update-invoice/:id" element={<UpdateInvoice />} />
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  </>
);
}
