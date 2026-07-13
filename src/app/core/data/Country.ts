// data/Country.ts

// This matches the country-state-city package's Country type
export interface CountryStateCityData {
    name: string;
    isoCode: string;
    phonecode: string;
    flag: string;
    currency: string;
    timezones?: any[];
}

// This matches the country-state-city package's State type
export interface StateStateCityData {
    name: string;
    isoCode: string;
    countryCode: string;
}

// This matches the country-state-city package's City type
export interface CityStateCityData {
    name: string;
    stateCode: string;
    countryCode: string;
}

// Your application's simplified Country type
export interface Country {
    name: string;
    code: string;
    phoneCode: string;
    flag: string;
    currency: string;
    isoCode: string;
    timezones?: any[];
}

// Your application's simplified State type
export interface State {
    name: string;
    isoCode: string;
    countryCode: string;
}

// Your application's simplified City type
export interface CityType {
    name: string;
    stateCode: string;
    countryCode: string;
}

// For backward compatibility with your existing code
export interface RestCountryResponse {
    name: {
        common: string;
    };
    idd: {
        root: string;
        suffixes: string[];
    };
    flags: {
        png: string;
    };
}