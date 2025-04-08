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
  console.log("Submitting solicitacao: ", data);

  const response = await fetch("/api/solicitacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar solicitação");
  }

  return await response.json();
}

export type LoginFormData = {
  Email: string;
  Password: string;
};

export async function submitLogin(data: LoginFormData) {
  console.log("Submitting login: ", data);

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  return await response.json();
}
