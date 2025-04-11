import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenHandler } from "../api/auth/tokenHandlers";

export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenHandler.getInstance().getToken();
    if (token) {
      navigate("/agenda");
    }
  }, [navigate]);
}
