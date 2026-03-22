import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UPDATE_USER } from "../data/constants/ApiConstants";
import { tap } from "rxjs";

@Injectable({ 
    providedIn: 'root' 
})
export class UserService {
    private http = inject(HttpClient);

    updateUser(request: UpdateUser) {
        return this.http.put(`${UPDATE_USER}`, request).pipe(
            tap(response => {
                console.log(response);
            })
        );
    }
}