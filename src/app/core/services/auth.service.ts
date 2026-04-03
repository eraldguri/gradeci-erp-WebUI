import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { LocalStorageService } from "./local-storage.service";
import { AUTH_TOKEN, USER_PREFS } from "../data/constants/UserSettingsConstants";
import { LOGIN } from "../data/constants/ApiConstants";
import { ApiResponse } from "../data/ApiResponse";

@Injectable({ 
    providedIn: 'root' 
})
export class AuthService {
    private http = inject(HttpClient);
    private storageService = inject(LocalStorageService);

    login(tenant: string, request: LoginRequest) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'tenant': tenant
        });

        return this.http.post<ApiResponse<LoginResponse>>(`${LOGIN}`, request, { headers: headers });
    }

    decodeToken<T = any>(token: string): T | null {
        try {
            const decoded = jwtDecode(token) as T;
            return decoded;
        } catch {
            return null;
        }
    }

    isLoggedIn(): boolean {
        if (!this.storageService.getItem(AUTH_TOKEN)) {
            return false;
        }
        return true;
    }

    logout(): void {
        this.storageService.clear();
        window.location.href = '/login';
    }
}