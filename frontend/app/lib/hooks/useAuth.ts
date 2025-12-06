/**
 * Temporary authentication hook
 * Used to manage admin authentication until the auth service is integrated
 * 
 * TODO: Replace with real authentication when auth-service is ready
 */

import { useState, useEffect } from 'react';

const ADMIN_ID_KEY = 'shopifake_temp_admin_id';
const USER_KEY = 'shopifake_user';

export interface TempAuthUser {
  adminId: number;
  isAuthenticated: boolean;
}

/**
 * Hook to manage temporary authentication via admin_id
 */
export function useAuth() {
  const [authUser, setAuthUser] = useState<TempAuthUser | null>(null);

  useEffect(() => {
    const storedAdminId = localStorage.getItem(ADMIN_ID_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedAdminId && storedUser) {
      setAuthUser({
        adminId: parseInt(storedAdminId, 10),
        isAuthenticated: true,
      });
    }
  }, []);

  /**
   * Login with admin ID (temporary solution)
   */
  const login = (adminId: number) => {
    localStorage.setItem(ADMIN_ID_KEY, adminId.toString());
    localStorage.setItem(USER_KEY, JSON.stringify({ adminId }));
    
    setAuthUser({
      adminId,
      isAuthenticated: true,
    });
  };

  /**
   * Logout and clear stored data
   */
  const logout = () => {
    localStorage.removeItem(ADMIN_ID_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthUser(null);
  };

  /**
   * Get the current admin ID
   */
  const getAdminId = (): number | null => {
    return authUser?.adminId ?? null;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = (): boolean => {
    return authUser?.isAuthenticated ?? false;
  };

  return {
    authUser,
    login,
    logout,
    getAdminId,
    isAuthenticated,
  };
}
