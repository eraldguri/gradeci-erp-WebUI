import { Injectable } from "@angular/core";
import { ALL_USERS, RESET_PASSWORD, UPDATE_USER } from "../data/constants/ApiConstants";
import { Observable, tap } from "rxjs";
import { UpdatePassword } from "../data/UpdatePassword";
import { BaseWebService } from "./base-web.service";
import { ApiResponse } from "../data/ApiResponse";

@Injectable({ 
    providedIn: 'root' 
})
export class UserService extends BaseWebService {

    getAllUsers(): Observable<ApiResponse<User[]>> {
        return this.get<User[]>(ALL_USERS);
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
}