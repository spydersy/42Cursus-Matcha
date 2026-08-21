import { useAuthContext } from "../context/AuthContext";

/**
 * Hook to access the current authentication state and actions.
 */
export function useAuth() {
  return useAuthContext();
}
