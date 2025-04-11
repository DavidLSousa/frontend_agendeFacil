import { useState } from "react";
import { submitSolicitacao } from "../api/forms";
import { Tenant } from "../api/interfaces/ITenant";
import { TenantState } from "../api/state/tenantState";
import { generateTimeSlots, getTodayDate } from "../utils/dateUtils";

type Props = {
  tenants: Tenant[];
};

export default function RequestForm({ tenants }: Props) {
  const [selectedTenantId, setSelectedTenantId] = useState<string>("");

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
      setSelectedTenantId("");
    } catch (err) {
      console.log(err);
    }
  };

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);

  return (
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
          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedTenantId(selectedId);
            TenantState.getInstance().setTenantId(selectedId);
          }}
        >
          <option value="">Selecione...</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.name}
            </option>
          ))}
        </select>
      </div>

      <input name="name" type="text" placeholder="Nome" required className="w-full px-4 py-2 border border-gray-300 rounded" />
      <input name="email" type="email" placeholder="E-mail" required className="w-full px-4 py-2 border border-gray-300 rounded" />
      <input name="phone" type="tel" placeholder="Celular" required className="w-full px-4 py-2 border border-gray-300 rounded" />
      <input name="date" type="date" required min={getTodayDate()} className="w-full px-4 py-2 border border-gray-300 rounded" />

      <select name="time" required className="w-full px-4 py-2 border border-gray-300 rounded">
        {generateTimeSlots().map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Horário comercial: 08:00–11:00 e 13:00–18:00 (intervalo de 30 min)
      </p>

      <select name="procedure" required className="w-full px-4 py-2 border border-gray-300 rounded">
        <option value="">Selecione o procedimento</option>
        {selectedTenant?.procedures?.map((proc) => (
          <option key={proc} value={proc}>{proc}</option>
        ))}
      </select>

      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
        Enviar solicitação
      </button>
    </form>
  );
}
