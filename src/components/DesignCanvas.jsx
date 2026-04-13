import React from "react";

const DesignCanvas = ({ droppedItems = [], setDroppedItems = () => {} }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("imgData");
      if (!data) return;

      const imgData = JSON.parse(data);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setDroppedItems([
        ...droppedItems,
        { ...imgData, x, y, id: Date.now(), markers: [] },
      ]);
    } catch (err) {
      console.error("Drop Error:", err);
    }
  };

  const addMarker = (itemId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDroppedItems(
      droppedItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            markers: [
              ...(item.markers || []),
              { id: Date.now(), x, y, text: "" },
            ],
          };
        }
        return item;
      }),
    );
  };

  const updateMarkerText = (itemId, markerId, text) => {
    setDroppedItems(
      droppedItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            markers: (item.markers || []).map((m) =>
              m.id === markerId ? { ...m, text } : m,
            ),
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => {
    setDroppedItems(droppedItems.filter((item) => item.id !== id));
  };

  const removeMarker = (itemId, markerId) => {
    setDroppedItems(
      droppedItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            markers: (item.markers || []).filter((m) => m.id !== markerId),
          };
        }
        return item;
      }),
    );
  };

  return (
    <div
      className="flex-grow relative border-2  rounded-xl min-h-[325px]  print:border-none"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {droppedItems.length === 0 && (
        <div className="absolute inset-0 
        flex items-center justify-center font-bold pointer-events-none uppercase text-xs tracking-widest">
          Drop Design Icons Here
        </div>
      )}

      {droppedItems.map((item) => (
        <div
          key={item.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {/* MAIN ITEM DELETE BUTTON - Styled Professionally */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeItem(item.id);
            }}
            className="absolute -top-3 -right-3   w-5 h-5 flex items-center
             justify-center rounded-full text-[12px]  
              z-50 no-print hover:bg-red-600 "
          >
            
            ×
          </button>

          <div
            className="relative cursor-crosshair p-2"
            onClick={(e) => addMarker(item.id, e)}
          >
            <img
              src={item.url}
              alt={item.name}
              className="w-20 h-20 block select-none pointer-events-none object-contain"
              style={{ filter: "grayscale(1) contrast(1.1)" }} 
            />

            {item.markers?.map((marker) => (
              <div
                key={marker.id}
                className="absolute z-50 -translate-x-1/2 -translate-y-1/2 group/marker"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center  rounded px-1">
                  <input
                    autoFocus
                    className="w-12 text-[11px] font-bold text-black bg-transparent outline-none text-center"
                    value={marker.text}
                    placeholder="0.0"
                    onChange={(e) =>
                      updateMarkerText(item.id, marker.id, e.target.value)
                    }
                  />
                  
                  {/* MARKER DELETE BUTTON - Small and Clean */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMarker(item.id, marker.id);
                    }}
                    className="ml-1  no-print  group-hover/marker:opacity-100 transition-opacity text-[10px]"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DesignCanvas;