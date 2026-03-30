import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RESET_PASSWORD, UPDATE_USER } from "../data/constants/ApiConstants";
import { Observable, tap } from "rxjs";
import { UpdatePassword } from "../data/UpdatePassword";

@Injectable({ 
    providedIn: 'root' 
})
export class UserService {
    private http = inject(HttpClient);

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