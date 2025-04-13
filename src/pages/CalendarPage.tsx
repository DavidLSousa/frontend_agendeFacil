import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/calendar-style.css";
import { useNavigate } from "react-router-dom";
import { TokenHandler } from "../api/auth/tokenHandlers";
import { TenantStorage } from "../api/state/tenantStorage";
import { Schedule } from "../types/Schedule";
import { Evento } from "../types/Evento";
import { TenantHeader } from "./TenantHeader";

export default function CalendarPage() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenHandler.getInstance().getToken();
    if (!token) {
      navigate("/");
      return;
    }

    const fetchEvents = async () => {
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

        if (res.status === 401) {
          TokenHandler.getInstance().clearToken();
          navigate("/");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();

        const formattedEvents: Evento[] = data.map((event: Schedule) => ({
          id: event.id,
          title: event.procedure,
          date: new Date(event.date).toISOString().split("T")[0],
          time: event.time,
          status: event.status,
          user: event.user,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.log("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [navigate]);

  const updateEventStatus = async (id: string, newStatus: number) => {
    const token = TokenHandler.getInstance().getToken();
    const tenantId = TenantStorage.getInstance().getTenant().id;
    const url = `http://localhost:5175/api/${tenantId}/solicitations?status=${newStatus}&scheduleId=${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to update status");

      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.log("Error updating event status:", err);
    }
  };


  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const formattedDay = date.toISOString().split("T")[0];
      const hasEvent = events.some((event) => event.date === formattedDay);

      if (hasEvent) {
        return (
          <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1" />
        );
      }
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Pendente";
      case 1:
        return "Confirmado";
      case 2:
        return "Cancelado";
      case 3:
        return "Feito";
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
                onClickDay={(value) => setSelectedDate(value)}
                className="w-full h-full text-base sm:text-xl [&_.react-calendar]:w-full [&_.react-calendar]:h-full"
              />
            </div>
          </div>
        </div>

        {selectedDate && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setSelectedDate(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {formatDate(selectedDate)}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Fechar
                </button>
              </div>

              <div className="border-t pt-4">
                {(() => {
                  const selectedDay =
                    selectedDate.toISOString().split("T")[0];
                  const eventsOfTheDay = events.filter(
                    (event) => event.date === selectedDay
                  );

                  if (eventsOfTheDay.length === 0) {
                    return (
                      <p className="text-gray-500 text-sm italic">
                        Nenhum evento encontrado.
                      </p>
                    );
                  }

                  return (
                    <ul className="space-y-4">
                      {eventsOfTheDay.map((event) => (
                        <li
                          key={event.id}
                          className="border rounded p-3 bg-gray-50 shadow-sm"
                        >
                          <p className="font-semibold text-purple-700">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            🕒 Time: {event.time.slice(0, 5)}
                          </p>
                          <p className="text-sm text-gray-600">
                            📋 Status: {formatStatus(event.status)}
                          </p>
                          <p className="text-sm mt-2 text-gray-800">
                            👤 Patient: {event.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            📧 {event.user.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 {event.user.phone}
                          </p>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() =>
                                updateEventStatus(event.id, 3)
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Concluído
                            </button>
                            <button
                              onClick={() => updateEventStatus(event.id, 0)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Pendente
                            </button>
                            <button
                              onClick={() =>
                                updateEventStatus(event.id, 2)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Cancelado
                            </button>
                          </div>
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
