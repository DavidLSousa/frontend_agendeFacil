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
  console.log("Submitting solicitacao: ", data);

  const response = await fetch("http://localhost:5175/api/", {
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
  try {
    const response = await fetch('http://localhost:5175/api/auth/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const resData = await response.json();

    const tokenHandler = TokenHandler.getInstance();
    tokenHandler.setToken(resData.token);

  } catch (err) {
    console.log(err)
    throw new Error("Erro ao fazer login");
  }

}
