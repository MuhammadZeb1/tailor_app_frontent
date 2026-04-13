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
  FaArrowRight,
  FaFilter,
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
  onReset,
}) => {
  // --- UPDATED STYLING CONSTANTS ---
  const inputContainer = "relative group mb-4";
  const iconStyle =
    "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors";
  const inputStyle =
    "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white transition-all text-sm font-medium";

  return (
    <div className="w-80 bg-white border-r border-slate-200 p-6 h-screen sticky top-0 overflow-y-auto shadow-sm">
      
      {/* HEADER */}
      <div className="mb-10 flex items-center gap-3">
        <div className="bg-slate-900 p-2 rounded-lg">
            <FaFilter className="text-white" size={14}/>
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Filters</h1>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
            Tailoring Analytics
          </p>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="mb-8">
        <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-full"></span> Search Details
        </h2>

        <div className="space-y-1">
          {[
            { icon: FaHashtag, placeholder: "Invoice #", value: invoiceNumber, setter: setInvoiceNumber },
            { icon: FaFileInvoice, placeholder: "Ref Number", value: refNumber, setter: setRefNumber },
            { icon: FaUser, placeholder: "Customer Name", value: customerName, setter: setCustomerName },
            { icon: FaPhone, placeholder: "Contact Number", value: contactNo, setter: setContactNo },
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

      {/* DATE RANGE */}
      <div className="mb-8">
        <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-500 rounded-full"></span> Delivery Period
        </h2>

        <div className="space-y-3">
          <div className="relative group">
            <FaCalendarAlt className={iconStyle} size={14} />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="flex justify-center text-slate-300">
            <div className="h-[1px] w-full bg-slate-100 self-center"></div>
            <FaArrowRight className="mx-2 rotate-90 scale-75" size={12} />
            <div className="h-[1px] w-full bg-slate-100 self-center"></div>
          </div>

          <div className="relative group">
            <FaCalendarAlt className={iconStyle} size={14} />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* STATUS FILTER */}
      <div className="mb-10">
        <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-500 rounded-full"></span> Work Status
        </h2>

        <div className="relative group">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors ${statusFilter !== 'all' ? 'text-blue-600' : 'text-slate-400'}`}>
            {statusFilter === "all" && <FaLayerGroup size={14} />}
            {statusFilter === "pending" && <FaClock size={14} />}
            {statusFilter === "completed" && <FaCheckCircle size={14} />}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputStyle} appearance-none cursor-pointer`}
          >
            <option value="all">View All Orders</option>
            <option value="pending">Pending Work</option>
            <option value="completed">Finished Suits</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
             <FaArrowRight className="rotate-90 scale-75" />
          </div>
        </div>
      </div>

      {/* RESET ACTION */}
      <button
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default ServiceFilterBar;