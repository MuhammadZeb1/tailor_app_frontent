import React from "react";

const StyleIcon = ({ img }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("imgData", JSON.stringify(img));
  };

  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="bg-white border-2 border-slate-100 p-2 rounded-xl hover:border-amber-500 cursor-grab active:cursor-grabbing transition-all shadow-sm group"
    >
      <img src={img.url} alt={img.name} className="w-full h-12 object-contain group-hover:scale-110 transition-transform" />
      {/* <p className="text-[7px] text-center mt-1 text-slate-400 uppercase font-bold">{img.name}</p> */}
    </div>
  );
};

export default StyleIcon;