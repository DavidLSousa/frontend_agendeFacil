import { TenantStorage } from "../state/tenantStorage";
import { TokenHandler } from "./tokenHandlers";

export type LoginFormData = {
  Email: string;
  Password: string;
};

export async function submitLogin(data: LoginFormData) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const url = `${apiUrl}/api/auth/login`;
    
    const response = await fetch(url, {
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
    
    TenantStorage.getInstance().setTenant(resData.tenantDTO);

  } catch (err) {
    console.log(err)
    throw new Error("Erro ao fazer login");
  }

}
