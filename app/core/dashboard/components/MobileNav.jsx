import React from 'react';
import { FiHome, FiUser, FiUsers, FiLogOut } from "react-icons/fi";

export default function MobileNav({ activeTab, setActiveTab, handleLogout }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 flex">
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex-1 py-2 flex flex-col items-center ${
          activeTab === "dashboard"
            ? "text-indigo-600 border-t-2 border-indigo-600"
            : "text-gray-600"
        }`}
      >
        <FiHome size={20} />
        <span className="text-xs">Home</span>
      </button>
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex-1 py-2 flex flex-col items-center ${
          activeTab === "profile"
            ? "text-indigo-600 border-t-2 border-indigo-600"
            : "text-gray-600"
        }`}
      >
        <FiUser size={20} />
        <span className="text-xs">Profile</span>
      </button>
      <button
        onClick={() => setActiveTab("templates")}
        className={`flex-1 py-2 flex flex-col items-center ${
          activeTab === "templates"
            ? "text-indigo-600 border-t-2 border-indigo-600"
            : "text-gray-600"
        }`}
      >
        <FiUsers size={20} />
        <span className="text-xs">Templates</span>
      </button>
      <button
        onClick={handleLogout}
        className="flex-1 py-2 flex flex-col items-center text-red-500"
      >
        <FiLogOut size={20} />
        <span className="text-xs">Logout</span>
      </button>
    </nav>
  );
}
