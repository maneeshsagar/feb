// /app/core/dashboard/components/Sidebar.jsx
import React from 'react';
import { FiHome, FiUser, FiClipboard, FiLogOut } from 'react-icons/fi'; // Changed FiUsers to FiClipboard for Templates
import Link from 'next/link';

export default function Sidebar({ activeTab, setActiveTab }) { // Removed user and handleLogout props

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'templates', label: 'Templates', icon: FiClipboard }, // Updated icon
  ];

  return (
    // Sticky sidebar for desktop
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 flex-shrink-0 hidden md:block">
      <div className="h-full flex flex-col">
        {/* Logo/Brand Area */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <Link href="/" className="text-xl font-bold text-white">
            ProfileGen {/* Or your App Name */}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition duration-150 ease-in-out ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-inner' // Active state style
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive state style
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Optional: Footer or extra links can go here */}
        {/* Removed Logout button from here */}
      </div>
    </aside>
  );
}