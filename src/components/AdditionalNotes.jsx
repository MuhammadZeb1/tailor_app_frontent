import React from "react";

const AdditionalNotes = ({ notes, setNotes }) => {
  return (
    <div className="mt-4 border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-sm no-print-border">
      <div className="bg-slate-900 text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest flex justify-between items-center">
        <span>Additional Notes / خصوصی ہدایات</span>
        <span className="text-[8px] opacity-70 no-print">Optional</span>
      </div>
      
      <textarea
        rows="3"
        placeholder="کسی بھی قسم کی اضافی معلومات یہاں لکھیں..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-3 text-[11px] font-bold text-slate-800 outline-none resize-none bg-transparent placeholder:text-slate-300 print:p-1 transition-all focus:bg-amber-50/30"
      />
      
      {/* Visual cue for the user that this area is for writing */}
      <div className="no-print h-1 bg-slate-100 w-full" />
    </div>
  );
};

export default AdditionalNotes;