import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/calendar-style.css";
import { TokenHandler } from "../api/auth/tokenHandlers";
import { TenantStorage } from "../api/state/tenantStorage";
import { Schedule } from "../types/schedule";

type Evento = {
  date: string;
  title: string;
};

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

      const tenantId = TenantStorage.getInstance().getTenantId();
      console.log("tenantId", tenantId)
      const url = `http://localhost:5175/api/${tenantId}/schedule`;

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${TokenHandler.getInstance().getToken()}`,
            "Content-Type": "application/json",
          }
        });

        if (!res.ok) throw new Error("Erro ao buscar eventos");

        const data = await res.json();

        console.log(data)

        const eventosFormatados: Evento[] = data.map((evento: Schedule) => ({
          date: evento.date,
          title: evento.procedure,
        }));

        setEventos(eventosFormatados);

      } catch (err) {
        console.log("Erro ao buscar eventos:", err);
      }
      // const data: Evento[] = [
      //   { date: "2025-05-03", title: "Consulta com João" },
      //   { date: "2025-05-07", title: "Retorno com Maria" },
      // ];
    };

    fetchEventos();
  }, [navigate]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const diaFormatado = date.toISOString().split("T")[0];
      const temEvento = eventos.some((evento) => evento.date === diaFormatado);

      if (temEvento) {
        return <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1" />;
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

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4 relative">
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
              <p className="text-gray-500 text-sm italic">Carregando dados do dia...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
