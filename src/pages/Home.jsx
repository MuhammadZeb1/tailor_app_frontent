import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../feathures/invoice/invoiceSlice";
import { 
  FaPlus, 
  FaHistory, 
  FaFileInvoiceDollar, 
  FaWallet, 
  FaClock, 
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoice);

  // Auto-fetch data when home opens to keep stats fresh
  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  // Advanced Business Calculations
  const totalInvoices = invoices?.length || 0;
  const pendingInvoices = invoices?.filter(inv => inv.balanceAmount > 0) || [];
  const completedInvoicesCount = totalInvoices - pendingInvoices.length;
  
  const totalBalanceDue = pendingInvoices.reduce((acc, inv) => acc + (inv.balanceAmount || 0), 0);
  const totalRevenue = invoices?.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0) || 0;

  const stats = [
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: FaFileInvoiceDollar, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Balance", value: `Rs. ${totalBalanceDue.toLocaleString()}`, icon: FaWallet, color: "text-red-600", bg: "bg-red-50" },
    { label: "Pending Orders", value: pendingInvoices.length, icon: FaClock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Completed", value: completedInvoicesCount, icon: FaCheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
              COMMAND <span className="text-emerald-600">CENTER</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Business Overview & Intelligence</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">System Live</span>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4`}>
                <stat.icon />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{loading ? "..." : stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* QUICK ACTIONS - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</h2>
            
            <button 
              onClick={() => navigate("/create-invoice")}
              className="w-full group bg-slate-900 hover:bg-emerald-600 p-6 rounded-3xl shadow-xl transition-all duration-300 text-left flex justify-between items-center"
            >
              <div>
                <h3 className="text-white text-xl font-bold">New Invoice</h3>
                <p className="text-slate-400 group-hover:text-emerald-100 text-sm mt-1">Create measurement & bill</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl text-white group-hover:translate-x-1 transition-transform">
                <FaPlus />
              </div>
            </button>

            <button 
              onClick={() => navigate("/invoices")}
              className="w-full group bg-white border-2 border-slate-200 hover:border-slate-900 p-6 rounded-3xl transition-all duration-300 text-left flex justify-between items-center"
            >
              <div>
                <h3 className="text-slate-900 text-xl font-bold">Billing History</h3>
                <p className="text-slate-500 text-sm mt-1">Manage & Print Records</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-2xl text-slate-900 group-hover:translate-x-1 transition-transform">
                <FaHistory />
              </div>
            </button>
          </div>

          {/* RECENT INVOICES TABLE - Right Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h2>
              <button onClick={() => navigate("/invoices")} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                VIEW ALL <FaArrowRight />
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Customer</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Inv #</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Balance</th>
                    <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices?.slice(0, 5).map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate("/invoices")}>
                      <td className="p-4">
                        <p className="font-bold text-slate-800 text-sm uppercase">{inv.customerName}</p>
                        <p className="text-[10px] text-slate-400">{inv.contactNo}</p>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">#{inv.invoiceNumber}</td>
                      <td className="p-4 font-black text-sm text-slate-700">Rs. {inv.balanceAmount}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${inv.balanceAmount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {inv.balanceAmount > 0 ? 'Pending' : 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!invoices?.length && (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-slate-400 text-sm">No recent invoices found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;