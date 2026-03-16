export interface JwtPayload {
    [NAME_IDENTIFIER]: string;
    [EMAIL_ADDRESS]: string;
    [NAME]: string;
    [SURNAME]: string;
    [MOBILE_PHONE]: string;
    [ROLE]: string;
    tenant: string;
    permission: string[];
}

export const NAME_IDENTIFIER = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
export const EMAIL_ADDRESS = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
export const NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
export const SURNAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
export const MOBILE_PHONE = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone";
export const ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";