import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { Country, RestCountryResponse } from "../data/Country";
import { COUNTRIES_API } from "../data/constants/ApiConstants";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private http = inject(HttpClient);

    private errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly countries = toSignal(
        this.http.get<RestCountryResponse[]>(COUNTRIES_API).pipe(
            map(res => res.map(c => ({
                name: c.name.common,
                code: (c.idd.root || '') + (c.idd.suffixes?.[0] || ''),
                flag: c.flags.png
            }))
            .filter(c => c.code !== '')
            .sort((a, b) => a.name.localeCompare(b.name))
        ), catchError((err) => {
            this.errorSignal.set("Failed to load countries. Please try again later.");
            return of([]);
        })),
        { initialValue: [] as Country[] }
    );

}