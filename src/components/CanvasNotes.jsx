import React from "react";

const CanvasNotes = ({ notes, setNotes }) => {
  return (
    <>
      {/* 1. SCREEN VERSION: This is the floating box you see while typing */}
      <div className="absolute bottom-4 right-4 w-64 no-print shadow-2xl z-50">
        <div className="bg-slate-900/90 backdrop-blur-sm text-white text-[9px] font-black px-3 py-1 rounded-t-xl uppercase tracking-widest border border-slate-700">
          Additional Notes / خصوصی ہدایات
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type custom instructions here..."
          className="w-full bg-white/90 backdrop-blur-sm p-3 text-[11px] font-bold text-slate-800 outline-none resize-none rounded-b-xl border-x border-b border-slate-900 h-24 shadow-inner placeholder:text-slate-300"
        />
      </div>

      {/* 2. PRINT VERSION: This is what actually shows up on the paper */}
      {notes && (
        <div className="hidden print:block absolute bottom-4 left-4 right-4 text-[10px] font-bold border-t border-slate-300 pt-2 text-right" dir="rtl">
          <span className="text-slate-500 uppercase text-[8px] block mb-1">خصوصی ہدایات (Notes):</span>
          <p className="whitespace-pre-wrap leading-tight text-slate-900">
            {notes}
          </p>
        </div>
      )}
    </>
  );
};

export default CanvasNotes;