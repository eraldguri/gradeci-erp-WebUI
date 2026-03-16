import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { tap } from "rxjs";
import { JwtPayload } from "../data/JwtPayload";
import { LocalStorageService } from "./local-storage.service";

@Injectable({ 
    providedIn: 'root' 
})
export class AuthService {
    private http = inject(HttpClient);
    private storageService = inject(LocalStorageService);
    private readonly API_URL = 'https://localhost:7114/api/Token/login';

    currentUser = signal<LoginResponse | null>(null);

    login(tenant: string, request: LoginRequest) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'tenant': tenant
        });

        return this.http.post<LoginResponse>(`${this.API_URL}`, request, { headers: headers }).pipe(
            tap(user => {
                this.currentUser.set(user);
            })
        );
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
        if (!this.storageService.getItem('user_prefs')) {
            return false;
        }
        return true;
    }
}