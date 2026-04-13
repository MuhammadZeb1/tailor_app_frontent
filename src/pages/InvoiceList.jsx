import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoices,
  deleteInvoice,
} from "../feathures/invoice/invoiceSlice";
import { useNavigate } from "react-router-dom";
import ServiceFilterBar from "../components/ServiceFilterBar";
import { toast } from "react-toastify";
import TailoringHeader from "../components/TailoringHeader";
import PaymentSummary from "../components/PaymentSummary";

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

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this invoice?",
      )
    ) {
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
    const matchesName = inv.customerName
      .toLowerCase()
      .includes(customerName.toLowerCase());
    const matchesPhone = inv.contactNo.includes(contactNo);
    const matchesInv =
      !invoiceNumber || inv.invoiceNumber.toString().includes(invoiceNumber);
    const matchesRef =
      !refNumber ||
      (inv.refNumber &&
        inv.refNumber
          .toString()
          .toLowerCase()
          .includes(refNumber.toLowerCase()));

    const status = inv.balanceAmount <= 0 ? "completed" : "pending";
    const matchesStatus = statusFilter === "all" || status === statusFilter;
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
    <div className="flex bg-slate-50 min-h-screen w-full font-sans">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .printable { display: block !important; width: 100% !important; position: absolute; top: 0; left: 0; margin: 0; padding: 10mm; background: white !important; }
            body { background: white !important; }
            @page { size: auto; margin: 0mm; }
            .invoice-card-container { border: none !important; shadow: none !important; }
          }
        `}
      </style>

      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 no-print border-b-2 pb-4 border-slate-200">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Invoice History
              <span className="ml-4 px-4 py-1 bg-amber-500 text-slate-900 text-[10px] rounded-full font-black tracking-widest uppercase align-middle shadow-sm">
                {filteredInvoices.length} Records
              </span>
            </h2>
          </div>

          {loading && (
            <p className="text-center no-print py-20 animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">
              Fetching records from vault...
            </p>
          )}
          {error && (
            <p className="text-red-500 font-bold text-center no-print py-6 bg-red-50 border-2 border-red-100 rounded-2xl">
              Error: {error}
            </p>
          )}

          <div className="space-y-6">
            {filteredInvoices.map((inv) => (
              <div
                key={inv._id}
                className="bg-white border-2 border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-200 transition-all overflow-hidden invoice-card-container"
              >
                {/* Card Header (Clickable) */}
                <div
                  className="flex justify-between items-center p-3 bg-white cursor-pointer no-print select-none group"
                  onClick={() => toggleRow(inv._id)}
                > 
                  <div className="flex gap-4 items-center">
                    <div className="bg-slate-900 px-5 py-2 rounded-2xl text-white text-center shadow-lg group-hover:bg-amber-500 transition-colors">
                      <p className="text-[9px] uppercase font-black tracking-tighter opacity-70 group-hover:text-slate-900">
                        Invoice
                      </p>
                      <p className="text-xl font-black leading-none group-hover:text-slate-900">
                        #{inv.invoiceNumber}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {inv.customerName}
                      </h3>
                      <p className="text-slate-400 font-bold text-xs tracking-[2px]">
                        {inv.contactNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Remaining Balance
                      </p>
                      <p
                        className={`text-2xl font-black tracking-tighter ${inv.balanceAmount > 0 ? "text-red-500" : "text-emerald-500"}`}
                      >
                        Rs. {(inv.balanceAmount ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 transition-all duration-300 ${expandedRows[inv._id] ? "rotate-180 bg-slate-900 text-white" : "text-slate-400 group-hover:bg-slate-200"}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Section */}
                {expandedRows[inv._id] && (
                  <div
                    className="p-6 bg-white printable border-t-2 border-slate-50"
                    dir="rtl"
                  >
                    {/* Toolbar */}
                    <div
                      className="flex justify-between items-center mb-8 no-print gap-4"
                      dir="ltr"
                    >
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/update-invoice/${inv._id}`)}
                          className="bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[2px] border-2 border-transparent"
                        >
                          Modify Record
                        </button>
                        <button
                          onClick={() => handleDelete(inv._id)}
                          className="border-2 border-red-50 text-red-500 px-6 py-3 rounded-2xl font-black text-[10px] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all uppercase tracking-[2px]"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="bg-amber-500 text-slate-900 px-10 py-3 rounded-2xl font-black text-[10px] hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[2px] flex items-center gap-3 shadow-lg shadow-amber-100"
                      >
                        <span>Print Invoice</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                    </div>

                    {/* Receipt Header Component */}
                    <div className="mb-6">
                      <TailoringHeader
                        bookingDate={inv.bookingDate}
                        deliveryDate={inv.deliveryDate}
                        customerName={inv.customerName}
                        contactNo={inv.contactNo}
                        refNo={inv.refNumber}
                        customerAddress={inv.customerAddress}
                        invoiceNumber={inv.invoiceNumber}
                        isReadOnly={true}
                      />
                    </div>

                    {/* Measurements Table */}
                    <div className="grid grid-cols-9 border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-xl mb-6">
                      {inv.measurements
                        .slice()
                        .reverse()
                        .map((m, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-slate-900 last:border-l-0 text-center"
                          >
                            <div className="bg-slate-900 text-amber-500 py-2.5 font-black text-[10px] uppercase tracking-widest">
                              {m.label}
                            </div>
                            <div className="py-4 text-2xl font-black text-slate-900 bg-white">
                              {m.value || "-"}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Design & Specs Grid */}
                    <div className="flex flex-col lg:flex-row gap-4 mt-4 items-stretch" dir="rtl">
                      <div className="flex-grow flex flex-col gap-4">
                        {/* Canvas Area */}
                        <div
                          className="relative w-full h-[350px] border-2 border-slate-200 rounded-3xl bg-slate-50 
                          overflow-hidden shadow-inner"
                          dir="ltr"
                        >
                          {inv.designLayers &&
                            inv.designLayers.map((layer, idx) => (
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
                                <div className="relative w-full h-full">
                                  <img
                                    src={`http://localhost:5000/public/${layer.name}`}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://res.cloudinary.com/dzasncsep/image/upload/v1770975904/my_images/${layer.name}`;
                                    }}
                                  />
                                  {layer.markers &&
                                    layer.markers.map((marker, mIdx) => (
                                      <div
                                        key={mIdx}
                                        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                          left: `${marker.x}%`,
                                          top: `${marker.y}%`,
                                          zIndex: 30,
                                        }}
                                      >
                                        <span className="  text-[9px] font-black px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-amber-500/30">
                                          {marker.text}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Additional Notes Area */}
                        {inv.additionalNotes && (
                          <div className="w-full border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                            <div className="bg-slate-900 text-amber-500 text-[10px] font-black px-4 py-2 uppercase tracking-widest border-b border-slate-200 text-right">
                              خصوصی ہدایات / Special Instructions
                            </div>
                            <div className="p-4 text-sm font-bold text-slate-700 text-right whitespace-pre-wrap leading-loose">
                              {inv.additionalNotes}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Specifications Panel */}
                      <div
                        className="w-full lg:w-1/3 p-5 border-2 border-slate-200 rounded-3xl bg-white shadow-sm h-fit"
                        dir="rtl"
                      >
                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[3px] mb-4 border-b-2 border-amber-500 pb-2 inline-block">
                          خصوصیات (Specs)
                        </h3>

                        <div className="space-y-2">
                          {inv.specifications &&
                            inv.specifications
                              .filter((s) => s.checked)
                              .map((spec, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100"
                                >
                                  <span className="text-amber-500 font-bold text-xs shrink-0">
                                    ★
                                  </span>
                                  <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                                    {spec.label}
                                  </span>
                                </div>
                              ))}

                          {(!inv.specifications ||
                            inv.specifications.filter((s) => s.checked)
                              .length === 0) && (
                            <div className="text-center py-6 text-slate-300 text-[10px] italic uppercase tracking-widest">
                              No specs recorded
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Summary Container */}
                    <div className="mt-8 border-2 border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200">
                      {/* Black Branding Header */}
                      <div
                        className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white"
                        dir="rtl"
                      >
                        <div className="flex-1 flex items-center gap-3">
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[2px]">
                            نام گاہک:
                          </span>
                          <span className="text-[12px] font-black tracking-widest uppercase">
                            {inv.customerName}
                          </span>
                        </div>

                        <div className="flex-1 text-center border-x border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                            بل نمبر:
                          </span>
                          <span className="text-lg font-black ml-2 text-amber-500 tracking-tighter">
                            {inv.invoiceNumber}
                          </span>
                        </div>

                        <div className="flex-1 flex items-center justify-end gap-3">
                          <span className="text-[12px] font-black tracking-widest">
                            0334-90711546
                          </span>
                          <span className="bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md font-black text-[9px]">
                            اصغر
                          </span>
                        </div>
                      </div>

                      {/* Payment Summary Component */}
                      <div className="bg-white">
                        <PaymentSummary
                          totalAmount={inv.totalAmount}
                          advanceAmount={inv.totalAmount - inv.balanceAmount}
                          isReadOnly={true}
                          tadad={inv.tadad || 1}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceList;