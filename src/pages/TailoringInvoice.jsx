import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../feathures/imageSlice";
import { createInvoice, resetInvoiceState } from "../feathures/invoice/invoiceSlice";

const TailoringInvoice = () => {
  const dispatch = useDispatch();
  
  const { rows } = useSelector((state) => state.images);
  const { loading: invoiceLoading, success, currentInvoice } = useSelector((state) => state.invoice);

  const [bookingDate, setBookingDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [refNo, setRefNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const balanceAmount = totalAmount - advanceAmount;
  const [selectedImages, setSelectedImages] = useState([]);
  
  const [measurements, setMeasurements] = useState([
    { label: "لمبائی (Length)", value: "", placeholder: "لمبائی", type: "number" },
    { label: "تیرا (Shoulder)", value: "", placeholder: "تیرا", type: "number" },
    { label: "آستین (Sleeve)", value: "", placeholder: "آستین", type: "number" },
    { label: "کالر (Collar)", value: "", placeholder: "کالر", type: "number" },
    { label: "چھاتی (Chest)", value: "", placeholder: "چھاتی", type: "number" },
    { label: "کمر (Waist)", value: "", placeholder: "کمر", type: "number" },
    { label: "دامن (Daman)", value: "", placeholder: "دامن", type: "number" },
    { label: "شلوار (Shalwar)", value: "", placeholder: "شلوار", type: "number" },
    { label: "پانچہ (Ankle)", value: "", placeholder: "پانچہ", type: "number" },
  ]);

  const [specs, setSpecs] = useState([
    { label: "جیب پٹی - ڈبل سلائی", checked: false },
    { label: "ڈبل دھاگہ سنگل سلائی", checked: false },
    { label: "ڈبل سلائی", checked: true },
    { label: "ڈبل دھاگہ ڈبل سلائی", checked: false },
    { label: "3x3 سلائی", checked: false },
    { label: "3x3 ڈبل دھاگہ سلائی", checked: false },
    { label: "پیر سلائی", checked: false },
    { label: "واسکٹ بٹن", checked: false },
    { label: "نام نہیں", checked: false },
    { label: "چاک پٹی کاج", checked: false },
    { label: "پٹی میں 5 کاج", checked: false },
    { label: "سلکی تار، سنگل سلائی", checked: false },
    { label: "سلکی تار ڈبل سلائی", checked: false },
    { label: "سلکی تار ٹرپل سلائی", checked: false },
  ]);

  useEffect(() => { 
    dispatch(fetchImages()); 
  }, [dispatch]);

  useEffect(() => {
    if (success && currentInvoice) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); 
      return () => clearTimeout(timer);
    }
  }, [success, currentInvoice, dispatch]);

  const toggleSelection = (name) => {
    setSelectedImages((prev) => 
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleChange = (index, newValue) => {
    const updated = [...measurements];
    updated[index].value = newValue;
    setMeasurements(updated);
  };

  const toggleSpec = (index) => {
    setSpecs((prev) => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
  };

  const handleSaveInvoice = () => {
    if (!customerName || !contactNo) {
      alert("Please fill in Name and Contact Number");
      return;
    }

    const invoiceData = {
      refNumber: Number(refNo) || 0,
      customerName,
      contactNo,
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      deliveryDate,
      measurements: measurements.map(m => ({ label: m.label, value: String(m.value) })),
      specifications: specs.filter((s) => s.checked).map((s) => ({ label: s.label, checked: true })),
      selectedImages,
      totalAmount: Number(totalAmount),
      advanceAmount: Number(advanceAmount),
      balanceAmount: Number(balanceAmount),
    };

    dispatch(createInvoice(invoiceData));
  };

  return (
    <div className="min-h-screen py-10 flex items-center bg-gray-50 print:bg-white print:py-0">
      <div className="printable max-w-4xl w-full mx-auto p-4 bg-white border border-gray-800 text-[12px] font-sans shadow-lg print:shadow-none print:border-2 print:m-0" dir="rtl">

        {/* Header Section */}
        <div className="flex justify-between items-start border-2 border-gray-800 rounded-xl p-3 mb-2 gap-4">
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2">
              <label className="font-bold w-24">تاریخ بکنگ:</label>
              <input type="date" className="border-b border-gray-300 outline-none print:border-none" onChange={(e) => setBookingDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold w-24">تاریخ واپسی:</label>
              <input type="date" className="border-b border-gray-300 outline-none print:border-none" onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold w-24">فون نمبر:</label>
              <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} className="border-b border-gray-800 focus:outline-none w-32 print:border-none font-bold" />
            </div>
          </div>

          <div className="space-y-2 text-left" dir="ltr">
            <p className="flex items-center gap-2 justify-end">
              <label className="font-bold text-gray-800">Inv.No.</label>
              <span className="border-b border-gray-800 w-24 text-center font-bold text-lg text-blue-800 print:text-black">
                {currentInvoice?.invoiceNumber || (invoiceLoading ? "Saving..." : "Auto")}
              </span>
            </p>
            <p className="flex items-center gap-2 justify-end">
              <label className="font-bold">Ref.No.</label>
              <input type="number" value={refNo} onChange={(e) => setRefNo(e.target.value)} className="border-b border-gray-800 focus:outline-none w-16 text-center font-bold" />
            </p>
            <p className="flex items-center gap-2 justify-end">
              <label className="font-bold">Name</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="border-b border-gray-800 focus:outline-none w-32 px-1 text-right font-bold" />
            </p>
          </div>
        </div>

        {/* Measurements Grid */}
        <div className="grid grid-cols-9 border-t-2 border-x-2 border-gray-800">
          {measurements.slice().reverse().map((item, index) => (
            <div key={index} className="border-b-2 border-l-2 border-gray-800 text-center">
              <div className="bg-gray-100 py-1 font-bold border-b border-gray-800 text-[10px]">{item.label}</div>
              <input 
                type={item.type} 
                value={item.value} 
                onChange={(e) => handleChange(measurements.length - 1 - index, e.target.value)} 
                className="py-2 px-1 text-lg font-bold w-full text-center focus:outline-none bg-transparent" 
              />
            </div>
          ))}
        </div>

        {/* Styles & Specifications */}
        <div className="flex border-2 border-gray-800 mt-2 min-h-[200px]">
          <div className="flex-grow grid grid-cols-4 gap-2 p-2 border-l border-gray-800 bg-gray-50 print:bg-white">
            {rows && Object.keys(rows).map((row) => rows[row].map((img) => (
              <div key={img.name} onClick={() => toggleSelection(img.name)} 
                className={`relative border-2 p-1 flex flex-col items-center rounded cursor-pointer ${selectedImages.includes(img.name) ? "border-blue-600 bg-blue-100 print:border-black" : "border-transparent print:hidden"}`}>
                <img src={img.url} alt={img.name} loading="eager" crossOrigin="anonymous" className="w-14 h-14 object-contain" />
              </div>
            )))}
          </div>

          <div className="w-1/3 p-2 space-y-1 text-right">
            {specs.map((item, index) => (
              <label key={index} className={`flex justify-between items-center border-b border-gray-100 pb-1 ${!item.checked ? "print:hidden" : "print:border-none"}`}>
                <input type="checkbox" checked={item.checked} onChange={() => toggleSpec(index)} className="no-print" />
                {item.checked && <span className="hidden print:block text-black font-bold">✓</span>}
                <span className={`font-medium text-[11px] ${item.checked ? "print:text-sm print:font-bold" : ""}`}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-4 border-2 border-gray-800 rounded-lg bg-gray-50 overflow-hidden print:bg-white">
  
  {/* Header Row: Shown in Print and on Screen for context */}
  <div className="flex justify-between items-center px-6 py-2 border-b-2 border-gray-800 bg-slate-100 print:bg-white">
    <div className="flex gap-3 items-center">
      <span className="text-[10px] font-black uppercase text-gray-500">Customer:</span>
      <span className="font-black text-lg text-black uppercase tracking-tight">{customerName || "---"}</span>
    </div>
    <div className="flex gap-3 items-center">
      <span className="text-[10px] font-black uppercase text-gray-500">Contact:</span>
      <span className="font-black text-lg text-blue-700 tracking-widest">{contactNo || "---"}</span>
    </div>
  </div>

  {/* Calculation Grid */}
  <div className="grid grid-cols-3 gap-0">
    {/* Total Amount */}
    <div className="flex flex-col items-center p-3 border-r border-gray-800">
      <label className="text-[10px] font-black mb-1 text-gray-500 uppercase">کل رقم (Total)</label>
      <div className="relative w-full px-4">
        <span className="absolute left-2 top-1 text-xs font-bold text-gray-400">Rs.</span>
        <input 
          type="number" 
          className="w-full text-center text-2xl font-black bg-transparent outline-none border-b-2 border-transparent focus:border-black transition-colors print:border-none" 
          value={totalAmount} 
          onChange={(e) => setTotalAmount(Number(e.target.value))} 
        />
      </div>
    </div>

    {/* Advance Amount */}
    <div className="flex flex-col items-center p-3 border-r border-gray-800 bg-green-50/30">
      <label className="text-[10px] font-black mb-1 text-green-700 uppercase">وصول (Advance)</label>
      <div className="relative w-full px-4">
        <span className="absolute left-2 top-1 text-xs font-bold text-green-400">Rs.</span>
        <input 
          type="number" 
          className="w-full text-center text-2xl font-black text-green-700 bg-transparent outline-none border-b-2 border-transparent focus:border-green-700 transition-colors print:border-none" 
          value={advanceAmount} 
          onChange={(e) => setAdvanceAmount(Number(e.target.value))} 
        />
      </div>
    </div>

    {/* Balance Amount */}
    <div className="flex flex-col items-center p-3 bg-red-50 print:bg-white">
      <label className="text-[10px] font-black mb-1 text-red-700 uppercase">بقیہ (Balance)</label>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-red-400">Rs.</span>
        <div className="text-3xl font-black text-red-600 tabular-nums">
          {balanceAmount.toLocaleString()}
        </div>
      </div>
    </div>
  </div>
</div>

        <button 
          onClick={handleSaveInvoice} 
          disabled={invoiceLoading} 
          className={`mt-4 w-full py-3 font-bold text-lg rounded shadow-md no-print transition-colors ${invoiceLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black"}`}
        >
          {invoiceLoading ? "Saving Invoice..." : "Save & Print Invoice"}
        </button>
      </div>
    </div>
  );
};

export default TailoringInvoice;
