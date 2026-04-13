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
import DesignCanvas from "../components/DesignCanvas";
import StyleIcon from "../components/StyleIcon";
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
        const mergedSpecs = defaultSpecs.map((ds) => {
          const existing = inv.specifications?.find((s) => s.label === ds.label);
          return existing ? { ...ds, checked: existing.checked } : ds;
        });

        setFormData({
          ...inv,
          specifications: mergedSpecs,
          customerAddress: inv.customerAddress || "",
          totalAmount: inv.totalAmount ?? 0,
          advanceAmount: inv.advanceAmount ?? 0,
          tadad: inv.tadad ?? 1,
          balanceAmount: (inv.totalAmount ?? 0) - (inv.advanceAmount ?? 0),
        });

        const savedCanvasData = inv.designLayers || inv.selectedImages || [];
        setDroppedItems(
          savedCanvasData.map((img, index) => ({
            ...img,
            id: img.id || `saved-${index}-${Date.now()}`,
          }))
        );
      }
    }
  }, [id, invoices, dispatch]);

  const formatDateForInput = (dateStr) => (dateStr ? dateStr.split("T")[0] : "");

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
        customerAddress: formData.customerAddress,
        contactNo: formData.contactNo,
        bookingDate: formData.bookingDate,
        deliveryDate: formData.deliveryDate,
        refNumber: formData.refNumber,
        measurements: formData.measurements,
        specifications: formData.specifications,
        designLayers: droppedItems,
        additionalNotes: formData.additionalNotes,
        totalAmount: formData.totalAmount,
        advanceAmount: formData.advanceAmount,
        balanceAmount: formData.balanceAmount,
        tadad: Number(formData.tadad),
      };

      await dispatch(updateInvoice({ id, data: dataToUpdate })).unwrap();
      toast.success("Invoice updated successfully!");
      dispatch(resetInvoiceState());
      navigate("/invoices");
    } catch (err) {
      toast.error(`Update failed: ${err?.message || "Something went wrong"}`);
    }
  };

  if (!formData)
    return <div className="p-10 text-center font-black text-slate-900">LOADING...</div>;

  return (
    <div className="min-h-screen py-8 bg-slate-50 flex flex-col items-center">
      <div
        className="max-w-6xl w-full mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100"
        dir="rtl"
      >
        {/* HEADER */}
        <div className="mb-6">
          <TailoringHeader
            bookingDate={formatDateForInput(formData.bookingDate)}
            setBookingDate={(val) => setFormData({ ...formData, bookingDate: val })}
            deliveryDate={formatDateForInput(formData.deliveryDate)}
            setDeliveryDate={(val) => setFormData({ ...formData, deliveryDate: val })}
            customerName={formData.customerName}
            setCustomerName={(val) => setFormData({ ...formData, customerName: val })}
            customerAddress={formData.customerAddress}
            setCustomerAddress={(val) => setFormData({ ...formData, customerAddress: val })}
            contactNo={formData.contactNo}
            setContactNo={(val) => setFormData({ ...formData, contactNo: val })}
            refNo={formData.refNumber}
            setRefNo={(val) => setFormData({ ...formData, refNumber: val })}
            invoiceNumber={formData.invoiceNumber}
          />
        </div>

        {/* MEASUREMENTS GRID - DARK THEME */}
        <div className="grid grid-cols-9 border-4 border-slate-900 rounded-3xl overflow-hidden mb-8 shadow-lg shadow-slate-100">
          {formData.measurements.map((m, i) => (
            <div key={i} className="border-l-2 border-slate-900 last:border-l-0 bg-white">
              <div className="bg-slate-900 text-amber-500 text-[10px] py-2 font-black text-center uppercase tracking-widest">
                {m.label}
              </div>
              <input
                className="w-full text-center py-4 text-2xl font-black outline-none text-slate-900 focus:bg-amber-50 transition-colors"
                value={m.value}
                onChange={(e) => handleMeasurementChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* MAIN DESIGN AREA */}
        <div className="flex gap-6 items-start h-[550px] mb-8">
          {/* LEFT: STYLE LIBRARY */}
          <div className="w-48 flex flex-col border-2 border-slate-200 rounded-[2rem] bg-slate-50 overflow-hidden h-full shadow-inner">
            <div className="bg-slate-900 text-amber-500 text-[10px] font-black p-3 text-center tracking-widest uppercase">
              Style Library
            </div>
            <div className="flex-grow overflow-y-auto p-3 grid grid-cols-2 gap-2">
              {rows &&
                Object.values(rows)
                  .flat()
                  .map((img) => <StyleIcon key={img.name} img={img} />)}
            </div>
          </div>

          {/* CENTER: CANVAS & NOTES */}
          <div className="flex-grow flex flex-col gap-4 h-full">
            <div className="w-full h-[350px] border-2 border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner">
              <DesignCanvas droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
            </div>
            <div className="w-full flex-grow border-2 border-slate-200 rounded-[1.5rem] overflow-hidden">
              <div className="bg-slate-900 text-amber-500
               text-[10px] font-black px-4 py-2 text-right uppercase tracking-widest">
                اضافی ہدایات (Notes)
              </div>
              <textarea
                className="w-full h-[20%] p-4 outline-none font-bold text-sm text-right resize-none bg-white text-slate-700"
                placeholder="..."
                value={formData.additionalNotes || ""}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              />
            </div>
          </div>

          {/* RIGHT: SPECIFICATIONS */}
          <div className="w-64 border-2 border-slate-200 rounded-[2rem] bg-white overflow-hidden flex flex-col h-full shadow-sm">
            <div className="bg-slate-900 text-amber-500 text-[10px] font-black p-3 text-center uppercase tracking-widest">
              Specifications
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {formData.specifications.map((item, i) => (
                <label
                  key={i}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                    item.checked ? "bg-amber-50 border-amber-200" : "bg-white border-transparent hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleSpecToggle(i)}
                    className="w-4 h-4 accent-slate-900"
                  />
                  <span className={`text-[11px] font-black uppercase ${item.checked ? "text-slate-900" : "text-slate-500"}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY - UNIFIED BLACK BAR */}
        <div className="mt-10 border-4 border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-4 divide-x-2 divide-x-reverse divide-slate-900 text-center">
            {/* Qty */}
            <div className="p-4 bg-white">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">تعداد / Qty</label>
              <input
                type="number"
                className="bg-transparent text-4xl font-black w-full text-center outline-none text-slate-900"
                value={formData.tadad}
                onChange={(e) => handleAmountChange("tadad", e.target.value)}
              />
            </div>

            {/* Total */}
            <div className="p-4 bg-slate-900">
              <label className="text-[10px] font-black text-amber-500/60 uppercase block mb-1 tracking-widest">Total Amount</label>
              <div className="flex justify-center items-center gap-2">
                <span className="font-black text-amber-500 text-sm">Rs.</span>
                <input
                  className="bg-transparent text-4xl font-black w-full text-center outline-none text-amber-500"
                  value={formData.totalAmount}
                  onChange={(e) => handleAmountChange("total", e.target.value)}
                />
              </div>
            </div>

            {/* Advance */}
            <div className="p-4 bg-white">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Advance Paid</label>
              <div className="flex justify-center items-center gap-2">
                <span className="text-sm font-black text-slate-900">Rs.</span>
                <input
                  className="bg-transparent text-4xl font-black w-full text-center outline-none text-slate-900"
                  value={formData.advanceAmount}
                  onChange={(e) => handleAmountChange("advance", e.target.value)}
                />
              </div>
            </div>

            {/* Balance */}
            <div className="p-4 bg-amber-500">
              <label className="text-[10px] font-black text-slate-900/60 uppercase block mb-1 tracking-widest">Balance Due</label>
              <div className="flex justify-center items-center gap-2 text-slate-900">
                <span className="text-sm font-black">Rs.</span>
                <span className="text-5xl font-black">{formData.balanceAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleUpdate}
            className="flex-grow bg-slate-900 text-amber-500 py-5 rounded-[1.5rem] font-black text-xl hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest"
          >
            Update & Save Record
          </button>
          <button
            onClick={() => navigate("/invoices")}
            className="px-12 border-4 border-slate-900 text-slate-900 py-5 rounded-[1.5rem] font-black text-xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoice;