import { TenantState } from "../state/tenantState";
import { TokenHandler } from "./tokenHandlers";

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
    
    TenantState.getInstance().setTenantId(resData.tenantId);

  } catch (err) {
    console.log(err)
    throw new Error("Erro ao fazer login");
  }

}
