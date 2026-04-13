import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../assets/edit.png";

const Navbar = () => {
  // Styles for the navigation links
  const getLinkStyle = (isActive) => 
    `px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-black transition-all duration-300 ${
      isActive 
        ? "bg-amber-500/10 text-amber-500 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)] border border-amber-500/20" 
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <nav className="bg-slate-900 border-b-2 border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO SECTION */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            {/* Soft Glow behind logo */}
            <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={logo} 
              alt="Tailor" 
              className="relative h-12 w-12 object-contain rounded-xl border-2 border-slate-700 bg-slate-900 p-1.5 group-hover:border-amber-500 transition-colors shadow-xl"
            />
          </div>

          <div className="leading-tight">
            <h1 className="text-white font-black text-xl tracking-[4px] flex items-center gap-2">
              POPULAR
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse"></span>
            </h1>
            <p className="text-[9px] text-amber-500/80 uppercase tracking-[4px] font-black">
              fabrics & tailoring
            </p>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-3">
          <NavLink to="/" className={({ isActive }) => getLinkStyle(isActive)}>
            Home
          </NavLink>

          <NavLink to="/invoices" className={({ isActive }) => getLinkStyle(isActive)}>
            History
          </NavLink>

          

          {/* DIVIDER */}
          <div className="h-5 w-[1px] bg-slate-800 mx-2"></div>

          {/* CREATE INVOICE CTA */}
          <NavLink
            to="/create-invoice"
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95"
          >
            + New Invoice
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;