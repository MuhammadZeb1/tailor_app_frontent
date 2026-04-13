const PaymentSummary = ({ 
  totalAmount, 
  setTotalAmount, 
  advanceAmount, 
  setAdvanceAmount,
  tadad = 1,          // New Prop for Quantity
  setTadad,           // New Setter for Quantity
  isReadOnly = false 
}) => {
  const balanceAmount = (Number(totalAmount) || 0) - (Number(advanceAmount) || 0);

  return (
    <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-white shadow-sm mt-4">
      {/* Changed grid-cols-3 to grid-cols-4 */}
      <div className="grid grid-cols-4 divide-x-2 divide-x-reverse divide-slate-900 text-center">
        
        {/* 1. TADAD (QUANTITY) - ADDED SECTION */}
        <div className="py-3 px-4 bg-white border-r-2 border-slate-900">
          <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
             تعداد / Tadad
          </label>
          <div className="flex items-center justify-center gap-1">
            {isReadOnly ? (
              <span className="text-2xl font-black text-slate-900">{tadad}</span>
            ) : (
              <input
                type="number"
                className="bg-transparent text-2xl font-black w-20 text-center outline-none text-slate-900 focus:ring-0"
                value={tadad}
                onChange={(e) => setTadad && setTadad(e.target.value)}
                min="1"
              />
            )}
          </div>
        </div>

        {/* 2. TOTAL AMOUNT */}
        <div className="py-3 px-4 ">
          <label className="text-[9px] font-black uppercase opacity-60 block mb-1">Total Amount</label>
          <div className="flex items-center justify-center gap-1">
            <span className="text-amber-400 text-xs font-black">Rs.</span>
            {isReadOnly ? (
              <span className="text-2xl font-black">{totalAmount.toLocaleString()}</span>
            ) : (
              <input
                type="number"
                className="bg-transparent text-2xl font-black w-28 text-center outline-none focus:ring-0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 3. ADVANCE PAID */}
        <div className="py-3 px-4 bg-white">
          <label className="text-[9px] font-black uppercase  block mb-1">Advance Paid</label>
          <div className="flex items-center justify-center gap-1">
            <span className=" text-xs font-black">Rs.</span>
            {isReadOnly ? (
              <span className="text-2xl font-black ">{advanceAmount.toLocaleString()}</span>
            ) : (
              <input
                type="number"
                className="bg-transparent text-2xl font-black w-28 text-center outline-none  focus:ring-0"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 4. BALANCE DUE */}
        <div className="py-3 px-4 bg-amber-50">
          <label className="text-[9px] font-black text-amber-700 uppercase block mb-1">Balance Due</label>
          <div className="flex items-center justify-center gap-1">
            <span className="text-amber-600 text-xs font-black">Rs.</span>
            <span className="text-3xl font-black ">
              {balanceAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;