// pages/SolicitationsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenHandler } from "../api/auth/tokenHandlers";
import { TenantStorage } from "../api/state/tenantStorage";
import { Schedule } from "../types/schedule";
import { Evento } from "../types/Evento";
import { TenantHeader } from "./TenantHeader";

export default function SolicitationsPage() {
  const [solicitacoes, setSolicitacoes] = useState<Evento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenHandler.getInstance().getToken();
    if (!token) {
      navigate("/");
      return;
    }

    const fetchSolicitacoes = async () => {
      const tenantId = TenantStorage.getInstance().getTenant().id;
      const url = `http://localhost:5175/api/${tenantId}/solicitations`;

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar solicitações");

        const data = await res.json();

        const eventosFormatados: Evento[] = data.map((evento: Schedule) => ({
          id: evento.id,
          title: evento.procedure,
          date: new Date(evento.date).toISOString().split("T")[0],
          time: evento.time,
          status: evento.status,
          user: evento.user,
        }));

        const pendentes = eventosFormatados.filter((e) => e.status === 0);
        setSolicitacoes(pendentes);
      } catch (err) {
        console.log("Erro ao buscar solicitações:", err);
      }
    };

    fetchSolicitacoes();
  }, [navigate]);

  const atualizarStatus = async (id: string, novoStatus: "CONFIRMED" | "CANCELED") => {
    const token = TokenHandler.getInstance().getToken();
    const tenantId = TenantStorage.getInstance().getTenant().id;
    const url = `http://localhost:5175/api/${tenantId}/solicitations?status=${novoStatus}&scheduleId=${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.log("Erro ao atualizar status da solicitação:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TenantHeader />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">Solicitações Pendentes</h1>

        {solicitacoes.length === 0 ? (
          <p className="text-gray-500 italic">Nenhuma solicitação pendente.</p>
        ) : (
          <ul className="space-y-4">
            {solicitacoes.map((evento) => (
              <li
                key={evento.id}
                className="bg-white shadow p-4 rounded-lg border space-y-2"
              >
                <div>
                  <p className="text-lg font-semibold text-purple-700">{evento.title}</p>
                  <p className="text-sm text-gray-600">📅 Data: {evento.date}</p>
                  <p className="text-sm text-gray-600">🕒 Horário: {evento.time.slice(0, 5)}</p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>👤 {evento.user.name}</p>
                    <p>📧 {evento.user.email}</p>
                    <p>📞 {evento.user.phone}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => atualizarStatus(evento.id, "CONFIRMED")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => atualizarStatus(evento.id, "CANCELED")}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Negar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
