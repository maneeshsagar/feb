import { auth } from "@/lib/firebase";
import Cookies from "js-cookie";

/**
 * Refreshes Firebase ID token using the refresh token.
 * Automatically updates cookies.
 */
export const refreshToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No authenticated user found!");
    return null;
  }

  try {
    const newIdToken = await user.getIdToken(true); // Force refresh token
    Cookies.set("idToken", newIdToken, { secure: true, httpOnly: false });

    console.log("✅ ID Token refreshed successfully!");
    return newIdToken;
  } catch (error) {
    console.error("❌ Failed to refresh token:", error);
    return null;
  }
};
