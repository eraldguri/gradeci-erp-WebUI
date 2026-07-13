import { Injectable, signal, computed } from '@angular/core';
import { 
    Country as CountryStateCity, 
    State as StateStateCity, 
    City as CityStateCity 
} from 'country-state-city';
import { Country, State, CityType } from '../data/Country';

@Injectable({
    providedIn: 'root'
})
export class CountryService {
    // Signals for reactive state management
    private countriesSignal = signal<Country[]>([]);
    private statesSignal = signal<State[]>([]);
    private citiesSignal = signal<CityType[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);

    // Public readonly signals
    readonly countries = this.countriesSignal.asReadonly();
    readonly states = this.statesSignal.asReadonly();
    readonly cities = this.citiesSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    // Computed values
    readonly countriesCount = computed(() => this.countriesSignal().length);

    constructor() {
        this.loadCountries();
    }

    /**
     * Load all countries with their details
     */
    private loadCountries(): void {
        try {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            const countriesData = CountryStateCity.getAllCountries();
            const countries: Country[] = countriesData.map(c => ({
                name: c.name,
                code: c.isoCode,
                phoneCode: c.phonecode,
                flag: c.flag,
                currency: c.currency,
                isoCode: c.isoCode,
                timezones: c.timezones
            }));

            // Sort alphabetically
            const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
            
            this.countriesSignal.set(sortedCountries);
            this.loadingSignal.set(false);
        } catch (error) {
            this.errorSignal.set('Failed to load countries. Please try again later.');
            this.loadingSignal.set(false);
            console.error('Error loading countries:', error);
        }
    }

    /**
     * Get states for a specific country
     */
    loadStates(countryCode: string): void {
        try {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            const statesData = StateStateCity.getStatesOfCountry(countryCode);
            const states: State[] = statesData.map(s => ({
                name: s.name,
                isoCode: s.isoCode,
                countryCode: s.countryCode
            }));

            const sortedStates = states.sort((a, b) => a.name.localeCompare(b.name));
            
            this.statesSignal.set(sortedStates);
            this.loadingSignal.set(false);
        } catch (error) {
            this.errorSignal.set('Failed to load states. Please try again later.');
            this.loadingSignal.set(false);
            console.error('Error loading states:', error);
        }
    }

    /**
     * Get cities for a specific state
     */
    loadCities(stateCode: string, countryCode: string): void {
        try {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            const citiesData = CityStateCity.getCitiesOfState(countryCode, stateCode);
            const cities: CityType[] = citiesData.map(c => ({
                name: c.name,
                stateCode: c.stateCode,
                countryCode: c.countryCode
            }));

            const sortedCities = cities.sort((a, b) => a.name.localeCompare(b.name));
            
            this.citiesSignal.set(sortedCities);
            this.loadingSignal.set(false);
        } catch (error) {
            this.errorSignal.set('Failed to load cities. Please try again later.');
            this.loadingSignal.set(false);
            console.error('Error loading cities:', error);
        }
    }

    /**
     * Get a specific country by ISO code
     */
    getCountryByCode(isoCode: string): Country | undefined {
        return this.countriesSignal().find(c => c.isoCode === isoCode);
    }

    /**
     * Get a specific state by ISO code
     */
    getStateByCode(stateCode: string): State | undefined {
        return this.statesSignal().find(s => s.isoCode === stateCode);
    }

    /**
     * Get country name from ISO code
     */
    getCountryName(isoCode: string): string {
        const country = this.getCountryByCode(isoCode);
        return country?.name || isoCode;
    }

    /**
     * Get country flag from ISO code
     */
    getCountryFlag(isoCode: string): string {
        const country = this.getCountryByCode(isoCode);
        return country?.flag || '';
    }

    /**
     * Get country phone code from ISO code
     */
    getCountryPhoneCode(isoCode: string): string {
        const country = this.getCountryByCode(isoCode);
        return country?.phoneCode || '';
    }

    /**
     * Get country currency from ISO code
     */
    getCountryCurrency(isoCode: string): string {
        const country = this.getCountryByCode(isoCode);
        return country?.currency || '';
    }

    /**
     * Search countries by name or code
     */
    searchCountries(searchTerm: string): Country[] {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return this.countriesSignal();
        
        return this.countriesSignal().filter(c => 
            c.name.toLowerCase().includes(term) ||
            c.isoCode.toLowerCase().includes(term) ||
            c.phoneCode.includes(term)
        );
    }

    /**
     * Clear states (e.g., when country changes)
     */
    clearStates(): void {
        this.statesSignal.set([]);
    }

    /**
     * Clear cities (e.g., when state changes)
     */
    clearCities(): void {
        this.citiesSignal.set([]);
    }

    /**
     * Reload all data
     */
    reload(): void {
        this.loadCountries();
    }
}