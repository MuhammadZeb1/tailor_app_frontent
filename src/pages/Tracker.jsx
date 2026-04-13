import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../feathures/invoice/invoiceSlice";
import { 
  FaCalendarDay, FaCheckCircle, FaCut, FaTruck, 
  FaPrint, FaArrowLeft, FaChartLine, FaWallet, FaRegChartBar 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Tracker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices } = useSelector((state) => state.invoice);
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // --- FINANCIAL LOGIC: Daily, Weekly, Monthly Profit ---
  const getProfitStats = () => {
    if (!invoices) return { daily: 0, weekly: 0, monthly: 0 };

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Weekly range (Last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);

    return invoices.reduce((acc, inv) => {
      const invDate = new Date(inv.createdAt || inv.date); // Use createdAt or invoice date
      const invDateStr = invDate.toISOString().split('T')[0];
      const amount = Number(inv.totalAmount) || 0;

      // 1. Daily Profit
      if (invDateStr === todayStr) acc.daily += amount;

      // 2. Weekly Profit (within last 7 days)
      if (invDate >= lastWeek && invDate <= now) acc.weekly += amount;

      // 3. Monthly Profit (current month)
      if (invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear()) {
        acc.monthly += amount;
      }

      return acc;
    }, { daily: 0, weekly: 0, monthly: 0 });
  };

  const profits = getProfitStats();

  // --- LOGIC: Daily Work list ---
  const dailyWork = invoices?.filter(inv => {
    if (!inv.deliveryDate) return false;
    const invDate = new Date(inv.deliveryDate).toISOString().split('T')[0];
    return invDate === selectedDay && inv.balanceAmount > 0;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
              <FaArrowLeft className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Financial Tracker</h1>
              <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">Profit & Production Analytics</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
            <FaPrint /> Print Report
          </button>
        </div>

        {/* PROFIT CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
          <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FaWallet />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily Revenue</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Rs. {profits.daily.toLocaleString()}</h2>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <FaChartLine size={60} />
            </div>
          </div>

          <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <FaRegChartBar />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Weekly Total</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Rs. {profits.weekly.toLocaleString()}</h2>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <FaCalendarDay size={60} />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="bg-white/10 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl">
              <FaChartLine />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly Profit</p>
            <h2 className="text-3xl font-black text-white mt-1">Rs. {profits.monthly.toLocaleString()}</h2>
            <div className="absolute -bottom-4 -right-4 text-white/5 text-8xl rotate-12 group-hover:scale-110 transition-transform">
               <FaWallet />
            </div>
          </div>
        </div>

        {/* MAIN WORK AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-black text-slate-800 uppercase tracking-tight px-2">Delivery Schedule List</h2>
            {dailyWork.length > 0 ? (
              dailyWork.map((inv) => (
                <div key={inv._id} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl"><FaCut className="text-slate-400" /></div>
                    <div>
                      <p className="font-black text-slate-900 uppercase">{inv.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inv #{inv.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase">To Collect</p>
                    <p className="font-black text-blue-600">Rs. {inv.balanceAmount}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No work orders for this period</p>
              </div>
            )}
          </div>

          <div className="space-y-6 no-print">
            <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-xl shadow-blue-100 relative overflow-hidden">
               <h3 className="text-lg font-black mb-1 italic">Production Hub</h3>
               <p className="text-xs font-bold text-blue-100 uppercase mb-4 tracking-widest">Total Active Orders</p>
               <p className="text-5xl font-black">{invoices?.filter(i => i.balanceAmount > 0).length}</p>
               <FaTruck className="absolute -bottom-2 -right-2 text-white/10 text-7xl rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;