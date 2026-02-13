import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices, updateInvoice } from "../feathures/invoice/invoiceSlice";
import { fetchImages } from "../feathures/imageSlice";

const UpdateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { invoices } = useSelector((state) => state.invoice);
  const { rows } = useSelector((state) => state.images);
  const [formData, setFormData] = useState(null);

  // Default specifications list
  const defaultSpecs = [
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
  ];

  useEffect(() => {
    dispatch(fetchImages());
    if (invoices.length === 0) {
      dispatch(fetchInvoices());
    } else {
      const inv = invoices.find((i) => i._id === id);
      if (inv) {
        // Ensure that specifications in formData match our default labels
        // but keep the 'checked' status from the database
        const mergedSpecs = defaultSpecs.map(ds => {
          const existing = inv.specifications?.find(s => s.label === ds.label);
          return existing ? { ...ds, checked: existing.checked } : ds;
        });

        setFormData({ ...inv, specifications: mergedSpecs });
      }
    }
  }, [id, invoices, dispatch]);

  const toggleImageSelection = (imageName) => {
    const currentImages = [...formData.selectedImages];
    const updatedImages = currentImages.includes(imageName)
      ? currentImages.filter((name) => name !== imageName)
      : [...currentImages, imageName];
    
    setFormData({ ...formData, selectedImages: updatedImages });
  };

  const handleMeasurementChange = (index, newValue) => {
    const updatedMeasurements = [...formData.measurements];
    updatedMeasurements[index] = { ...updatedMeasurements[index], value: newValue };
    setFormData({ ...formData, measurements: updatedMeasurements });
  };

  const handleSpecToggle = (index) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], checked: !updatedSpecs[index].checked };
    setFormData({ ...formData, specifications: updatedSpecs });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateInvoice({ id, data: formData }));
    navigate("/invoices");
  };

  if (!formData) return <div className="p-10 text-center font-bold">Loading Invoice Data...</div>;

  return (
    <div className="min-h-screen py-10 flex items-center bg-gray-50">
      <div className="max-w-4xl w-full mx-auto p-4 bg-white border border-gray-800 text-[12px] font-sans shadow-lg" dir="rtl">
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-2 border-gray-800 rounded-xl p-3 mb-2 gap-4">
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2">
              <label className="font-bold w-24">تاریخ بکنگ:</label>
              <input 
                type="date" 
                className="border-b border-gray-300 outline-none" 
                value={formData.bookingDate ? formData.bookingDate.split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold w-24">تاریخ واپسی:</label>
              <input 
                type="date" 
                className="border-b border-gray-300 outline-none" 
                value={formData.deliveryDate ? formData.deliveryDate.split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold w-24">فون نمبر:</label>
              <input 
                type="text" 
                value={formData.contactNo} 
                onChange={(e) => setFormData({...formData, contactNo: e.target.value})} 
                className="border-b border-gray-800 focus:outline-none w-32 font-bold" 
              />
            </div>
          </div>

          <div className="space-y-2 text-left" dir="ltr">
            <p className="flex items-center gap-2 justify-end">
              <label className="font-bold text-gray-800">Inv.No.</label>
              <span className="border-b border-gray-800 w-24 text-center font-bold text-lg text-blue-800">
                {formData.invoiceNumber}
              </span>
            </p>
            <p className="flex items-center gap-2 justify-end">
              <label className="font-bold">Ref.No.</label>
              <input 
                type="number" 
                value={formData.refNumber} 
                onChange={(e) => setFormData({...formData, refNumber: e.target.value})} 
                className="border-b border-gray-800 focus:outline-none w-16 text-center font-bold" 
              />
            </p>
            <p className="flex items-center gap-2 justify-end">
              <label className="font-bold">Name</label>
              <input 
                type="text" 
                value={formData.customerName} 
                onChange={(e) => setFormData({...formData, customerName: e.target.value})} 
                className="border-b border-gray-800 focus:outline-none w-32 px-1 text-right font-bold" 
              />
            </p>
          </div>
        </div>

        {/* Measurements Grid */}
        <div className="grid grid-cols-9 border-t-2 border-x-2 border-gray-800">
          {formData.measurements.map((item, index) => (
            <div key={index} className="border-b-2 border-l-2 border-gray-800 text-center">
              <div className="bg-gray-100 py-1 font-bold border-b border-gray-800 text-[10px]">{item.label}</div>
              <input 
                type="text" 
                value={item.value} 
                onChange={(e) => handleMeasurementChange(index, e.target.value)} 
                className="py-2 px-1 text-lg font-bold w-full text-center focus:outline-none bg-transparent" 
              />
            </div>
          ))}
        </div>

        {/* Styles & Specifications Section */}
        <div className="flex border-2 border-gray-800 mt-2 min-h-[250px]">
          {/* Style Images Selection */}
          <div className="flex-grow grid grid-cols-4 gap-2 p-2 border-l border-gray-800 bg-gray-50">
            {rows && Object.keys(rows).map((row) => rows[row].map((img) => (
              <div 
                key={img.name} 
                onClick={() => toggleImageSelection(img.name)} 
                className={`relative border-2 p-1 flex flex-col items-center rounded cursor-pointer h-20 justify-center ${formData.selectedImages.includes(img.name) ? "border-blue-600 bg-blue-100" : "border-transparent opacity-60"}`}
              >
                <img src={img.url} alt={img.name} className="max-h-full object-contain" />
              </div>
            )))}
          </div>

          {/* Checklist Specifications Mapped Here */}
          <div className="w-1/3 p-2 space-y-1 text-right bg-white overflow-y-auto max-h-[300px]">
            {formData.specifications.map((item, index) => (
              <label key={index} className="flex justify-between items-center border-b border-gray-100 pb-1 cursor-pointer hover:bg-gray-50">
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => handleSpecToggle(index)} 
                  className="w-4 h-4"
                />
                <span className={`font-medium text-[11px] pr-2 ${item.checked ? "text-black font-bold" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-4 border-2 border-gray-800 rounded-lg bg-gray-50 overflow-hidden">
          <div className="grid grid-cols-3 gap-0">
            <div className="flex flex-col items-center p-3 border-l border-gray-800">
              <label className="font-bold mb-1 text-gray-700">کل رقم (Total)</label>
              <input 
                type="number" 
                className="w-full text-center text-xl font-bold bg-transparent outline-none border-b border-gray-300 focus:border-black" 
                value={formData.totalAmount} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({...formData, totalAmount: val, balanceAmount: val - formData.advanceAmount});
                }} 
              />
            </div>
            <div className="flex flex-col items-center p-3 border-l border-gray-800">
              <label className="font-bold mb-1 text-gray-700">وصول (Advance)</label>
              <input 
                type="number" 
                className="w-full text-center text-xl font-bold text-green-700 bg-transparent outline-none border-b border-gray-300 focus:border-green-700" 
                value={formData.advanceAmount} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({...formData, advanceAmount: val, balanceAmount: formData.totalAmount - val});
                }} 
              />
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50">
              <label className="font-bold mb-1 text-gray-700">بقیہ (Balance)</label>
              <div className="text-2xl font-black text-red-600">{formData.balanceAmount}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            type="submit" 
            onClick={handleUpdate}
            className="flex-grow bg-gray-900 text-white py-3 font-bold text-lg rounded shadow-md hover:bg-black transition-colors"
          >
            Update Invoice
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/history")} 
            className="px-6 bg-red-600 text-white font-bold rounded shadow-md hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoice;