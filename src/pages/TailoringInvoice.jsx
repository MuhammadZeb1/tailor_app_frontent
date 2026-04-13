import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImages } from "../feathures/imageSlice";
import { createInvoice } from "../feathures/invoice/invoiceSlice";
import { toast } from "react-toastify";
import DesignCanvas from "../components/DesignCanvas";
import StyleIcon from "../components/StyleIcon";
import TailoringHeader from "../components/TailoringHeader";
import PaymentSummary from "../components/PaymentSummary";
import FormActions from "../components/FormActions";
import AdditionalNotes from "../components/AdditionalNotes";

const TailoringInvoice = () => {
  const dispatch = useDispatch();

  // --- UPDATED DESIGN STATE TO ARRAY ---
  const [droppedItems, setDroppedItems] = useState([]);

  // Data States
  const { rows } = useSelector((state) => state.images);
  const {
    loading: invoiceLoading,
    success,
    currentInvoice,
  } = useSelector((state) => state.invoice);

  const [tadad, setTadad] = useState(1);
  const [customerAddress, setCustomerAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [refNo, setRefNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const balanceAmount =
    (Number(totalAmount) || 0) - (Number(advanceAmount) || 0);

  const [measurements, setMeasurements] = useState([
    { label: "لمبائی ", value: "", placeholder: "لمبائی", type: "number" },
    { label: "تیرا ", value: "", placeholder: "تیرا", type: "number" },
    { label: "آستین ", value: "", placeholder: "آستین", type: "number" },
    { label: "کالر ", value: "", placeholder: "کالر", type: "number" },
    { label: "چھاتی ", value: "", placeholder: "چھاتی", type: "number" },
    { label: "کمر ", value: "", placeholder: "کمر", type: "number" },
    { label: "دامن ", value: "", placeholder: "دامن", type: "number" },
    { label: "شلوار ", value: "", placeholder: "شلوار", type: "number" },
    { label: "پانچہ ", value: "", placeholder: "پانچہ", type: "number" },
  ]);

  const [specs, setSpecs] = useState([
    { label: "جیب پٹی - ڈبل سلائی", checked: false },
    { label: "ڈبل دھاگہ سنگل سلائی", checked: false },
    { label: "ڈبل سلائی", checked: false },
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
      const timer = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timer);
    }
  }, [success, currentInvoice]);

  const handleChange = (index, newValue) => {
    const updated = [...measurements];
    updated[index].value = newValue;
    setMeasurements(updated);
  };

  const toggleSpec = (index) => {
    setSpecs((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const handleSaveInvoice = () => {
    if (!customerName || !contactNo) {
      toast.error("Please fill in Name and Contact Number");
      return;
    }

    const invoiceData = {
      refNumber: Number(refNo) || 0,
      customerName,
      contactNo,
      customerAddress,
      additionalNotes,
      tadad: Number(tadad) || 1,

      bookingDate: bookingDate || new Date().toISOString().split("T")[0],
      deliveryDate,
      measurements: measurements.map((m) => ({
        label: m.label,
        value: String(m.value),
      })),
      specifications: specs
        .filter((s) => s.checked)
        .map((s) => ({ label: s.label, checked: true })),
      designLayers: droppedItems.map((item) => ({
        name: item.name,
        url: item.url,
        x: item.x,
        y: item.y,
        markers: item.markers || [],
      })),
      totalAmount: Number(totalAmount),
      advanceAmount: Number(advanceAmount),
      balanceAmount: balanceAmount,
    };

    // DEBUG: Log this to see your actual data in the console
    console.log("Sending Invoice Data:", invoiceData);

    dispatch(createInvoice(invoiceData))
      .unwrap()
      .then((res) => {
        toast.success("Invoice created successfully!");
      })
      .catch((err) => {
        toast.error(err || "Failed to create invoice");
      });
  };

  return (
    <div className="min-h-screen py-5 flex items-start bg-slate-100 print:bg-white print:py-0 px-4">
      {/* SIDEBAR: Style Selection */}
      <div className="no-print w-64 sticky top-5 mr-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 h-[90vh] overflow-y-auto">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
          Drag Styles
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {rows &&
            Object.keys(rows).map((row) =>
              rows[row].map((img) => <StyleIcon key={img.name} img={img} />),
            )}
        </div>
      </div>

      {/* MAIN INVOICE */}
      <div
        className="printable max-w-4xl w-full mx-auto p-4 bg-white border-t-[10px] border-slate-900 text-[9px] font-sans shadow-2xl print:shadow-none print:border-t-0 print:m-0"
        dir="rtl"
      >
        <TailoringHeader
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          deliveryDate={deliveryDate}
          setDeliveryDate={setDeliveryDate}
          contactNo={contactNo}
          setContactNo={setContactNo}
          customerName={customerName}
          setCustomerName={setCustomerName}
          refNo={refNo}
          setRefNo={setRefNo}
          customerAddress={customerAddress}
          setCustomerAddress={setCustomerAddress}
          invoiceNumber={currentInvoice?.invoiceNumber}
        />

        {/* Measurements Grid */}
        <div className="grid grid-cols-9 border-2 border-slate-900 rounded-xl overflow-hidden shadow-sm">
          {measurements
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="border-l text-black border-slate-200 last:border-l-0 text-center"
              >
                <div className="bg-slate-900 py-2 font-bold text-[9px] uppercase tracking-wider">
                  {item.label}
                </div>
                <input
                  type={item.type}
                  value={item.value}
                  onChange={(e) =>
                    handleChange(
                      measurements.length - 1 - index,
                      e.target.value,
                    )
                  }
                  className="py-2 px-1 text-xl font-black w-full text-center focus:bg-amber-50 focus:outline-none bg-transparent"
                />
              </div>
            ))}
        </div>

        {/* --- UPDATED CANVAS & SPECS SECTION --- */}
        {/* --- Main Section Wrapper --- */}
        <div className="flex gap-2 mt-2 items-stretch min-h-[100px]">
          {/* LEFT COLUMN: Canvas + Notes */}
          <div className="flex-grow flex flex-col gap-2">
            {" "}
            {/* Added flex-col and gap here */}
            {/* 1. Design Canvas Area */}
            <div className="w-full">
              <DesignCanvas
                droppedItems={droppedItems}
                setDroppedItems={setDroppedItems}
              />
            </div>
            {/* 2. Additional Notes Area (Stacked Vertically) */}
            <div className="w-full">
              <AdditionalNotes
                notes={additionalNotes}
                setNotes={setAdditionalNotes}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Specs Checklist (Remains as is) */}
          <div className="w-1/3 p-4 border-2 border-slate-900 rounded-2xl h-fit">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1">
              Specifications
            </h3>
            <div className="flex flex-col gap-1">
              {specs.map((item, index) => (
                <label
                  key={item.label}
                  className={`flex justify-between items-center py-1 px-2 rounded transition-colors
            ${!item.checked ? "print:hidden" : "bg-slate-50/50 print:bg-transparent"} 
            ${!item.checked ? "no-print opacity-40" : "opacity-100"}`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleSpec(index)}
                    className="no-print w-4 h-4 accent-slate-900"
                  />
                  <span
                    className={`font-bold text-[11px] flex-grow text-right ${
                      item.checked ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* /* infromation section */}
        <div className="mt-7  border-t-3">
          <div
            className="flex items-center justify-between   divide-x-2 divide-x-reverse divide-slate-900"
            dir="rtl"
          >
            {/* Customer */}
            <div className=" flex justify-center items-center">
              <span className="font-black uppercase text-[0.7rem] px-1.5 py-0.5 rounded w-23">
                کسٹمر کا نام:
              </span>
              <input
                type="text"
                placeholder="...."
                className=" w-full text-[0.7rem] font-black outline-none  "
                value={customerName}
                readOnly
              />
            </div>

            {/* Invoice */}
            <div
              className="flex-1 p-2 flex justify-center items-center gap-2"
              dir="ltr"
            >
              <span className="font-black uppercase text-[0.7rem] px-1.5 py-0.5 rounded">
                {currentInvoice?.invoiceNumber || "Auto"}
              </span>
              <span className=" font-bold text-[0.7rem] ">بل نمبر:</span>
            </div>

            {/* Contact */}
            <div className="flex-1 p-2 flex flex-col gap-1 justify-center">
              <div className="flex items-center ">
                <span className=" font-black uppercase text-[0.7rem] px-1.5 py-0.5 rounded">
                  اصغر
                </span>
                <span className="font-extrabold tracking-wider text-sm">
                  03349071546
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          {/* Replaces the manual grid and button block */}
          <div className="space-y-4">
            <PaymentSummary
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
              advanceAmount={advanceAmount}
              setAdvanceAmount={setAdvanceAmount}
              tadad={tadad} // New prop
              setTadad={setTadad} // New prop
            />

            <FormActions
              onSave={handleSaveInvoice}
              loading={invoiceLoading}
              label="Confirm & Print Invoice"
              onCancel={() => navigate("/invoices")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailoringInvoice;
