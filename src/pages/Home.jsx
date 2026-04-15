import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../feathures/invoice/invoiceSlice";
import { 
  FaPlus, FaFileInvoiceDollar, 
  FaExclamationTriangle, FaClock, FaCheckCircle, FaTimes, FaWallet,FaCalendarAlt
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoice);
  
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const calculateStatus = (inv) => {
    // Priority 1: Payment Status (If paid, it's completed regardless of date)
    if (inv.balanceAmount <= 0 && inv.totalAmount > 0) return "Completed";
    
    // Priority 2: Delivery Dates
    if (!inv.deliveryDate) return "Upcoming";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(inv.deliveryDate);
    delivery.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Overdue";
    if (diffDays <= 2) return "Urgent";
    return "Upcoming";
  };

  const getSmartStats = () => {
    if (!invoices) return { overdue: [], urgent: [], upcoming: [], completed: [], unpaid: [] };
    return invoices.reduce((acc, inv) => {
      const status = inv.smartStatus || calculateStatus(inv);
      const isUnpaid = (inv.balanceAmount ?? 0) > 0;

      if (status === "Overdue") acc.overdue.push(inv);
      else if (status === "Urgent") acc.urgent.push(inv);
      else if (status === "Completed") acc.completed.push(inv);
      else acc.upcoming.push(inv);

      if (isUnpaid) acc.unpaid.push(inv);

      return acc;
    }, { overdue: [], urgent: [], upcoming: [], completed: [], unpaid: [] });
  };

  const smartData = getSmartStats();
  const totalRevenue = invoices?.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) || 0;

  // --- FILTER LOGIC ---
  const filteredInvoices = invoices?.filter(inv => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unpaid") return (inv.balanceAmount ?? 0) > 0;
    
    const status = inv.smartStatus || calculateStatus(inv);
    return status === activeFilter;
  });

  const stats = [
    { label: "Overdue", value: smartData.overdue.length, icon: FaExclamationTriangle, color: "text-red-600", bg: "bg-red-50", filterType: "Overdue" },
    { label: "Urgent", value: smartData.urgent.length, icon: FaClock, color: "text-orange-600", bg: "bg-orange-50", filterType: "Urgent" },
    { label: "Unpaid", value: smartData.unpaid.length, icon: FaWallet, color: "text-rose-600", bg: "bg-rose-50", filterType: "Unpaid" },
    { label: "Completed", value: smartData.completed.length, icon: FaCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", filterType: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
              Tailor<span className="text-blue-600">Flow</span>
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest opacity-70">Management Dashboard</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
                <p className="text-xl font-black text-emerald-600">Rs. {totalRevenue.toLocaleString()}</p>
             </div>
             <button
                onClick={() => navigate("/create-invoice")}
                className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-2 uppercase text-sm tracking-tighter"
             >
                <FaPlus /> New Invoice
             </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => setActiveFilter(stat.filterType)}
              className={`cursor-pointer border-2 transition-all duration-300 rounded-3xl p-5 shadow-sm active:scale-95
                ${activeFilter === stat.filterType ? 'border-slate-900 bg-white ring-8 ring-slate-900/5' : 'border-white bg-white hover:border-slate-200'}`}
            >
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl shadow-inner`}>
                <stat.icon />
              </div>
              <p className="text-[10px] uppercase text-slate-400 font-black tracking-[2px]">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none mt-1">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden h-full min-h-[250px] flex flex-col justify-between">
               <div>
                  <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Status Monitor</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Currently filtering by <span className="text-amber-500 font-black">{activeFilter}</span>. 
                    Click any card above to switch views.
                  </p>
               </div>
               
               {activeFilter !== "All" && (
                 <button 
                   onClick={() => setActiveFilter("All")}
                   className="w-fit relative z-10 text-[11px] bg-white text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg"
                 >
                   Show All Orders
                 </button>
               )}
               <div className="absolute -bottom-10 -right-10 text-white/5 text-[12rem] rotate-12 pointer-events-none">
                 <FaFileInvoiceDollar />
               </div>
            </div>
          </div>

          {/* Table Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {activeFilter === "All" ? "Live Order Feed" : `${activeFilter} List`}
                  </h2>
                </div>
                {activeFilter !== "All" && (
                  <button 
                    onClick={() => setActiveFilter("All")}
                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 border-2 border-slate-100 px-4 py-2 rounded-full hover:bg-white hover:text-red-500 transition-all"
                  >
                    <FaTimes /> RESET
                  </button>
                )}
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Customer Details</th>
                      <th className="px-8 py-5">Delivery</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredInvoices?.length > 0 ? (
                      filteredInvoices.map((inv) => {
                        const currentStatus = inv.smartStatus || calculateStatus(inv);
                        const hasBalance = (inv.balanceAmount ?? 0) > 0;
                        
                        return (
                          <tr 
                            key={inv._id} 
                            onClick={() => navigate("/invoices")} 
                            className="hover:bg-blue-50/30 cursor-pointer transition-all group"
                          >
                            <td className="px-8 py-5">
                              <p className="font-black text-slate-800 group-hover:text-blue-600 uppercase tracking-tight transition-colors">
                                {inv.customerName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold">INV #{inv.invoiceNumber}</p>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <FaCalendarAlt className="text-slate-300" />
                                {inv.deliveryDate ? new Date(inv.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '---'}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest
                                ${currentStatus === 'Overdue' ? 'bg-red-100 text-red-600' : 
                                  currentStatus === 'Urgent' ? 'bg-orange-100 text-orange-600' : 
                                  currentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                                  'bg-blue-100 text-blue-600'}`}>
                                {currentStatus}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <p className={`font-black ${hasBalance ? 'text-rose-600' : 'text-emerald-500'}`}>
                                {hasBalance ? `Rs. ${inv.balanceAmount.toLocaleString()}` : 'PAID'}
                              </p>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-32">
                          <div className="flex flex-col items-center opacity-20">
                            <FaFileInvoiceDollar size={48} className="mb-4" />
                            <p className="font-black uppercase tracking-[4px] text-xs">No {activeFilter} Records</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;