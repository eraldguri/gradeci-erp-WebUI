import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateTenant } from "../data/tenancy/CreateTenant";
import { ACTIVATE_TENANT, ADD_TENANT, DEACTIVATE_TENANT, GET_TENANT_BY_ID, GET_TENANTS, UPGRADE_TENANT } from "../data/constants/ApiConstants";
import { Observable } from "rxjs";
import { UpgradeTenant } from "../data/tenancy/UpgradeTenant";
import { TenantResponse } from "../data/tenancy/TenantResponse";
import { ApiResponse } from "../data/ApiResponse";
import { BaseWebService } from "./base-web.service";

@Injectable({
    providedIn: 'root'
})
export class TenantService extends BaseWebService {

    addTenant(tenant: CreateTenant): Observable<ApiResponse<string>> {
        return this.post<string>(`${ADD_TENANT}`, tenant);
    }

    activateTenant(tenantId: string): Observable<ApiResponse<string>> {
        return this.put<string>(ACTIVATE_TENANT.replace('{tenantId}', tenantId), {});
    }

    deactivateTenant(tenantId: string): Observable<ApiResponse<string>> {
        return this.put<string>(DEACTIVATE_TENANT.replace('{tenantId}', tenantId), {});
    }

    upgradeTenant(tenant: UpgradeTenant): Observable<ApiResponse<string>> {
        return this.put<string>(`${UPGRADE_TENANT}`, tenant);
    }

    getTenantById(tenantId: string): Observable<ApiResponse<TenantResponse>> {
        return this.get<TenantResponse>(`${GET_TENANT_BY_ID.replace('{tenantId}', tenantId)}`);
    }

    getTenants(): Observable<ApiResponse<TenantResponse[]>> {
        return this.get<TenantResponse[]>(GET_TENANTS);
    }
}