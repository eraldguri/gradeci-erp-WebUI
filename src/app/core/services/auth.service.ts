import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { LocalStorageService } from "./local-storage.service";
import { AUTH_TOKEN, USER_PREFS } from "../data/constants/UserSettingsConstants";
import { LOGIN, REFRESH_TOKEN } from "../data/constants/ApiConstants";
import { ApiResponse } from "../data/ApiResponse";
import { BaseWebService } from "./base-web.service";
import { RefreshTokenRequest } from "../data/RefreshTokenRequest";
import { Observable, tap, throwError } from "rxjs";

@Injectable({ 
    providedIn: 'root' 
})
export class AuthService extends BaseWebService {
    private storageService = inject(LocalStorageService);

    login(tenant: string, request: LoginRequest) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'tenant': tenant
        });

        return this.http.post<ApiResponse<LoginResponse>>(`${LOGIN}`, request, { headers: headers });
    }

    refreshToken(): Observable<ApiResponse<LoginResponse>> {
        const currentJwt = this.storageService.getItem<string>(AUTH_TOKEN);
        const currentRefreshToken = this.storageService.getItem<string>('refreshToken');
        const refreshTokenExpiryDate = this.storageService.getItem<string>('refreshTokenExpiryDate');

        // If data is missing, throw an error so the Interceptor can catch it and logout
        if (!currentJwt || !currentRefreshToken || !refreshTokenExpiryDate) {
            return throwError(() => new Error('Missing refresh metadata'));
        }

        const requestData: RefreshTokenRequest = {
            currentJwt,
            currentRefreshToken,
            refreshTokenExpiryDate
        };

        return this.http.post<ApiResponse<LoginResponse>>(`${REFRESH_TOKEN}`, requestData).pipe(
            tap(response => {
                this.storageService.setItem(AUTH_TOKEN, response.data.jwt);
                this.storageService.setItem('refreshToken', response.data.refreshToken);
            })
        );
    }

    // refreshToken(): void {
    //     const currentJwt = this.storageService.getItem<string>(AUTH_TOKEN);
    //     const currentRefreshToken = this.storageService.getItem<string>('refreshToken');
    //     const refreshTokenExpiryDate = this.storageService.getItem<string>('refreshTokenExpiryDate');

    //     if (!currentJwt || !currentRefreshToken || !refreshTokenExpiryDate) {
    //         this.logout();
    //         return;
    //     }

    //     const requestData: RefreshTokenRequest = {
    //         currentJwt: currentJwt,
    //         currentRefreshToken: currentRefreshToken,
    //         refreshTokenExpiryDate: refreshTokenExpiryDate
    //     };

    //     this.http.post<ApiResponse<LoginResponse>>(`${REFRESH_TOKEN}`, requestData).subscribe({
    //         next: (response) => {
    //             if (response.isSuccessful) {
    //                 this.storageService.setItem(AUTH_TOKEN, response.data.jwt);
    //                 this.storageService.setItem('refreshToken', response.data.refreshToken);
    //                 this.storageService.setItem('refreshTokenExpiryDate', response.data.refreshTokenExpiryDate);
    //             } else {
    //                 this.logout();
    //             }
    //         },
    //         error: () => {
    //             this.logout();
    //         }
    //     });
    // }

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