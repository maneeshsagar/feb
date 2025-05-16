// /app/core/dashboard/page.jsx
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth, signOut } from "@/lib/firebase"; //
import { onAuthStateChanged } from "firebase/auth";
import { FiMenu } from "react-icons/fi";

// Import Components
import Sidebar from "@app/core/dashboard/components/Sidebar"; //
import MobileNav from "@app/core/dashboard/components/MobileNav"; //
import MobileSidebar from "@app/core/dashboard/components/MobileSidebar"; //
import DashboardHeader from "@app/core/dashboard/components/DashboardHeader"; //
import DashboardContent from "@app/core/dashboard/components/DashboardContent"; //
import TemplateList from "@app/core/dashboard/components/TemplateList"; //
import ProfileEditor from "@app/core/dashboard/components/ProfileEditor"; //

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // Default tab
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Renamed for clarity
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state

  // Authentication Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/core/login");
      } else {
        setUser(currentUser);
        setLoading(false); // Set loading to false once user is confirmed
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Logout Handler
  const handleLogout = async () => {
    setLoading(true); // Indicate processing
    const idToken = Cookies.get("idToken"); // Get token *before* signing out or clearing

    try {
      // 1. Sign out from Firebase client-side
      await signOut(auth); //
      console.log("Successfully signed out from Firebase client.");

      // 2. Call the backend logout API (Optional: pass token if needed)
      try {
         // Use fetch or axios
         const backendLogoutResponse = await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Include Authorization header ONLY if your backend requires it
              // AND can verify it even after client logout (e.g., short grace period)
              // Otherwise, your backend might just clear session based on cookies/other identifiers
              ...(idToken && { Authorization: `Bearer ${idToken}` }),
            },
            // body: JSON.stringify({}), // Include body if needed by backend
         });

         if (!backendLogoutResponse.ok) {
             // Log backend logout failure but proceed with frontend logout
             console.warn(`Backend logout failed: ${backendLogoutResponse.status} ${backendLogoutResponse.statusText}`);
             const errorData = await backendLogoutResponse.text(); // Read error body if available
             console.warn("Backend error details:", errorData);
         } else {
             console.log("Successfully called backend logout API.");
         }
      } catch (backendError) {
           // Log backend API call error but proceed with frontend logout
          console.error("Error calling backend logout API:", backendError);
      }


      // 3. Remove local tokens/cookies
      Cookies.remove("idToken");
      Cookies.remove("refreshToken");
      console.log("Cleared local cookies.");

      // 4. Redirect to login page
      router.push("/core/login");

    } catch (error) {
      console.error("Firebase sign-out failed:", error);
      // Handle Firebase sign-out error (e.g., show message to user)
      // Still attempt to clear cookies and redirect
      Cookies.remove("idToken");
      Cookies.remove("refreshToken");
      router.push("/core/login"); // Redirect even if signout had client error
    } finally {
        // setLoading(false); // Removed setLoading(false) here as router.push navigates away
    }
  };

  // Toggle Mobile Sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
           {/* Optional: Add a better spinner */}
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
           <p className="text-lg text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Mobile Sidebar (Conditional Render) */}
      {isMobileSidebarOpen && (
        <MobileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          closeSidebar={() => setIsMobileSidebarOpen(false)}
          user={user} // Pass user data if needed in mobile sidebar
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          user={user}
          activeTab={activeTab}
          handleLogout={handleLogout}
          toggleMobileSidebar={toggleMobileSidebar} // Pass toggle function
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Content based on activeTab */}
          {activeTab === "dashboard" && <DashboardContent user={user} />}
          {activeTab === "profile" && <ProfileEditor user={user} />}
          {activeTab === "templates" && <TemplateList />}
        </main>
      </div>

      {/* Mobile Bottom Navigation (appears below content on mobile) */}
      <div className="md:hidden sticky bottom-0 z-10">
           <MobileNav
             activeTab={activeTab}
             setActiveTab={setActiveTab}
             handleLogout={handleLogout} // Keep logout here for easy access if needed
           />
         </div>

    </div>
  );
}