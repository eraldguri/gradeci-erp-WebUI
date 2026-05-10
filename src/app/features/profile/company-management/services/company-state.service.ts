import { Injectable } from "@angular/core";
import { CompanyResponse } from "../../../../core/data/company/CompanyResponse";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CompanyStateService {
    private companySubject = new BehaviorSubject<CompanyResponse[]>([]);
    companies$ = this.companySubject.asObservable();

    setCompanies(companies: CompanyResponse[]): void {
        this.companySubject.next(companies);
    }

    addCompany(company: CompanyResponse): void {
        const currentCompanies = this.companySubject.getValue();
        this.companySubject.next([...currentCompanies, company]);
    }

    updateCompany(updatedCompany: CompanyResponse): void {
        const currentCompanies = this.companySubject.getValue();
        const updatedCompanies = currentCompanies.map(company => company.id === updatedCompany.id ? updatedCompany : company);
        this.companySubject.next(updatedCompanies);
    }

    deleteCompany(companyId: number): void {
        const currentCompanies = this.companySubject.getValue();
        const updatedCompanies = currentCompanies.filter(company => company.id !== companyId);
        this.companySubject.next(updatedCompanies);
    }
}