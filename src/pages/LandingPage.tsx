import { useState, useEffect, useRef } from "react";
import { submitLogin } from "../api/auth/login";
import { submitSolicitacao } from "../api/forms";

interface Tenant {
  id: string;
  name: string;
  procedures: string[];
}

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");

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

  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      Date: formData.get("date") as string,
      Time: formData.get("time") as string,
      Procedure: formData.get("procedure") as string,
      ProfissionalId: formData.get("tenant") as string,
      User: {
        Name: formData.get("name") as string,
        Email: formData.get("email") as string,
        Phone: formData.get("phone") as string,
      },
    };

    try {
      await submitSolicitacao(data);
      form.reset();
      setSelectedTenantId(""); // limpar tenant selecionado após envio
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      Email: formData.get("email") as string,
      Password: formData.get("password") as string,
    };

    try {
      await submitLogin(data);
      setShowLogin(false);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

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

      <section className="flex-1 flex items-center justify-center text-center px-4 mt-4">
        <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-4 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Solicitar atendimento
          </h2>

          <form className="space-y-4" onSubmit={handleSubmitRequest}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selecione o profissional
              </label>
              <select
                name="tenant"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Celular
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data do atendimento
              </label>
              <input
                name="date"
                type="date"
                required
                min={getTodayDate()}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora do atendimento
              </label>
              <select
                name="time"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
              >
                {generateTimeSlots().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Horário comercial: 08:00–11:00 e 13:00–18:00 (intervalo de 30 min)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Procedimento
              </label>
              <select
                name="procedure"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Selecione...</option>
                {selectedTenant?.procedures?.map((proc) => (
                  <option key={proc} value={proc}>
                    {proc}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Enviar solicitação
            </button>
          </form>
        </div>
      </section>

      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.
      </footer>

      {showLogin && (
        <Modal onClose={() => setShowLogin(false)} title="Entrar">
          <form className="space-y-4" onSubmit={handleSubmitLogin}>
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Entrar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ title, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function getTodayDate(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split("T")[0];
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const addSlots = (start: number, end: number) => {
    for (let h = start; h < end; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
  };
  addSlots(8, 11);
  addSlots(13, 18);
  return slots;
}
