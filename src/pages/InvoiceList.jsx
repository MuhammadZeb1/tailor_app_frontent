import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices, deleteInvoice } from "../feathures/invoice/invoiceSlice";
import { useNavigate } from "react-router-dom";
import ServiceFilterBar from "../components/ServiceFilterBar";
import { toast } from "react-toastify";
import "../css/invoicePrint.css";


// Shared Components
import TailoringHeader from "../components/TailoringHeader";
import PaymentSummary from "../components/PaymentSummary";
import MeasurementGrid from "../components/MeasurementGrid";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading, error } = useSelector((state) => state.invoice);

  const [expandedRows, setExpandedRows] = useState({});
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

  // Logic to print a specific invoice
  const handlePrint = (id) => {
    // Ensure the row is expanded first so the content exists in DOM
    if (!expandedRows[id]) {
      setExpandedRows((prev) => ({ ...prev, [id]: true }));
    }
    // Small delay to allow the DOM to render the expanded content before printing
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this invoice?")) {
      dispatch(deleteInvoice(id))
        .unwrap()
        .then(() => toast.success("Invoice deleted successfully"))
        .catch((err) => toast.error(err || "Failed to delete invoice"));
    }
  };

  const resetFilters = () => {
    setInvoiceNumber("");
    setRefNumber("");
    setCustomerName("");
    setContactNo("");
    setFromDate("");
    setToDate("");
    setStatusFilter("all");
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesName = (inv.customerName || "").toLowerCase().includes(customerName.toLowerCase());
    const matchesPhone = (inv.contactNo || "").includes(contactNo);
    const matchesInv = !invoiceNumber || (inv.invoiceNumber && inv.invoiceNumber.toString().includes(invoiceNumber));
    const matchesRef = !refNumber || inv.refNumber?.toString().includes(refNumber);

    const total = inv.totalAmount ?? 0;
    const advance = inv.advanceAmount ?? 0;
    const actualBalance = total - advance;
    const isPaid = actualBalance <= 0;
    const paymentStatusLabel = isPaid ? "paid" : "unpaid";

    const matchesStatus =
      statusFilter === "all" ||
      inv.smartStatus?.toLowerCase() === statusFilter.toLowerCase() ||
      paymentStatusLabel === statusFilter.toLowerCase();

    const recordDate = new Date(inv.bookingDate);
    recordDate.setHours(0, 0, 0, 0);
    const start = fromDate ? new Date(fromDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    const end = toDate ? new Date(toDate) : null;
    if (end) end.setHours(0, 0, 0, 0);

    return (
      matchesName &&
      matchesPhone &&
      matchesInv &&
      matchesRef &&
      matchesStatus &&
      (!start || recordDate >= start) &&
      (!end || recordDate <= end)
    );
  });

  return (
    <div className="flex bg-slate-50 min-h-screen w-full font-sans">
      <aside className="no-print shrink-0 shadow-xl z-10 border-r border-slate-200">
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
      </aside>

      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8 no-print border-b-2 pb-4 border-slate-200">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Invoice History
              <span className="ml-4 px-4 py-1 bg-amber-500 text-slate-900 text-[10px] rounded-full font-black tracking-widest uppercase align-middle shadow-sm">
                {filteredInvoices.length} Records
              </span>
            </h2>
          </div>

          <div className="space-y-6">
            {filteredInvoices.map((inv) => {
              const currentTotal = inv.totalAmount ?? 0;
              const currentAdvance = inv.advanceAmount ?? 0;
              const currentBalance = currentTotal - currentAdvance;
              const isPaid = currentBalance <= 0;

              return (
                <div
                  key={inv._id}
                  className={`bg-white border-l-8 ${
                    isPaid ? "border-emerald-500" : "border-red-500"
                  } border-y-2 border-r-2 border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden invoice-card-container print:border-0 print:shadow-none print:m-0`}
                >
                  {/* --- CARD HEADER (HIDDEN ON PRINT) --- */}
                  <div
                    className="flex justify-between items-center p-5 cursor-pointer no-print select-none group"
                    onClick={() => toggleRow(inv._id)}
                  >
                    <div className="flex gap-5 items-center">
                      <div
                        className={`px-5 py-3 rounded-2xl text-white text-center shadow-lg transition-all ${
                          isPaid ? "bg-emerald-600" : "bg-slate-900 group-hover:bg-amber-500"
                        }`}
                      >
                        <p className="text-[9px] uppercase font-black tracking-tighter opacity-70">Invoice</p>
                        <p className="text-xl font-black leading-none">#{inv.invoiceNumber}</p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                          {inv.customerName}
                          {isPaid ? (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-1 rounded-lg border border-emerald-200">PAID</span>
                          ) : (
                            <span className="bg-red-100 text-red-700 text-[9px] px-2 py-1 rounded-lg border border-red-200">UNPAID</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-slate-400 font-bold text-xs tracking-widest">{inv.contactNo}</p>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${inv.smartStatus === "Ready" ? "text-emerald-500" : "text-amber-500"}`}>
                            Order: {inv.smartStatus || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Balance</p>
                        <p className={`text-2xl font-black tracking-tighter ${isPaid ? "text-emerald-500" : "text-red-500"}`}>
                          {isPaid ? "CLEARED" : `Rs. ${currentBalance.toLocaleString()}`}
                        </p>
                      </div>
                      <div
                        className={`h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-300 ${
                          expandedRows[inv._id] ? "rotate-180 bg-slate-900 text-white" : "text-slate-400 group-hover:bg-slate-200"
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* --- EXPANDED VIEW (VISIBLE ON PRINT) --- */}
                  {expandedRows[inv._id] && (
                    <div className="p-6 bg-white printable border-t-2 border-slate-50 print:p-0 print:border-0" dir="rtl">
                      {/* Controls (HIDDEN ON PRINT) */}
                      <div className="flex justify-between items-center mb-8 no-print gap-4" dir="ltr">
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/update-invoice/${inv._id}`)}
                            className="bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[2px]"
                          >
                            Modify Record
                          </button>
                          <button
                            onClick={() => handleDelete(inv._id)}
                            className="border-2 border-red-50 text-red-500 px-6 py-3 rounded-2xl font-black text-[10px] hover:bg-red-500 hover:text-white transition-all uppercase tracking-[2px]"
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => handlePrint(inv._id)}
                          className="bg-amber-500 text-slate-900 px-10 py-3 rounded-2xl font-black text-[10px] hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[2px] flex items-center gap-3 shadow-lg shadow-amber-100"
                        >
                          <span>Print Invoice</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>

                      {/* START OF ACTUAL PRINTABLE INVOICE CONTENT */}
                      <div className="print-area">
                        <TailoringHeader
                          bookingDate={new Date(inv.bookingDate).toISOString().split("T")[0]}
                          deliveryDate={new Date(inv.deliveryDate).toISOString().split("T")[0]}
                          customerName={inv.customerName}
                          contactNo={inv.contactNo}
                          refNo={inv.refNumber}
                          customerAddress={inv.customerAddress}
                          invoiceNumber={inv.invoiceNumber}
                          isReadOnly={true}
                        />

                        <div className="my-6">
                          <MeasurementGrid measurements={inv.measurements} isReadOnly={true} />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-4 mt-4 items-stretch" dir="rtl">
                          <div className="flex-grow flex flex-col gap-4">
                            <div className="relative w-full h-[350px] border-2 border-slate-200 rounded-3xl bg-slate-50 overflow-hidden shadow-inner design-preview print:border-slate-900" dir="ltr">
                              {inv.designLayers?.map((layer, idx) => (
                                <div
                                  key={idx}
                                  className="absolute -translate-x-1/2 -translate-y-1/2"
                                  style={{
                                    left: `${layer.x}%`,
                                    top: `${layer.y}%`,
                                    width: "90px",
                                    height: "90px",
                                  }}
                                >
                                  <img
                                    src={`http://localhost:5000/public/${layer.name}`}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.target.src = `https://res.cloudinary.com/dzasncsep/image/upload/v1770975904/my_images/${layer.name}`;
                                    }}
                                    alt={layer.name}
                                  />
                                </div>
                              ))}
                            </div>

                            {inv.additionalNotes && (
                              <div className="w-full border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm print:border-slate-900">
                                <div className="bg-slate-900 text-amber-500 text-[10px] font-black px-4 py-2 uppercase tracking-widest text-right">
                                  خصوصی ہدایات / Special Instructions
                                </div>
                                <div className="p-4 text-sm font-bold text-slate-700 text-right whitespace-pre-wrap leading-loose">
                                  {inv.additionalNotes}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Specs Section */}
                          <div className="w-full lg:w-1/3 p-5 border-2 border-slate-200 rounded-3xl bg-white shadow-sm h-fit specs-container print:border-slate-900">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[3px] mb-4 border-b-2 border-amber-500 pb-2 inline-block">
                              خصوصیات (Specs)
                            </h3>
                            <div className="space-y-2">
                              {inv.specifications
                                ?.filter((s) => s.checked)
                                .map((spec, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-right print:bg-transparent"
                                  >
                                    <span className="text-amber-500 font-bold text-xs shrink-0">★</span>
                                    <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight w-full">
                                      {spec.label}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-8 border-2 border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 print:shadow-none">
                          <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white" dir="rtl">
                            <div className="flex-1 flex items-center gap-3">
                              <span className="text-[10px] font-black text-amber-500 uppercase">نام گاہک:</span>
                              <span className="text-[12px] font-black tracking-widest">{inv.customerName}</span>
                            </div>
                            <div className="flex-1 text-center border-x border-slate-800">
                              <span className="text-[10px] font-black text-slate-400 uppercase">بل نمبر:</span>
                              <span className="text-lg font-black ml-2 text-amber-500">{inv.invoiceNumber}</span>
                            </div>
                            <div className="flex-1 flex items-center justify-end gap-3">
                              <span className="text-[12px] font-black tracking-widest">0334-90711546</span>
                              <span className="bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md font-black text-[9px]">اصغر</span>
                            </div>
                          </div>
                          <PaymentSummary
                            totalAmount={inv.totalAmount}
                            advanceAmount={inv.advanceAmount}
                            isReadOnly={true}
                            tadad={inv.tadad || 1}
                          />
                        </div>
                      </div>
                      {/* END OF PRINTABLE CONTENT */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceList;