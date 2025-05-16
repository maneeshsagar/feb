// import React from 'react';

// export default function ProfileCard({ user }) {
//   return (
//     <div className="text-center">
//       <img
//         src={user?.photoURL || "/default-avatar.png"}
//         alt="Profile"
//         className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
//       />
//       <h2 className="text-2xl font-bold mb-1">{user?.displayName || "John Doe"}</h2>
//       <p className="text-lg text-gray-600 mb-1">{user?.email || "john@example.com"}</p>
//       <p className="text-md text-gray-500">{user?.role || "Designer"}</p>
//     </div>
//   );
// }

import React from 'react';

export default function ProfileCard({ user }) {
  return (
    <div className="text-center">
      <img
        src={user?.photoURL || "/default-avatar.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold mb-1 whitespace-normal break-words">
        {user?.displayName || "John Doe"}
      </h2>
      <p className="text-lg text-gray-600 mb-1 whitespace-normal break-words">
        {user?.email || "john@example.com"}
      </p>
      <p className="text-md text-gray-500 whitespace-normal break-words">
        {user?.role || "Designer"}
      </p>
    </div>
  );
}


