import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInvoices,
  updateInvoice,
  updateWorkStatus,
  resetInvoiceState,
} from "../feathures/invoice/invoiceSlice";
import { fetchImages } from "../feathures/imageSlice";
import { toast } from "react-toastify";

// Components
import DesignCanvas from "../components/DesignCanvas";
import StyleIcon from "../components/StyleIcon";
import TailoringHeader from "../components/TailoringHeader";
import PaymentSummary from "../components/PaymentSummary";
import FormActions from "../components/FormActions";
import MeasurementGrid from "../components/MeasurementGrid";

const UpdateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { invoices, isLoading } = useSelector((state) => state.invoice);
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

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMeasurementChange = (index, value) => {
    const updated = [...formData.measurements];
    updated[index] = { ...updated[index], value: value ?? "" };
    updateFormField("measurements", updated);
  };

  const handleSpecToggle = (index) => {
    const updated = [...formData.specifications];
    updated[index] = { ...updated[index], checked: !updated[index].checked };
    updateFormField("specifications", updated);
  };

  // --- HANDLER FOR SUIT READINESS ONLY ---
  const handleStatusToggle = async () => {
    const nextStatus = formData.status === "Completed" ? "Pending" : "Completed";
    
    if (window.confirm(`Mark suit as ${nextStatus === "Completed" ? "READY" : "NOT READY"}?`)) {
      try {
        const result = await dispatch(updateWorkStatus({ id, status: nextStatus })).unwrap();
        updateFormField("status", result.status);
        toast.success(`Suit status updated to ${result.smartStatus}`);
      } catch (err) {
        toast.error("Failed to update suit status");
      }
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    try {
      const dataToUpdate = {
        ...formData,
        designLayers: droppedItems,
        tadad: Number(formData.tadad),
      };
    console.log("update that ",dataToUpdate)
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
      <div className="max-w-6xl w-full mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100" dir="rtl">
        
        {/* --- DYNAMIC STATUS BAR --- */}
        <div className="flex justify-between items-center mb-6 bg-slate-900 p-5 rounded-[1.5rem] shadow-inner">
           <div className="flex gap-4 items-center">
             <span className="text-white font-bold text-sm tracking-widest">SUIT STATUS:</span>
             <button 
                onClick={handleStatusToggle}
                className={`px-8 py-2.5 rounded-full font-black text-[10px] uppercase transition-all shadow-lg border-2 ${
                  formData.status === "Completed" 
                  ? "bg-green-500 border-green-400 text-white" 
                  : "bg-amber-500 border-amber-400 text-slate-900"
                }`}
             >
               {formData.status === "Completed" ? "✓ READY FOR COLLECTION" : "MARK AS READY"}
             </button>
           </div>

           {/* AUTOMATIC PAYMENT BADGE (Calculated based on balance) */}
           <div className={`px-6 py-2.5 rounded-full font-black text-[10px] border-2 ${
             formData.balanceAmount <= 0 
             ? "bg-green-500/10 border-green-500 text-green-500" 
             : "bg-red-500/10 border-red-500 text-red-500"
           }`}>
             PAYMENT: {formData.balanceAmount <= 0 ? "PAID" : "UNPAID"}
           </div>
        </div>

        <TailoringHeader
          bookingDate={formatDateForInput(formData.bookingDate)}
          setBookingDate={(val) => updateFormField("bookingDate", val)}
          deliveryDate={formatDateForInput(formData.deliveryDate)}
          setDeliveryDate={(val) => updateFormField("deliveryDate", val)}
          customerName={formData.customerName}
          setCustomerName={(val) => updateFormField("customerName", val)}
          customerAddress={formData.customerAddress}
          setCustomerAddress={(val) => updateFormField("customerAddress", val)}
          contactNo={formData.contactNo}
          setContactNo={(val) => updateFormField("contactNo", val)}
          refNo={formData.refNumber}
          setRefNo={(val) => updateFormField("refNumber", val)}
          invoiceNumber={formData.invoiceNumber}
        />

        <div className="my-8">
          <MeasurementGrid 
            measurements={formData.measurements} 
            onChange={handleMeasurementChange} 
          />
        </div>

        <div className="flex gap-6 items-start h-[550px] mb-8">
          <div className="w-48 flex flex-col border-2 border-slate-200 rounded-[2rem] bg-slate-50 overflow-hidden h-full shadow-inner">
            <div className="bg-slate-900 text-amber-500 text-[10px] font-black p-3 text-center uppercase tracking-widest">Style Library</div>
            <div className="flex-grow overflow-y-auto p-3 grid grid-cols-2 gap-2">
              {rows && Object.values(rows).flat().map((img) => (
                <StyleIcon key={img.name} img={img} />
              ))}
            </div>
          </div>

          <div className="flex-grow flex flex-col gap-4 h-full">
            <div className="w-full h-[350px] border-2 border-slate-200 rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner">
              <DesignCanvas droppedItems={droppedItems} setDroppedItems={setDroppedItems} />
            </div>
            <div className="w-full flex-grow border-2 border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
              <div className="bg-slate-900 text-amber-500 text-[10px] font-black px-4 py-2 text-right uppercase tracking-widest">اضافی ہدایات (Notes)</div>
              <textarea
                className="w-full h-full p-4 outline-none font-bold text-sm text-right resize-none bg-white focus:bg-amber-50 transition-colors"
                placeholder="..."
                value={formData.additionalNotes || ""}
                onChange={(e) => updateFormField("additionalNotes", e.target.value)}
              />
            </div>
          </div>

          <div className="w-64 border-2 border-slate-200 rounded-[2rem] bg-white overflow-hidden flex flex-col h-full shadow-sm">
            <div className="bg-slate-900 text-amber-500 text-[10px] font-black p-3 text-center uppercase tracking-widest">Specifications</div>
            <div className="flex-grow overflow-y-auto p-2 space-y-1">
              {formData.specifications?.map((item, i) => (
                <label key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer border transition-all ${item.checked ? "bg-amber-50 border-amber-200" : "bg-white border-transparent hover:bg-slate-50"}`}>
                  <input type="checkbox" checked={item.checked} onChange={() => handleSpecToggle(i)} className="w-4 h-4 accent-slate-900" />
                  <span className={`text-[11px] font-black uppercase ${item.checked ? "text-slate-900" : "text-slate-500"}`}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <PaymentSummary 
          totalAmount={formData.totalAmount}
          setTotalAmount={(val) => updateFormField("totalAmount", val)}
          advanceAmount={formData.advanceAmount}
          setAdvanceAmount={(val) => updateFormField("advanceAmount", val)}
          tadad={formData.tadad}
          setTadad={(val) => updateFormField("tadad", val)}
        />

        <div className="mt-6">
          <FormActions 
            onSave={handleUpdate} 
            onCancel={() => navigate("/invoices")}
            loading={isLoading}
            label="Save All Changes"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoice;