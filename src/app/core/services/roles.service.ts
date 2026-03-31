import { Observable } from "rxjs";
import { RoleResponse } from "../data/roles/RoleResponse";
import { BaseWebService } from "./base-web.service";
import { ApiResponse } from "../data/ApiResponse";
import { GET_ALL_ROLES } from "../data/constants/ApiConstants";

export class RolesService extends BaseWebService {

	getAllRoles(): Observable<ApiResponse<RoleResponse[]>> {
		return this.get<RoleResponse[]>(GET_ALL_ROLES);
	}
}