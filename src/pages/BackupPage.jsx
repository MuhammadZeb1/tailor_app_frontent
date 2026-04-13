import React, { useState } from "react";
import API from "../app/api";

const BackupPage = () => {
  const [message, setMessage] = useState("");

  const handleBackup = async () => {
    setMessage("Processing backup...");
    try {
      const res = await API.get("/api/sync-backup");
      if (res.data.success) {
        setMessage("Backup synced successfully ✅");
      } else {
        setMessage("No backup found in D ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error syncing backup ❌");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      
      {/* Card */}
      <div className="w-full max-w-md backdrop-blur-xl border  rounded-3xl shadow-2xl p-8 text-center">
        
        {/* Title */}
        <h1 className="text-2xl font-black  tracking-wide mb-2">
          Backup Center
        </h1>
        <p className=" text-sm mb-6">
          Secure your invoice data instantly
        </p>

        {/* Button */}
        <button
          onClick={handleBackup}
          className="w-full py-3 rounded-xl  text-black font-bold tracking-wide border-2 k hover: transition-all shadow-lg hover:scale-[1.02] active:scale-95"
        >
          Sync Backup D → C
        </button>

        {/* Status Message */}
        {message && (
          <div className="mt-6 p-3 rounded-xl b border-white/20 text-sm font-medium animate-fade-in">
            {message}
          </div>
        )}

        {/* Extra subtle info */}
        <p className="mt-6 text-xs ">
          Make sure your backup drive (D:) is connected
        </p>
      </div>
    </div>
  );
};

export default BackupPage;
