import { TokenHandler } from "./auth/tokenHandlers";
import { TenantStorage } from "./state/tenantStorage";

export type SolicitacaoFormData = {
  Date: string;
  Time: string;
  Procedure: string;
  User: {
    Name: string;
    Email: string;
    Phone: string;
  };
};

export async function submitSolicitacao(data: SolicitacaoFormData) {

  const tenantId = TenantStorage.getInstance().getTenantId();

  if (!tenantId) {
    // Deve aparecer um pop que fecha automaticamente em 3 segundos;
    throw new Error("Tenant ID não encontrado");
  }

  const url = `http://localhost:5175/api/user/${tenantId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${TokenHandler.getInstance().getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar solicitação");
  }

  return await response.json();
}
