import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoices,
  deleteInvoice,
} from "../feathures/invoice/invoiceSlice";
import { useNavigate } from "react-router-dom";
import ServiceFilterBar from "../components/ServiceFilterBar";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading, error } = useSelector((state) => state.invoice);

  // State for expanding/collapsing invoice cards
  const [expandedRows, setExpandedRows] = useState({});

  // States for Sidebar Filters
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [refNumber, setRefNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      dispatch(deleteInvoice(id));
    }
  };

  // Logic to clear all filters
  const resetFilters = () => {
    setInvoiceNumber("");
    setRefNumber("");
    setCustomerName("");
    setContactNo("");
    setFromDate("");
    setToDate("");
    setStatusFilter("all");
  };

  // Filtering Logic connected to Sidebar States
  const filteredInvoices = invoices.filter((inv) => {
    const matchesName = inv.customerName
      .toLowerCase()
      .includes(customerName.toLowerCase());
    const matchesPhone = inv.contactNo.includes(contactNo);
    const matchesInv =
      !invoiceNumber || inv.invoiceNumber.toString().includes(invoiceNumber);
    const matchesRef =
      !refNumber ||
      (inv.refNumber &&
        inv.refNumber.toLowerCase().includes(refNumber.toLowerCase()));

    // Status logic: if balance is 0, it's 'completed', otherwise 'pending'
    const status = inv.balanceAmount <= 0 ? "completed" : "pending";
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    // Date filtering logic
    const bookingDate = new Date(inv.bookingDate);
    const matchesFromDate = !fromDate || bookingDate >= new Date(fromDate);
    const matchesToDate = !toDate || bookingDate <= new Date(toDate);

    return (
      matchesName &&
      matchesPhone &&
      matchesInv &&
      matchesRef &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate
    );
  });

  return (
    /* MAIN WRAPPER: 'flex' puts sidebar and content side-by-side */
    <div className="flex bg-gray-100 min-h-screen w-full">
      {/* 1. SIDEBAR SECTION */}
      <div className="no-print shrink-0">
        <ServiceFilterBar
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          refNumber={refNumber}
          setRefNumber={setRefNumber}
          customerName={customerName}
          setCustomerName={setCustomerName}
          contactNo={contactNo}
          setContactNo={setContactNo}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onReset={resetFilters}
        />
      </div>

      {/* 2. MAIN CONTENT SECTION: 'flex-1' fills the remaining width */}
      <div className="flex-1 p-4 md:p-8 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 no-print">
            <h2 className="text-2xl font-bold text-gray-800">
              Invoice History
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({filteredInvoices.length} Results)
              </span>
            </h2>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <p className="text-center no-print py-10">Loading records...</p>
          )}
          {error && (
            <p className="text-red-500 text-center no-print py-10">
              Error: {error}
            </p>
          )}

          {/* Invoice Cards List */}
          <div className="space-y-3">
            {filteredInvoices.map((inv) => (
              <div
                key={inv._id}
                className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden"
              >
                {/* INVOICE CARD HEADER */}
                <div
                  className="flex justify-between items-center p-4 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-50 no-print"
                  onClick={() => toggleRow(inv._id)}
                >
                  <div className="flex gap-8 items-center">
                    <div className="bg-black text-white px-3 py-1 rounded text-center min-w-[60px]">
                      <p className="text-[10px] uppercase font-bold leading-tight opacity-70">
                        No.
                      </p>
                      <p className="text-sm font-black leading-tight">
                        {inv.invoiceNumber}
                      </p>
                    </div>

                    <div className="flex flex-col border-r-2 border-gray-200 pr-6">
                      <h3 className="text-xl font-black text-black uppercase tracking-tight leading-none">
                        {inv.customerName}
                      </h3>
                      <p className="text-blue-700 font-bold text-sm mt-1 tracking-widest">
                        {inv.contactNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Balance
                      </p>
                      <p
                        className={`font-black ${inv.balanceAmount > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        Rs. {inv.balanceAmount}
                      </p>
                    </div>
                    <span
                      className={`text-xl transition-transform ${expandedRows[inv._id] ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* EXPANDED INVOICE DETAILS */}
                {expandedRows[inv._id] && (
                  <div className="p-6 bg-white printable" dir="rtl">
                    {/* Action Buttons */}
                    <div
                      className="flex justify-between items-center mb-4 no-print"
                      dir="ltr"
                    >
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/update-invoice/${inv._id}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-xs hover:bg-blue-700 transition-all uppercase"
                        >
                          Edit / Update
                        </button>
                        <button
                          onClick={() => handleDelete(inv._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded font-bold text-xs hover:bg-red-700 transition-all uppercase"
                        >
                          Delete
                        </button>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="bg-black text-white px-5 py-2 rounded font-black text-xs hover:bg-gray-800 transition-all uppercase tracking-tighter"
                      >
                        Print Physical Invoice
                      </button>
                    </div>

                    {/* Customer Info Box */}
                    <div className="flex justify-between items-center border-2 border-black p-4 rounded-md mb-2 bg-gray-50 print:bg-white">
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold">
                          تاریخ بکنگ:{" "}
                          <span className="font-black">
                            {new Date(inv.bookingDate).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="text-sm font-bold">
                          تاریخ واپسی:{" "}
                          <span className="font-black">
                            {inv.deliveryDate
                              ? new Date(inv.deliveryDate).toLocaleDateString()
                              : "---"}
                          </span>
                        </p>
                      </div>

                      <div className="text-center">
                        <h2 className="text-2xl font-black underline underline-offset-4 decoration-2">
                          {inv.customerName}
                        </h2>
                        <p
                          className="font-black text-lg mt-1 tracking-widest"
                          dir="ltr"
                        >
                          {inv.contactNo}
                        </p>
                      </div>

                      <div className="text-left space-y-1" dir="ltr">
                        <p className="text-sm font-bold">
                          Inv.No:{" "}
                          <span className="font-black">
                            #{inv.invoiceNumber}
                          </span>
                        </p>
                        <p className="text-sm font-bold">
                          Ref.No:{" "}
                          <span className="font-black">
                            {inv.refNumber || "---"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Measurement Grid */}
                    <div className="grid grid-cols-9 border-t-2 border-x-2 border-black text-center">
                      {inv.measurements
                        .slice()
                        .reverse()
                        .map((m, i) => (
                          <div
                            key={i}
                            className="border-b-2 border-l-2 border-black last:border-l-0"
                          >
                            <div className="bg-gray-100 py-1 font-bold border-b border-black text-[10px]">
                              {m.label}
                            </div>
                            <div className="py-2 text-xl font-black">
                              {m.value || "-"}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Images and Specifications */}
                    <div className="flex mt-2 border-2 border-black min-h-[160px]">
                      <div className="flex-grow grid grid-cols-4 gap-2 p-2 border-l border-black bg-white">
                        {inv.selectedImages.map((imgName, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-center border border-gray-100 p-1"
                          >
                            <img
                              src={`http://localhost:5000/public/row/${imgName}`}
                              alt="Design"
                              loading="eager"
                              crossOrigin="anonymous"
                              className="max-h-28 w-auto object-contain"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="w-1/3 p-3 bg-white">
                        <p className="text-[12px] font-black border-b-2 border-black mb-2 text-center pb-1">
                          خصوصیات
                        </p>
                        <div className="space-y-1.5">
                          {inv.specifications
                            .filter((s) => s.checked)
                            .map((spec, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center border-b border-dotted border-gray-400 pb-0.5"
                              >
                                <span className="text-black font-bold text-sm">
                                  ✓
                                </span>
                                <span className="text-[12px] font-bold">
                                  {spec.label}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Totals Section */}
                    <div className="mt-4 border-2 border-black rounded-lg overflow-hidden bg-white shadow-sm">
                      {/* Customer Identification Header (Added) */}
                      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-black bg-slate-900 text-white print:bg-white print:text-black">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Customer:
                          </span>
                          <span className="text-sm font-black uppercase tracking-tight">
                            {inv.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                            Contact:
                          </span>
                          <span
                            className="text-sm font-black tracking-[0.1em]"
                            dir="ltr"
                          >
                            {inv.contactNo}
                          </span>
                        </div>
                      </div>

                      {/* Financial Grid */}
                      <div className="grid grid-cols-3 text-center divide-x-2 divide-black divide-x-reverse">
                        <div className="p-3">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                            کل رقم (Total)
                          </p>
                          <p className="text-3xl font-black text-slate-900">
                            Rs. {inv.totalAmount.toLocaleString()}
                          </p>
                        </div>

                        <div className="p-3 bg-green-50/50 print:bg-white">
                          <p className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">
                            وصول (Advance)
                          </p>
                          <p className="text-3xl font-black text-green-700">
                            Rs. {inv.advanceAmount.toLocaleString()}
                          </p>
                        </div>

                        <div className="p-3 bg-red-50/50 print:bg-white">
                          <p className="text-[10px] font-bold text-red-700 uppercase tracking-tighter">
                            بقیہ (Balance)
                          </p>
                          <p className="text-3xl font-black text-red-600">
                            Rs. {inv.balanceAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
