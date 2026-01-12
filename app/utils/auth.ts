/**
 * Authentication utility functions
 */
export interface User {
  id: string;
  email: string;
  verified: boolean;
}

/**
 * Get the current authenticated user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;

    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Check if user is authenticated and verified
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return user !== null && user.verified === true;
}

/**
 * Check if user exists but is not verified
 */
export function isPendingVerification(): boolean {
  const user = getCurrentUser();
  return user !== null && user.verified === false;
}

/**
 * Logout user and clear all auth data
 */
export function logout(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("currentUser");
  localStorage.removeItem("pendingVerification");

  // Redirect to signup page
  window.location.href = "/signup";
}

/**
 * Get user's email (if authenticated)
 */
export function getUserEmail(): string | null {
  const user = getCurrentUser();
  return user?.email || null;
}

/**
 * Save user session after successful verification
 */
export function saveUserSession(user: User): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.removeItem("pendingVerification");
}

/**
 * Require authentication - use in components/pages that need auth
 * Returns user or redirects to appropriate page
 */
export function requireAuth(): User | null {
  if (typeof window === "undefined") return null;

  const user = getCurrentUser();

  if (!user) {
    // Not logged in at all
    window.location.href = "/signup";
    return null;
  }

  if (!user.verified) {
    // Logged in but not verified
    window.location.href = `/verify-email?email=${encodeURIComponent(
      user.email
    )}`;
    return null;
  }

  return user;
}
