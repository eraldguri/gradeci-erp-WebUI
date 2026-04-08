import { Observable } from "rxjs";
import { RoleResponse } from "../data/roles/RoleResponse";
import { BaseWebService } from "./base-web.service";
import { ApiResponse } from "../data/ApiResponse";
import { GET_ALL_ROLES, GET_ROLE_BY_FULL_ID } from "../data/constants/ApiConstants";
import { Injectable } from "@angular/core";

@Injectable({ 
	providedIn: 'root' 
})
export class RolesService extends BaseWebService {

	getAllRoles(): Observable<ApiResponse<RoleResponse[]>> {
		return this.get<RoleResponse[]>(GET_ALL_ROLES);
	}

	getFullRoleDetails(roleId: string): Observable<ApiResponse<RoleResponse>> {
		return this.get<RoleResponse>(`${GET_ROLE_BY_FULL_ID}/${roleId}`);
	}
}