import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { TokenHandler } from "../api/auth/tokenHandlers";
import { TenantStorage } from "../api/state/tenantStorage";

export function TenantHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tenantName, setTenantName] = useState("");

  useEffect(() => {
    const nome = TenantStorage.getInstance().getTenant()?.name || "Profissional";
    setTenantName(nome);
  }, []);

  const handleLogout = () => {
    TokenHandler.getInstance().clearToken();
    window.location.reload();
  };

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-purple-700">
        {tenantName}
      </h1>
      <nav className="space-x-4">
        {location.pathname !== "/agenda" && (
          <button
            onClick={() => navigate("/agenda")}
            className="text-purple-600 hover:underline"
          >
            Agenda
          </button>
        )}
        {location.pathname !== "/solicitacoes" && (
          <button
            onClick={() => navigate("/solicitacoes")}
            className="text-purple-600 hover:underline"
          >
            Solicitações
          </button>
        )}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
