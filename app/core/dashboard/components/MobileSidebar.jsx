// /app/core/dashboard/components/MobileSidebar.jsx
import React from 'react';
import { FiHome, FiUser, FiClipboard, FiLogOut, FiX } from "react-icons/fi"; // Adjusted icons
import Link from 'next/link';

// Pass user prop if you need to display user info here too
export default function MobileSidebar({ activeTab, setActiveTab, handleLogout, closeSidebar, user }) {

  const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FiHome },
      { id: 'profile', label: 'Profile', icon: FiUser },
      { id: 'templates', label: 'Templates', icon: FiClipboard },
  ];

  return (
    // Overlay
    <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-linear"
        aria-hidden="true"
        onClick={closeSidebar} // Close on overlay click
      ></div>

      {/* Sidebar Panel */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 shadow-lg transform transition-transform duration-300 ease-in-out"
             // Add state-based transform: className={`... ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
             // Handle open/close state in the parent component (/app/core/dashboard/page.jsx)
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
             ProfileGen {/* Or your App Name */}
          </Link>
          <button onClick={closeSidebar} className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        {/* Optional: User Info at the top */}
        {user && (
            <div className="p-4 border-b border-gray-700 text-center">
                 <img
                    className="h-16 w-16 rounded-full object-cover mx-auto mb-2 bg-gray-600"
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                  />
                  <p className="text-sm font-medium text-white truncate">{user.displayName || user.email}</p>
            </div>
        )}


        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  closeSidebar(); // Close sidebar on navigation
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition duration-150 ease-in-out ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </button>
          ))}
          {/* Logout Button */}
           <button
            onClick={() => {
              closeSidebar();
              handleLogout();
            }}
            className="flex items-center w-full px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-900 hover:text-red-200 transition duration-150 ease-in-out mt-4" // Added margin top
           >
            <FiLogOut size={20} className="mr-3" />
            Logout
          </button>
        </nav>

      </aside>
    </div>
  );
}