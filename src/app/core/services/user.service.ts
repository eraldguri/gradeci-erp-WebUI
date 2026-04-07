import { Injectable } from "@angular/core";
import { ALL_USERS, REGISTER_USER, RESET_PASSWORD, UPDATE_ROLES, UPDATE_STATUS, UPDATE_USER, USER_ROLES_BY_USER_ID } from "../data/constants/ApiConstants";
import { Observable, tap } from "rxjs";
import { UpdatePassword } from "../data/UpdatePassword";
import { BaseWebService } from "./base-web.service";
import { ApiResponse } from "../data/ApiResponse";
import { RegisterUserRequest } from "../data/users/RegisterUserRequest";

@Injectable({ 
    providedIn: 'root' 
})
export class UserService extends BaseWebService {

    getAllUsers(): Observable<ApiResponse<User[]>> {
        return this.get<User[]>(ALL_USERS);
    }

    registerUser(request: RegisterUserRequest): Observable<ApiResponse<string>> {
        return this.post(REGISTER_USER, request);
    }

    updateUser(request: UpdateUser) {
        return this.http.put(`${UPDATE_USER}`, request).pipe(
            tap(response => {
                // console.log(response);
            })
        );
    }

    resetPassword(updatePassword: UpdatePassword): Observable<any> {
        return this.http.put(`${RESET_PASSWORD}`, updatePassword);
    }

    getUserRoles(userId: string): Observable<ApiResponse<UserRolesResponse[]>> {
        return this.http.get<ApiResponse<UserRolesResponse[]>>(`${USER_ROLES_BY_USER_ID.replace('{userId}', userId)}`);
    }

    updateStatus(userId: string, status: boolean): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(UPDATE_STATUS, { userId, status });
    }

    updateUserRoles(userId: string, request: UpdateUserRoles): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>(`${UPDATE_ROLES.replace('{userId}', userId)}`, request);
    }
}