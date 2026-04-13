import React from "react";

const FormActions = ({ onSave, onCancel, loading, label = "Confirm & Print" }) => {
  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center no-print border-t border-slate-100 pt-6 gap-4">
      
      {/* LEFT SIDE: Branding / Info */}
      <div className="text-right md:text-left">
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[3px] leading-tight">
          Precision Tailoring
        </div>
        <div className="text-[8px] text-slate-300 font-bold uppercase tracking-widest italic">
          Popular Fabrics & Tailoring
        </div>
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="flex flex-row gap-3 w-full md:w-auto items-center">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] tracking-widest hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 active:scale-95 uppercase"
          >
            Cancel
          </button>
        )}

        <button
          onClick={onSave}
          disabled={loading}
          className={`relative w-full md:w-80 py-4 font-black text-[10px] uppercase tracking-[3px] rounded-2xl shadow-xl shadow-slate-100 transition-all duration-300 active:scale-95 flex justify-center items-center gap-3 border-2 ${
            loading
              ? "bg-slate-300 border-slate-300 cursor-not-allowed text-white"
              : "bg-slate-900 border-slate-900 text-white hover:bg-white hover:text-slate-900"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing</span>
            </>
          ) : (
            <>
              <span>{label}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormActions;