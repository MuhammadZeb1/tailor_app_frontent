import React from "react";

const MeasurementGrid = ({ measurements, onChange }) => {
  return (
    <div className="grid grid-cols-9 border-2 border-slate-900 rounded-xl overflow-hidden shadow-sm">
      {measurements
        .slice()
        .reverse()
        .map((item, index) => {
          // Calculate the actual index in the original array
          const originalIndex = measurements.length - 1 - index;

          return (
            <div
              key={originalIndex}
              className="border-l border-slate-200 last:border-l-0 text-center bg-white"
            >
              {/* Label Header */}
              <div className="bg-slate-900 py-2 font-bold text-[9px] text-white uppercase tracking-wider">
                {item.label}
              </div>

              {/* Input Field */}
              <input
                type={item.type || "text"}
                value={item.value}
                onChange={(e) => onChange(originalIndex, e.target.value)}
                className="py-2 px-1 text-xl font-black w-full text-center focus:bg-amber-50 focus:outline-none bg-transparent text-black"
              />
            </div>
          );
        })}
    </div>
  );
};

export default MeasurementGrid;