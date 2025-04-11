import { TokenHandler } from "./auth/tokenHandlers";

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

  const response = await fetch("http://localhost:5175/api/user", {
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
