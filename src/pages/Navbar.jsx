import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  // Common styles for the links
  const baseLinkStyle = "px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium";
  const activeLinkStyle = "bg-blue-600 text-white shadow-md";
  const inactiveLinkStyle = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TailorStream</span>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${baseLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
            }
          >
            Home
          </NavLink>

          <NavLink 
            to="/invoices" 
            className={({ isActive }) => 
              `${baseLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
            }
          >
            Invoice History
          </NavLink>
          <NavLink 
            to="/create-invoice" 
            className={({ isActive }) => 
              `${baseLinkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`
            }
          >
            Create Invoice
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;