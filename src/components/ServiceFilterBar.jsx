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
  const inputContainer = "relative group mb-3";
  const iconStyle =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
  const inputStyle =
    "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black text-sm";

  return (
    <div className="w-72 bg-white border-r border-gray-200 p-6 h-screen sticky top-0 overflow-y-auto">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-black">Filters</h1>
        <p className="text-xs text-gray-500 mt-1">
          Service Management System
        </p>
      </div>

      {/* SEARCH SECTION */}
      <div className="mb-8">
        <h2 className="text-gray-500 text-xs font-semibold uppercase mb-4">
          Search Details
        </h2>

        <div className="space-y-2">
          {[
            { icon: FaHashtag, placeholder: "Invoice #", value: invoiceNumber, setter: setInvoiceNumber },
            { icon: FaFileInvoice, placeholder: "Ref Number", value: refNumber, setter: setRefNumber },
            { icon: FaUser, placeholder: "Customer Name", value: customerName, setter: setCustomerName },
            { icon: FaPhone, placeholder: "Contact Number", value: contactNo, setter: setContactNo },
          ].map((item, idx) => (
            <div className={inputContainer} key={idx}>
              <item.icon className={iconStyle} size={12} />
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
        <h2 className="text-gray-500 text-xs font-semibold uppercase mb-4">
          Booking Period
        </h2>

        <div className="space-y-3">
          <div className="relative">
            <FaCalendarAlt className={iconStyle} size={12} />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="flex justify-center text-gray-400">
            <FaArrowRight className="rotate-90" size={10} />
          </div>

          <div className="relative">
            <FaCalendarAlt className={iconStyle} size={12} />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* STATUS */}
      <div className="mb-8">
        <h2 className="text-gray-500 text-xs font-semibold uppercase mb-4">
          Status
        </h2>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {statusFilter === "all" && <FaLayerGroup size={12} />}
            {statusFilter === "pending" && <FaClock size={12} />}
            {statusFilter === "completed" && <FaCheckCircle size={12} />}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">Show All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* RESET */}
      <button
        onClick={onReset}
        className="w-full py-2.5 border border-gray-300 text-black text-sm hover:bg-black hover:text-white transition"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ServiceFilterBar;
