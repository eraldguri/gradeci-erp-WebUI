export interface Country {
    name: string;
    code: string;
    flag: string;
}

export interface RestCountryResponse {
    name: {
        common: string;
    };
    idd: {
        root?: string;
        suffixes?: string[];
    };
    flags: {
        png: string;
        svg: string;
    }
}