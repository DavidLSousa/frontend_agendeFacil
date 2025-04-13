import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/calendar-style.css";
import { useNavigate } from "react-router-dom";
import { TokenHandler } from "../api/auth/tokenHandlers";
import { TenantStorage } from "../api/state/tenantStorage";
import { Schedule } from "../types/schedule";
import { Evento } from "../types/Evento";
import { TenantHeader } from "./TenantHeader";

export default function CalendarPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenHandler.getInstance().getToken();
    if (!token) {
      navigate("/");
      return;
    }

    const fetchEventos = async () => {
      const tenantId = TenantStorage.getInstance().getTenant().id;
      const url = `http://localhost:5175/api/${tenantId}/schedule`;

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar eventos");

        const data = await res.json();

        const eventosFormatados: Evento[] = data.map((evento: Schedule) => ({
          id: evento.id,
          title: evento.procedure,
          date: new Date(evento.date).toISOString().split("T")[0],
          time: evento.time,
          status: evento.status,
          user: evento.user,
        }));

        setEventos(eventosFormatados);
      } catch (err) {
        console.log("Erro ao buscar eventos:", err);
      }
    };

    fetchEventos();
  }, [navigate]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const diaFormatado = date.toISOString().split("T")[0];
      const temEvento = eventos.some((evento) => evento.date === diaFormatado);

      if (temEvento) {
        return (
          <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1" />
        );
      }
    }
    return null;
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatarStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Pendente";
      case 1:
        return "Confirmado";
      case 2:
        return "Cancelado";
      case 3:
        return "Concluído";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TenantHeader />

      <div className="flex-grow flex items-center justify-center p-4 relative">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] flex items-center justify-center">
          <div className="w-full h-full flex">
            <div className="flex-grow">
              <Calendar
                tileContent={tileContent}
                locale="pt-BR"
                onClickDay={(value) => setDataSelecionada(value)}
                className="w-full h-full text-base sm:text-xl [&_.react-calendar]:w-full [&_.react-calendar]:h-full"
              />
            </div>
          </div>
        </div>

        {dataSelecionada && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setDataSelecionada(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {formatarData(dataSelecionada)}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-sm"
                  onClick={() => setDataSelecionada(null)}
                >
                  Fechar
                </button>
              </div>

              <div className="border-t pt-4">
                {(() => {
                  const diaSelecionado =
                    dataSelecionada.toISOString().split("T")[0];
                  const eventosDoDia = eventos.filter(
                    (evento) => evento.date === diaSelecionado
                  );

                  if (eventosDoDia.length === 0) {
                    return (
                      <p className="text-gray-500 text-sm italic">
                        Nenhum evento encontrado.
                      </p>
                    );
                  }

                  return (
                    <ul className="space-y-2">
                      {eventosDoDia.map((evento, index) => (
                        <li
                          key={index}
                          className="border rounded p-3 bg-gray-50 shadow-sm"
                        >
                          <p className="font-semibold text-purple-700">
                            {evento.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            🕒 Horário: {evento.time.slice(0, 5)}
                          </p>
                          <p className="text-sm text-gray-600">
                            📋 Status: {formatarStatus(evento.status)}
                          </p>
                          <p className="text-sm mt-2 text-gray-800">
                            👤 Paciente: {evento.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            📧 {evento.user.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {evento.user.phone}
                          </p>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
