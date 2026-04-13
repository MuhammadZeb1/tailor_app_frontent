import React from "react";

const TailoringHeader = ({
  bookingDate,
  setBookingDate,
  deliveryDate,
  setDeliveryDate,
  contactNo,
  setContactNo,
  customerName,
  setCustomerName,
  customerAddress, // 1. Added prop
  setCustomerAddress, // 2. Added prop
  refNo,
  setRefNo,
  invoiceNumber,
  isReadOnly = false,
}) => {
  return (
    <div className="relative flex justify-between items-center border-2 border-slate-200 rounded-2xl p-3 mb-2 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 h-full w-1 bg-amber-500"></div>

      {/* Right Side: Dates & Phone */}
      <div className="text-right space-y-3 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-600 px-1 py-1 rounded font-bold text-[8px]">
            تاریخ بکنگ
          </span>
          <input
            type="date"
            readOnly={isReadOnly}
            value={bookingDate}
            className="border-b-2 border-slate-100 outline-none focus:border-amber-500 font-semibold"
            onChange={(e) => setBookingDate?.(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-700 p-1 rounded font-bold text-[10px]">
            تاریخ واپسی
          </span>
          <input
            type="date"
            readOnly={isReadOnly}
            value={deliveryDate}
            className="border-b-2 border-slate-100 outline-none focus:border-amber-500 font-semibold text-red-600"
            onChange={(e) => setDeliveryDate?.(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-600 px-1 py-1 rounded font-bold text-[12px]">
            فون نمبر
          </span>
          <input
            type="text"
            readOnly={isReadOnly}
            value={contactNo}
            onChange={(e) => setContactNo?.(e.target.value)}
            className="border-b-2 border-slate-100 focus:border-amber-500 outline-none w-36 font-bold text-slate-800"
          />
        </div>
      </div>

      {/* Center: Brand */}
      <div className="text-center px-2">
        <h1 className="text-2xl font-black tracking-[4px] text-slate-900 uppercase">
          POPULAR
        </h1>
        <p className="text-[10px] tracking-[4px] text-amber-600 font-bold uppercase">
          fabrics & tailoring
        </p>
        <p className="text-[10px] tracking-[4px] text-slate-400 font-bold">03349071546</p>
        <p className="text-[10px] tracking-[1px] text-slate-400 font-bold">پیر بالا، ورسک روڈ</p>
      </div>

      {/* Left Side: Invoice Info */}
      <div className="space-y-2 text-left">
        <div className="flex items-center gap-2 justify-end" dir="ltr">
          <span className="text-[16px] font-black text-slate-900 border-b-4 border-amber-400">
            {invoiceNumber || "خودکار"}
          </span>
          <span className="text-[12px] font-extrabold text-slate-400 uppercase">
            بل نمبر
          </span>
        </div>

        <div className="flex items-center gap-1 justify-end" dir="rtl">
          <label className="font-bold text-slate-400 text-[12px]">
            حوالہ نمبر
          </label>
          <input
            type="number"
            readOnly={isReadOnly}
            value={refNo}
            onChange={(e) => setRefNo?.(e.target.value)}
            className="border-b border-slate-200 focus:border-amber-500 outline-none w-16 text-center font-bold text-slate-700"
          />
        </div>

        <div className="flex items-center gap-1 justify-end" dir="rtl">
          <label className="font-bold text-slate-400 text-[10px]">
            کسٹمر کا نام
          </label>
          <input
            type="text"
            readOnly={isReadOnly}
            value={customerName}
            onChange={(e) => setCustomerName?.(e.target.value)}
            className="border-b border-slate-200 focus:border-amber-500 outline-none w-40 px-1 text-right font-bold text-slate-800 uppercase"
          />
        </div>

        {/* 3. New Customer Address Field */}
        <div className="flex items-center gap-1 justify-end" dir="rtl">
          <label className="font-bold text-slate-400 text-[10px]">
            پتہ
          </label>
          <input
            type="text"
            readOnly={isReadOnly}
            value={customerAddress}
            placeholder="Address..."
            onChange={(e) => setCustomerAddress?.(e.target.value)}
            className="border-b border-slate-200 focus:border-amber-500 outline-none w-40 px-1 text-right font-bold text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};

export default TailoringHeader;