// /app/core/dashboard/components/DashboardHeader.jsx
'use client'; // Add this if you use hooks like useState
import React, { useState } from 'react';
import { FiBell, FiUser, FiLogOut, FiChevronDown, FiMenu } from 'react-icons/fi';
import Link from 'next/link'; // Import Link

export default function DashboardHeader({ user, activeTab, handleLogout, toggleMobileSidebar }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Function to get the display title based on activeTab
  const getTitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'Edit Profile';
      case 'templates':
        return 'Templates';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    // Removed 'fixed' class for potentially integrating with main layout scroll
    <header className="bg-white shadow-sm border-b border-gray-200 w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Mobile Menu Toggle and Page Title */}
          <div className="flex items-center">
             {/* Mobile Menu Button */}
             <button
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-2"
                aria-label="Open sidebar"
              >
                <FiMenu size={24} />
              </button>
            <h1 className="text-xl font-semibold text-gray-800">{getTitle()}</h1>
          </div>

          {/* Right side: Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View notifications</span>
              <FiBell size={22} />
            </button>

            {/* Separator */}
            <div className="hidden md:block h-6 w-px bg-gray-200" aria-hidden="true" />

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                 <img
                    className="h-8 w-8 rounded-full object-cover bg-gray-200"
                    src={user?.photoURL || "/default-avatar.png"} // Use default avatar
                    alt={user?.displayName || "User Avatar"}
                  />
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user?.displayName || user?.email || "User"}
                </span>
                <FiChevronDown
                  size={16}
                  className={`hidden md:inline text-gray-400 transition-transform duration-200 ${
                    isUserMenuOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              {isUserMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link href="/core/dashboard" // Or the specific profile view/edit page
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    tabIndex="-1"
                  >
                     <FiUser className="mr-2" size={16}/>
                     Your Profile {/* Link text updated */}
                  </Link>
                  <button
                    onClick={() => {
                       setIsUserMenuOpen(false);
                       handleLogout();
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    role="menuitem"
                    tabIndex="-1"
                  >
                     <FiLogOut className="mr-2" size={16}/>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}