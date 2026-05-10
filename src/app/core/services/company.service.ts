import { Injectable } from "@angular/core";
import { BaseWebService } from "./base-web.service";
import { GET_ALL_COMPANIES } from "../data/constants/ApiConstants";
import { CompanyResponse } from "../data/company/CompanyResponse";
import { Observable } from "rxjs";
import { ApiResponse } from "../data/ApiResponse";

@Injectable({
  providedIn: "root",
})
export class CompanyService extends BaseWebService {
    
    getAllCompanies(): Observable<ApiResponse<CompanyResponse[]>> {
        return this.http.get<ApiResponse<CompanyResponse[]>>(GET_ALL_COMPANIES);
    }
}