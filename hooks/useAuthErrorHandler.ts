import { useAppStore } from "@/store";
import { useEffect } from "react";

export function useAuthErrorHandler() {
  const clearAuth = useAppStore((state) => state.clearAuth);

  useEffect(() => {
    // Listen for unhandled promise rejections with auth errors
    const originalHandler = ErrorUtils.getGlobalHandler?.();

    ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (error?.isAuthError) {
        clearAuth();
      }
      // Call original handler if it exists
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });

    return () => {
      // Restore original handler on cleanup
      if (originalHandler) {
        ErrorUtils.setGlobalHandler(originalHandler);
      }
    };
  }, [clearAuth]);
}
