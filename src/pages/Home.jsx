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
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
  <div className="max-w-7xl mx-auto space-y-8">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
        POPULAR fabrices & tailoring
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your tailoring business efficiently
        </p>
      </div>

      <button
        onClick={() => navigate("/create-invoice")}
        className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
      >
        + New Invoice
      </button>
    </div>

    {/* STATS ROW */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className={`${stat.bg} ${stat.color} p-3 rounded-lg text-lg`}>
            <stat.icon />
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-400 font-bold">
              {stat.label}
            </p>
            <h3 className="text-lg font-black text-slate-900">
              {loading ? "..." : stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT PANEL */}
      <div className="space-y-6">

        {/* ACTION CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/create-invoice")}
              className="w-full flex justify-between items-center bg-slate-900 text-white p-4 rounded-lg"
            >
              New Invoice <FaPlus />
            </button>

            <button
              onClick={() => navigate("/invoices")}
              className="w-full flex justify-between items-center border border-slate-300 p-4 rounded-lg"
            >
              View All <FaHistory />
            </button>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase mb-3">
            Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span className="font-bold">{totalInvoices}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span className="font-bold text-emerald-600">
                {completedInvoicesCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="font-bold text-amber-600">
                {pendingInvoices.length}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-2">

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-700">
              Recent Invoices
            </h2>

            <button
              onClick={() => navigate("/invoices")}
              className="text-xs text-slate-500 hover:text-black flex items-center gap-1"
            >
              View All <FaArrowRight />
            </button>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400 uppercase">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Invoice</th>
                <th className="p-3 text-left">Balance</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {invoices?.slice(0, 5).map((inv) => (
                <tr
                  key={inv._id}
                  onClick={() => navigate("/invoices")}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="p-3">
                    <p className="font-bold">{inv.customerName}</p>
                    <p className="text-xs text-slate-400">
                      {inv.contactNo}
                    </p>
                  </td>

                  <td className="p-3 text-xs font-mono">
                    #{inv.invoiceNumber}
                  </td>

                  <td className="p-3 font-bold">
                    Rs. {inv.balanceAmount}
                  </td>

                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        inv.balanceAmount > 0
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {inv.balanceAmount > 0 ? "Pending" : "Paid"}
                    </span>
                  </td>
                </tr>
              ))}

              {!invoices?.length && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-slate-400">
                    No data available
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

  );
};

export default Home;