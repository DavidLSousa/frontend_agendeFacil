import { useState, useRef } from "react";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow">
        <h1 className="text-2xl font-bold text-purple-600">Agenda Fácil</h1>
        <div>
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sua agenda online personalizada
          </h2>
          <p className="text-gray-700 text-lg">
            Crie sua página exclusiva, receba solicitações de atendimento e gerencie seus horários com facilidade.
          </p>
          {/* Lista de prestadores de serviços */}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.
      </footer>

      {/* Modal de Login */}
      {showLogin && (
        <Modal onClose={() => setShowLogin(false)} title="Entrar">
          <form className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
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

// Modal Component
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
