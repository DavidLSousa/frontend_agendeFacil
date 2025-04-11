export class TenantState {
  // Singleton
  private static instance: TenantState;
  private tenantId: string = "";

  private constructor() {}

  public static getInstance(): TenantState {
    if (!TenantState.instance) {
      TenantState.instance = new TenantState();
    }
    return TenantState.instance;
  }

  public setTenantId(id: string) {
    this.tenantId = id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }
}
