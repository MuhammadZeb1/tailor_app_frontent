import React from "react";
import {
  FaHashtag,
  FaUser,
  FaPhone,
  FaFileInvoice,
  FaCalendarAlt,
  FaLayerGroup,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const ServiceFilterBar = ({
  invoiceNumber,
  setInvoiceNumber,
  refNumber,
  setRefNumber,
  customerName,
  setCustomerName,
  contactNo,
  setContactNo,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  statusFilter,
  setStatusFilter,
  onReset, // Receiving the reset function from Parent
}) => {
  // Shared Tailwind Classes
  const inputContainer = "relative group";
  const iconStyle =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors";
  const inputStyle =
    "w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all";

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto custom-scrollbar">
      
      {/* 1. QUICK SEARCH SECTION */}
      <div className="mb-8">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
          Quick Search
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: FaHashtag,
              placeholder: "Invoice #",
              value: invoiceNumber,
              setter: setInvoiceNumber,
            },
            {
              icon: FaFileInvoice,
              placeholder: "Ref Number",
              value: refNumber,
              setter: setRefNumber,
            },
            {
              icon: FaUser,
              placeholder: "Customer Name",
              value: customerName,
              setter: setCustomerName,
            },
            {
              icon: FaPhone,
              placeholder: "Contact Info",
              value: contactNo,
              setter: setContactNo,
            },
          ].map((item, idx) => (
            <div className={inputContainer} key={idx}>
              <item.icon className={iconStyle} size={14} />
              <input
                type="text"
                placeholder={item.placeholder}
                value={item.value}
                onChange={(e) => item.setter(e.target.value)}
                className={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. DATE RANGE SECTION */}
      <div className="mb-8">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
          Date Range
        </h2>
        <div className="flex items-center gap-2">
          {[
            { placeholder: "From", value: fromDate, setter: setFromDate },
            { placeholder: "To", value: toDate, setter: setToDate },
          ].map((item, idx) => (
            <div className="relative flex-1 group" key={idx}>
              <FaCalendarAlt className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 text-[12px] transition-colors" />
              <input
                type="date"
                value={item.value}
                onChange={(e) => item.setter(e.target.value)}
                className="w-full pl-2 pr-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none transition-all [color-scheme:dark]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. STATUS SECTION */}
      <div>
        <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
          Status
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {statusFilter === "all" && <FaLayerGroup className="text-indigo-400" size={14} />}
            {statusFilter === "pending" && <FaClock className="text-amber-400" size={14} />}
            {statusFilter === "completed" && <FaCheckCircle className="text-emerald-400" size={14} />}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Services</option>
            <option value="pending" className="bg-slate-900 text-white">Pending</option>
            <option value="completed" className="bg-slate-900 text-white">Completed</option>
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. RESET BUTTON SECTION */}
      <div className="mt-10 pt-6 border-t border-slate-800">
        <button
          onClick={onReset}
          className="w-full py-2 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-700 uppercase font-bold tracking-tighter"
        >
          <span>↺</span> Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default ServiceFilterBar;