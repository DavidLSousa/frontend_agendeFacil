import { TenantDTO } from "../../types/TenantDTO";

export class TenantStorage {
  
  private static instance: TenantStorage;
  private STORAGE_KEY = 'tenant';
  private STORAGE_KEY_ID = 'tenantId';

  private constructor() {}

  public static getInstance(): TenantStorage {
    if (!TenantStorage.instance) {
      TenantStorage.instance = new TenantStorage();
    }
    return TenantStorage.instance;
  }

  public setTenant(tenant: TenantDTO) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tenant));
  }

  public setTenantId(id: string) {
    localStorage.setItem(this.STORAGE_KEY_ID, id);
  }

  public getTenant(): TenantDTO {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  public getTenantId(): string {
    return localStorage.getItem(this.STORAGE_KEY_ID) || '';
  }
}
