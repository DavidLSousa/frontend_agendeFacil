import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import LoginForm from "../components/LoginForm";
import RequestForm from "../components/RequestForm";
import { Tenant } from "../api/interfaces/ITenant";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useAuthRedirect();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch("http://localhost:5175/api/user/tenants");
        const data = await res.json();
        setTenants(data);
      } catch (err) {
        console.error("Erro ao buscar tenants:", err);
      }
    };
    fetchTenants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow">
        <h1 className="text-2xl font-bold text-purple-600">Agenda Fácil</h1>
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-200"
        >
          Entrar
        </button>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 mt-4">
        <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Solicitar atendimento
          </h2>
          <RequestForm tenants={tenants} />
        </div>
      </section>

      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.
      </footer>

      {showLogin && (
        <Modal onClose={() => setShowLogin(false)} title="Entrar">
          <LoginForm onClose={() => setShowLogin(false)} />
        </Modal>
      )}
    </div>
  );
}
