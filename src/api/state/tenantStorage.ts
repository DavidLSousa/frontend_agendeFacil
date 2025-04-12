export class TenantStorage {
  
  private static instance: TenantStorage;
  private STORAGE_KEY = 'tenantId';

  private constructor() {}

  public static getInstance(): TenantStorage {
    if (!TenantStorage.instance) {
      TenantStorage.instance = new TenantStorage();
    }
    return TenantStorage.instance;
  }

  public setTenantId(id: string) {
    localStorage.setItem(this.STORAGE_KEY, id);
  }

  public getTenantId(): string {
    return localStorage.getItem(this.STORAGE_KEY) || '';
  }
}
