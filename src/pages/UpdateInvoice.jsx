import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchInvoices,
  updateInvoice,
  resetInvoiceState,
} from "../feathures/invoice/invoiceSlice";

import { fetchImages } from "../feathures/imageSlice";

import { toast } from "react-toastify";

import DesignCanvas from "../components/DesignCanvas"; // Ensure path is correct

import StyleIcon from "../components/StyleIcon"; // Ensure path is correct
import TailoringHeader from "../components/TailoringHeader";

const UpdateInvoice = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { invoices } = useSelector((state) => state.invoice);

  const { rows } = useSelector((state) => state.images);

  const [formData, setFormData] = useState(null);

  const [droppedItems, setDroppedItems] = useState([]);

  const defaultSpecs = [
    { label: "جیب پٹی - ڈبل سلائی", checked: false },

    { label: "ڈبل دھاگہ سنگل سلائی", checked: false },

    { label: "ڈبل سلائی", checked: false },

    { label: "ڈبل دھاگہ ڈبل سلائی", checked: false },

    { label: "3x3 سلائی", checked: false },

    { label: "3x3 ڈبل دھاگہ سنگل سلائی", checked: false },

    { label: "پیر سلائی", checked: false },

    { label: "واسکٹ بٹن", checked: false },

    { label: "نام نہیں", checked: false },

    { label: "چاک پٹی کاج", checked: false },

    { label: "پٹی میں 5 کاج", checked: false },

    { label: "سلکی تار، سنگل سلائی", checked: false },

    { label: "سلکی تار ڈبل سلائی", checked: false },

    { label: "سلکی تار ٹرپل سلائی", checked: false },
  ];

  useEffect(() => {
    dispatch(fetchImages());

    if (invoices.length === 0) {
      dispatch(fetchInvoices());
    } else {
      const inv = invoices.find((i) => i._id === id);

      if (inv) {
        // 1. Merge Specifications safely
        const mergedSpecs = defaultSpecs.map((ds) => {
          const existing = inv.specifications?.find(
            (s) => s.label === ds.label,
          );
          return existing ? { ...ds, checked: existing.checked } : ds;
        });

        // 2. Set Form Data with fallbacks
        setFormData({
          ...inv,
          specifications: mergedSpecs,
          customerAddress: inv.customerAddress || "",
          totalAmount: inv.totalAmount ?? 0,
          advanceAmount: inv.advanceAmount ?? 0,
          tadad: inv.tadad ?? 1, // Add this line
          balanceAmount: (inv.totalAmount ?? 0) - (inv.advanceAmount ?? 0),
        });

        // 3. Handle Canvas Data (Backward compatibility for selectedImages)
        const savedCanvasData = inv.designLayers || inv.selectedImages || [];
        setDroppedItems(
          savedCanvasData.map((img, index) => ({
            ...img,
            id: img.id || `saved-${index}-${Date.now()}`, // Better unique ID generation
          })),
        );
      }
    }
    // Remove the duplicate mergedSpecs code that was sitting down here!
  }, [id, invoices, dispatch]);

  const formatDateForInput = (dateStr) =>
    dateStr ? dateStr.split("T")[0] : "";

  const handleMeasurementChange = (index, value) => {
    const updated = [...formData.measurements];

    updated[index] = { ...updated[index], value: value ?? "" };

    setFormData({ ...formData, measurements: updated });
  };

  const handleSpecToggle = (index) => {
    const updated = [...formData.specifications];

    updated[index] = { ...updated[index], checked: !updated[index].checked };

    setFormData({ ...formData, specifications: updated });
  };

  const handleAmountChange = (field, value) => {
    const val = Number(value) || 0;

    const update = { ...formData };

    if (field === "total") update.totalAmount = val;

    if (field === "advance") update.advanceAmount = val;
    if (field === "tadad") update.tadad = val;

    update.balanceAmount = update.totalAmount - update.advanceAmount;

    setFormData(update);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const dataToUpdate = {
        customerName: formData.customerName,
        customerAddress: formData.customerAddress, // This is correct
        contactNo: formData.contactNo,
        bookingDate: formData.bookingDate,
        deliveryDate: formData.deliveryDate,
        refNumber: formData.refNumber,
        measurements: formData.measurements,
        specifications: formData.specifications.filter((s) => s.checked),
        designLayers: droppedItems,
        additionalNotes: formData.additionalNotes,
        totalAmount: formData.totalAmount,
        advanceAmount: formData.advanceAmount,
        balanceAmount: formData.balanceAmount,
       tadad: Number(formData.tadad),
      };

      // REMOVE the toast from here!

      toast.success("Invoice updated successfully!");
      // 1. Wait for the update to finish
      console.log("Data to Update:", dataToUpdate);
      await dispatch(updateInvoice({ id, data: dataToUpdate })).unwrap();

      // 2. Show the toast ONLY after success

      // 3. Reset and Navigate
      dispatch(resetInvoiceState());

      navigate("/invoices");
    } catch (err) {
      console.error("Update Error:", err);
      const errorMessage =
        err?.message ||
        (typeof err === "string" ? err : "Something went wrong");
      toast.error(`Update failed: ${errorMessage}`);
    }
  };

  if (!formData)
    return <div className="p-10 text-center font-black">LOADING...</div>;

  return (
    <div className="min-h-screen py-4  flex flex-col items-center">
      <div
        className="max-w-6xl w-full mx-auto p-6  rounded-3xl shadow-xl border border-slate-200"
        dir="rtl"
      >
        {/* TOP HEADER SECTION */}
        <TailoringHeader
          // 1. Wrap dates in the formatter to fix the console error
          bookingDate={formatDateForInput(formData.bookingDate)}
          setBookingDate={(val) =>
            setFormData({ ...formData, bookingDate: val })
          }
          deliveryDate={formatDateForInput(formData.deliveryDate)}
          setDeliveryDate={(val) =>
            setFormData({ ...formData, deliveryDate: val })
          }
          // 2. Customer Info
          customerName={formData.customerName}
          setCustomerName={(val) =>
            setFormData({ ...formData, customerName: val })
          }
          // 3. Address Connection
          customerAddress={formData.customerAddress}
          setCustomerAddress={(val) =>
            setFormData({ ...formData, customerAddress: val })
          }
          contactNo={formData.contactNo}
          setContactNo={(val) => setFormData({ ...formData, contactNo: val })}
          refNo={formData.refNumber}
          setRefNo={(val) => setFormData({ ...formData, refNumber: val })}
          invoiceNumber={formData.invoiceNumber}
        />

        {/* MEASUREMENTS GRID */}

        <div className="grid grid-cols-9 border-2  rounded-2xl overflow-hidden mb-6 ">
          {formData.measurements.map((m, i) => (
            <div key={i} className="border-l border-slate-900 last:border-l-0">
              <div className=" text-[10px] py-1 font-bold text-center uppercase">
                {m.label}
              </div>

              <input
                className="w-full text-center py-2 text-xl font-black outline-none "
                value={m.value}
                onChange={(e) => handleMeasurementChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* MAIN DESIGN AREA */}

        {/* MAIN DESIGN AREA */}
        {/* MAIN DESIGN AREA */}
        <div className="flex gap-2 items-start h-[500px]">
          {/* 1. LEFT SIDEBAR: STYLE LIBRARY */}
          <div className="w-44 flex flex-col border-2 border-slate-900 rounded-3xl overflow-hidden h-full">
            <div className=" text-[10px] font-black p-1.5 text-center">
              STYLE LIBRARY
            </div>
            <div className="flex-grow overflow-y-auto p-2 grid grid-cols-2 gap-1.5">
              {rows &&
                Object.values(rows)
                  .flat()
                  .map((img) => <StyleIcon key={img.name} img={img} />)}
            </div>
          </div>

          {/* 2. CENTER COLUMN: Canvas + Notes stacked with minimal gap */}
          <div className="flex-grow flex flex-col gap-1 h-full">
            {/* Design Canvas Area - Height increased slightly */}
            <div className="w-full h-[320px]">
              <DesignCanvas
                droppedItems={droppedItems}
                setDroppedItems={setDroppedItems}
              />
            </div>

            {/* Additional Notes Area - Tightly packed */}
            <div className="w-full flex-grow flex flex-col mt-1.5">
              <textarea
                className="flex-grow w-full p-2 border-2 border-slate-900 rounded-xl outline-none  font-bold text-[12px] text-right resize-none leading-tight"
                placeholder="اضافی ہدایات..."
                value={formData.additionalNotes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                dir="rtl"
              />
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR: SPECIFICATIONS */}
          <div className="w-56 border-2 border-slate-900 rounded-3xl overflow-hidden  flex flex-col h-full">
            <div className="  text-[10px] font-black p-1.5 text-center uppercase">
              Specifications
            </div>

            <div className="flex-grow overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
              {formData.specifications.map((item, i) => (
                <label
                  key={i}
                  className="flex items-center justify-between px-2 py-1  rounded-lg cursor-pointer transition-all border-b border-slate-50 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleSpecToggle(i)}
                    className="w-3.5 h-3.5 accent-slate-900"
                  />

                  <span
                    className={`text-[10.5px] font-bold ${
                      item.checked ? "text-slate-900" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}

        {/* PAYMENT SUMMARY - UPDATED TO 4 COLUMNS */}
<div className="mt-6 border-2  rounded-2xl overflow-hidden ">
  <div className="grid grid-cols-4 divide-x-2 divide-x-reverse divide-slate-900 text-center">
    
    {/* 1. TADAD - White BG */}
    <div className="p-3 ">
      <label className="text-[10px] font-bold  uppercase block mb-1">
        تعداد / Qty
      </label>
      <input
        type="number"
        className="bg-transparent text-3xl font-black w-full text-center outline-none text-slate-900 "
        value={formData.tadad}
        onChange={(e) => handleAmountChange("tadad", e.target.value)}
      />
    </div>

    {/* 2. TOTAL AMOUNT - Dark BG */}
    <div className="p-3 ">
      <label className="text-[10px] font-bold opacity-60  uppercase block mb-1">
        Total Amount
      </label>
      <div className="flex justify-center items-center gap-1">
        <span className="font-bold text-amber-400">Rs.</span>
        <input
          className="bg-transparent text-3xl font-black w-full text-center outline-none  focus:ring-0"
          value={formData.totalAmount}
          onChange={(e) => handleAmountChange("total", e.target.value)}
        />
      </div>
    </div>

    {/* 3. ADVANCE PAID - White BG */}
    <div className="p-3 bg-white">
      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
        Advance Paid
      </label>
      <div className="flex justify-center items-center gap-1">
        <span className="text-sm font-bold ">Rs.</span>
        <input
          className="bg-transparent text-3xl font-black w-full text-center outline-none  "
          value={formData.advanceAmount}
          onChange={(e) => handleAmountChange("advance", e.target.value)}
        />
      </div>
    </div>

    {/* 4. BALANCE DUE - Amber Light BG */}
    <div className="p-3 ">
      <label className="text-[10px] font-bold text-amber-700 uppercase block mb-1">
        Balance Due
      </label>
      <div className="flex justify-center items-center gap-1">
        <span className="text-sm font-bold text-amber-600">Rs.</span>
        <span className="text-4xl font-black text-slate-900">
          {formData.balanceAmount}
        </span>
      </div>
    </div>
  </div>
</div>

        {/* FOOTER BUTTONS */}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpdate}
            className="flex-grow  py-4 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg active:scale-95"
          >
            UPDATE & SAVE INVOICE
          </button>

          <button
            onClick={() => navigate("/invoices")}
            className="px-8  border-slate-900 text-slate-900 py-4 rounded-2xl font-black 
            "
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoice;
