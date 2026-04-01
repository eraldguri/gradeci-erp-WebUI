import { Injectable } from "@angular/core";
import { TenantResponse } from "../../../../core/data/tenancy/TenantResponse";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TenantStateService {
    private tenantSubject = new BehaviorSubject<TenantResponse[]>([]);
    tenants$ = this.tenantSubject.asObservable();

    setTenants(tenants: TenantResponse[]): void {
        this.tenantSubject.next(tenants);
    }

    addTenant(tenant: TenantResponse): void {
        const currentTenants = this.tenantSubject.getValue();
        this.tenantSubject.next([...currentTenants, tenant]);
    }

    updateTenant(updatedTenant: TenantResponse): void {
        const currentTenants = this.tenantSubject.getValue();
        const updatedTenants = currentTenants.map(tenant => tenant.identifier === updatedTenant.identifier ? updatedTenant : tenant);
        this.tenantSubject.next(updatedTenants);
        console.log('Tenant updated:', updatedTenant);
    }

    deleteTenant(tenantId: string): void {
        const currentTenants = this.tenantSubject.getValue();
        const updatedTenants = currentTenants.filter(tenant => tenant.identifier !== tenantId);
        this.tenantSubject.next(updatedTenants);
    }

}