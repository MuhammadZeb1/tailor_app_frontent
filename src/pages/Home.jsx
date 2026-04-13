import React, { useEffect, useState } from "react"; // Added useState
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../feathures/invoice/invoiceSlice";
import { 
  FaPlus, FaFileInvoiceDollar, 
  FaExclamationTriangle, FaClock, FaCheckCircle, FaArrowRight, FaCalendarAlt, FaTimes
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoice);
  
  // --- NEW STATE: Track which filter is active ---
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const calculateStatus = (inv) => {
    if (inv.balanceAmount <= 0 && inv.totalAmount > 0) return "Completed";
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
    if (!invoices) return { overdue: [], urgent: [], upcoming: [], completed: [] };
    return invoices.reduce((acc, inv) => {
      const status = inv.smartStatus || calculateStatus(inv);
      if (status === "Overdue") acc.overdue.push(inv);
      else if (status === "Urgent") acc.urgent.push(inv);
      else if (status === "Completed") acc.completed.push(inv);
      else acc.upcoming.push(inv);
      return acc;
    }, { overdue: [], urgent: [], upcoming: [], completed: [] });
  };

  const smartData = getSmartStats();
  const totalRevenue = invoices?.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) || 0;

  // --- LOGIC: Filter the table data based on card click ---
  const filteredInvoices = invoices?.filter(inv => {
    if (activeFilter === "All") return true;
    const status = inv.smartStatus || calculateStatus(inv);
    return status === activeFilter;
  });

  const stats = [
    { label: "Overdue Orders", value: smartData.overdue.length, icon: FaExclamationTriangle, color: "text-red-600", bg: "bg-red-50", filterType: "Overdue" },
    { label: "Urgent (48h)", value: smartData.urgent.length, icon: FaClock, color: "text-orange-600", bg: "bg-orange-50", filterType: "Urgent" },
    { label: "Completed", value: smartData.completed.length, icon: FaCheckCircle, color: "text-blue-600", bg: "bg-blue-50", filterType: "Completed" },
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: FaFileInvoiceDollar, color: "text-emerald-600", bg: "bg-emerald-50", filterType: "All" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">
              Popular <span className="text-blue-600 font-light">Fabrics</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Smart Tailoring Management Dashboard</p>
          </div>
          <button
            onClick={() => navigate("/create-invoice")}
            className="bg-slate-900 hover:scale-105 text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center gap-2"
          >
            <FaPlus /> NEW INVOICE
          </button>
        </div>

        {/* STATS ROW - Now clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => setActiveFilter(stat.filterType)}
              className={`cursor-pointer border-2 transition-all rounded-2xl p-5 shadow-sm active:scale-95
                ${activeFilter === stat.filterType ? 'border-slate-900 bg-white ring-4 ring-slate-900/5' : 'border-white bg-white hover:border-slate-200'}`}
            >
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl`}>
                <stat.icon />
              </div>
              <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
               {/* Simplified Priority Info */}
               <h2 className="text-lg font-black mb-1">Status View</h2>
               <p className="text-slate-400 text-xs mb-4">Currently viewing: <span className="text-white font-bold">{activeFilter}</span></p>
               <button 
                 onClick={() => setActiveFilter("All")}
                 className="relative z-10 text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:bg-white/30 transition-all"
               >
                 Clear Filter
               </button>
               <div className="absolute -bottom-4 -right-4 text-white/5 text-8xl rotate-12"><FaExclamationTriangle /></div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {activeFilter === "All" ? "Live Status Tracker" : `${activeFilter} Orders`}
                  </h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    {filteredInvoices?.length || 0} orders found
                  </p>
                </div>
                {activeFilter !== "All" && (
                  <button 
                    onClick={() => setActiveFilter("All")}
                    className="flex items-center gap-1 text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100"
                  >
                    <FaTimes size={10} /> RESET
                  </button>
                )}
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Delivery</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices?.length > 0 ? (
                      filteredInvoices.map((inv) => {
                        const currentStatus = inv.smartStatus || calculateStatus(inv);
                        return (
                          <tr key={inv._id} onClick={() => navigate("/invoices")} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-black text-slate-800 group-hover:text-blue-600 uppercase">{inv.customerName}</p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-widest">#00{inv.invoiceNumber}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-600">
                              {inv.deliveryDate ? new Date(inv.deliveryDate).toLocaleDateString() : 'NO DATE'}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter
                                ${currentStatus === 'Overdue' ? 'bg-red-100 text-red-600 border border-red-200' : 
                                  currentStatus === 'Urgent' ? 'bg-orange-100 text-orange-600 border border-orange-200' : 
                                  currentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 
                                  'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                                {currentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-black text-slate-900">Rs. {inv.balanceAmount?.toLocaleString()}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                          No {activeFilter} orders found
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