import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../data/ApiResponse";

@Injectable({
    providedIn: 'root'
})
export class BaseWebService {
    protected http = inject(HttpClient);

    get<T>(url: string): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(url);
    }

    post<T>(url: string, data: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(url, data);
    }
    
    put<T>(url: string, data: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(url, data);
    }

    delete<T>(url: string): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(url);
    }
}