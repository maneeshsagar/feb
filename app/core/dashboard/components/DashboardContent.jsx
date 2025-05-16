// /app/core/dashboard/components/DashboardContent.jsx
import React from 'react';
import { FiUsers, FiActivity, FiCheckCircle, FiEdit, FiEye } from "react-icons/fi"; // Added icons

export default function DashboardContent({ user }) {
  // Dummy data for cards - replace with actual data fetching later
  const stats = [
      { label: 'Active Users', value: '2,453', icon: FiUsers, color: 'blue' },
      { label: 'Total Sessions', value: '12,789', icon: FiActivity, color: 'green' },
      { label: 'Tasks Completed', value: '89%', icon: FiCheckCircle, color: 'purple' },
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'blue': return 'text-blue-500 bg-blue-100';
      case 'green': return 'text-green-500 bg-green-100';
      case 'purple': return 'text-purple-500 bg-purple-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };


  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-6 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user?.displayName || user?.email || "User"}!
        </h1>
        <p className="text-indigo-100">Here's what's happening with your profile today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
              <div className={`p-3 rounded-full ${getIconColor(stat.color)}`}>
                 <stat.icon size={24} />
              </div>
              <div>
                 <p className="text-sm text-gray-500">{stat.label}</p>
                 <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
          </div>
        ))}
      </div>

       {/* Quick Actions / Recent Activity Section (Example) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Quick Actions Card */}
           <div className="p-6 bg-white rounded-lg shadow-md">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
             <div className="space-y-3">
               <button className="flex items-center text-indigo-600 hover:text-indigo-800 w-full text-left p-2 rounded hover:bg-indigo-50">
                 <FiEdit size={18} className="mr-3"/>
                 Edit Your Profile
               </button>
               <button className="flex items-center text-indigo-600 hover:text-indigo-800 w-full text-left p-2 rounded hover:bg-indigo-50">
                 <FiEye size={18} className="mr-3"/>
                 View Your Public Profile
               </button>
                {/* Add more relevant actions */}
             </div>
           </div>

            {/* Recent Activity Card (Placeholder) */}
           <div className="p-6 bg-white rounded-lg shadow-md">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
             <ul className="space-y-3 text-sm text-gray-600">
               <li>Profile updated - 2 hours ago</li>
               <li>New template viewed - 1 day ago</li>
               <li>Session started - 1 day ago</li>
               {/* Fetch and display actual recent activity */}
             </ul>
             <a href="#" className="text-sm text-indigo-600 hover:underline mt-3 inline-block">View all activity</a>
           </div>
       </div>

    </div>
  );
}