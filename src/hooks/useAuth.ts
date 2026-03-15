import { useContext } from "react";
import { AuthContext, AuthContextType } from '@/store/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
