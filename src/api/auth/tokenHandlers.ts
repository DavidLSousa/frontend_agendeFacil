
export class TokenHandler {
  
  private static instance: TokenHandler | null = null;
  private readonly STORAGE_KEY = 'token';

  private constructor() {}

  public static getInstance(): TokenHandler {
    if (this.instance === null) {
      this.instance = new TokenHandler();
    }
    return this.instance;
  }

  public setToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  public clearToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

}